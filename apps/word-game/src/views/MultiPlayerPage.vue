<template>
  <transition name="fade-x" appear>
    <div class="h-screen w-screen transition duration-500 transform overflow-hidden">
      <bigPrompt @replay="newGame" class="absolute z-50" :shown="showPrompt" :message="gameEndMsg"
        :replayPrompt="true" />
      <loading :show="loading" />
      <div class="flex xl:p-10 h-screen w-screen justify-center items-center xl:gap-5 relative z-0"
        data-test="MultiPlayer">
        <transition name="fade-left" appear>
          <div
            class="w-2/12 bg-gray-50 xl:shadow-2xl xl:rounded-3xl h-full transform transition duration-1000 delay-300 flex justify-center items-center flex-col border-l-2 border-gray-500 xl:border-0">
            <UserScore :users="playingUsers" />
            <div :class="{ 'opacity-80': textCopied, 'opacity-100': !textCopied }"
              class="flex justify-start items-center w-11/12 gap-2 bg-gray-100 shadow-lg rounded-2xl px-4 py-2 flex-col mb-2 transition duration-500">
              <h1 class="w-full">Invite Your Friends With this code</h1>
              <div @keyup.prevent.stop
                class="bg-gray-200 shadow-xl truncate whitespace-nowrap px-1 py-1 rounded-lg text-sm relative w-full pr-12"
                tabindex="-1">
                {{ roomId }}
                <span @click="copyRoomId" :class="{ 'bg-blue-300': textCopied, 'bg-blue-400': !textCopied }"
                  class="px-1 py-0.5 absolute right-1 top-1 bottom-1 h-5 flex justify-center items-center hover:-translate-y-0.5 transform transition duration-300 rounded-md cursor-pointer shadow-lg">{{
                      textCopied ? "copied" : "copy"
                  }}</span>
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade-down" appear>
          <div
            class="w-7/12 bg-gray-50 xl:shadow-2xl xl:rounded-3xl h-full transform transition duration-1000 delay-300 border-l-2 border-gray-500 xl:border-0">
            <Game @guessedWord="handleGuess" :word="word" :lettersLeft="lettersLeft" :round="round" id="gameContainer"
              :gameTimeStamp="gameTimeStamp" :alreadyGuessedPush="alreadyGuessed"
              :guessLock="guessLock || deadLock || lettersLeft < 1" />
          </div>
        </transition>

        <transition name="fade-right" appear>
          <div
            class="w-3/12 bg-gray-50 xl:shadow-2xl xl:rounded-3xl h-full transform transition duration-1000 delay-300 border-l-2 border-gray-500 xl:border-0">
            <Chat :users="users" :chatMsgToPush="chatMsgToPush" :playingUser="playingUser" id="chatContainer"
              :sp="false" @msgSend="sendMsg" />
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import Chat from '../components/chat.vue';
import Game from '../components/game.vue';
import UserScore from '../components/userScore.vue';
import BigPrompt from '../components/bigPrompt.vue';
import { wait } from 'shared';
import { io } from 'socket.io-client';
import Loading from "../components/loading.vue";

export default {
  data() {
    return {
      round: 0,
      deadLock: false,
      playerName: '',
      roomId: '',
      socket: null,
      showPrompt: false,
      gameEndMsg: '',
      playingUser: null,
      gameTimeStamp: Date.now(),
      alreadyGuessed: [],
      users: {},
      playingUsers: {},
      word: [],
      letterCount: 0,
      lettersLeft: 0,
      chatMsgToPush: {
        msg: '',
        timeStamp: new Date()
      },
      guessLock: false,
      textCopied: false,
      nextRoomId: "lobby",
      loading: true,
      newGameInit: false,
    };
  },
  methods: {
    async handleGuess(letter, correct) {
      if (this.guessLock) return;
      this.guessLock = true;

      this.socket.emit('guess', {
        letter,
        correct,
        userId: this.playingUser.id,
      });

      this.guessLock = false;
    },
    async startGame() {
      this.socket.emit('startGame');
    },
    botSpeak(msg) {
      this.chatMsgToPush = {
        userId: 0,
        message: msg,
        timeStamp: new Date()
      };
    },
    async connectSocket() {

      this.reset();

      if (this.socket) this.socket.close();

      this.loading = true;
      this.socket = io.connect(`${import.meta.env.VITE_HOST}`, {
        transports: ['polling'],
        upgrade: false,
        rejectUnauthorized: false,
        secure: true,
      },
        { 'force new connection': true }
      );

      this.playerName = this.$route.params.playerName;
      this.roomId = this.$route.params.roomId;
      this.socket.once('connect', async () => {

        this.playingUser = this.socket.id;

        this.users[this.playingUser.id] = {
          id: this.playingUser,
          name: this.playerName,
          lives: 10,
          score: 0,
          img: `https://thecatapi.com/api/images/get?format=src&type=jpg&cache=${Date.now()}`,
        };

        console.log('connected');

        this.socket.emit('join', this.users[this.playingUser.id], this.roomId);


        await wait(1000);
        this.loading = false;
      });

      this.socket.on('bot', (msg) => {
        this.botSpeak(msg);
      });

      this.socket.on('roomUsersState', (roomUsers, state) => {
        this.users = roomUsers;
        this.readState(state);
        if (this.users[this.playingUser].lives <= 0) this.deadLock = true;
        else this.deadLock = false;
      });

      this.socket.on('chatMsg', (msg) => {

        this.chatMsgToPush = {
          ...msg,
          timeStamp: new Date()
        };
      });

      this.socket.on('startGame', (users, state) => {
        this.users = users;
        this.readState(state);
      });

      this.socket.once("advanceRound", (users, state) => {
        this.users = users;
        this.readState(state);
      });

    },
    sendMsg(msg) {
      this.socket.emit('chatMsg', msg);
    },
    async handleGuess(letter, correct) {
      if (this.deadLock || this.guessLock) return;
      this.guessLock = true;
      this.socket.emit('guessed', letter, correct);
      await wait(200);
      this.guessLock = false;
    },
    reset() {
      this.round = 0;
      this.letterCount = 0;
      this.lettersLeft = 10;
      this.word = [];
      this.alreadyGuessed = 0;
      this.nextRoomId = "0000-0000-0000-0000";
    },
    readState(state) {
      if (!state) {
        console.log("NO STATE");
        setTimeout(() => this.socket.emit('getState'), 250);
        return;
      }
      else {
        this.round = state.round;
        this.letterCount = state.letterCount;
        this.lettersLeft = state.lettersLeft;
        this.word = state.word;
        this.alreadyGuessed = state.alreadyGuessed;
        this.nextRoomId = state.nextRoomId;
        console.log(this.nextRoomId);

        this.playingUsers = Object.entries(this.users).filter((e) => e[0] != "0").sort((a, b) => {
          return b[1].score - a[1].score;
        });

        console.log(this.playingUsers);

        if (state && state.round > 5 && !this.newGameInit) {
          this.rounds = -1;
          this.showPrompt = true;
          console.log("set true");
          this.gameEndMsg = 'Game Over < ' + this.playingUsers[0][1].name + ' > won!';
        }
      }
    },
    newGame() {
      this.$router.push({
        name: 'multiplayer',
        params: {
          playerName: this.playerName,
          roomId: this.nextRoomId
        }
      });
      setTimeout(() => window.location.reload(), 100);
    },
    copyRoomId() {
      if (!navigator.clipboard) {
        const el = document.createElement('textarea');
        el.value = this.roomId;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      } else {
        const proxy = this;
        navigator.clipboard.writeText(this.roomId).then(
          function () {
            proxy.textCopied = true;
          })
          .catch(
            function () {
              proxy.textCopied = false;
            });
      }
    }
  },
  created() {
    window.addEventListener('beforeunload', () => {
      // this.socket.emit('leave');
      this.socket.close();
    });
  },
  async mounted() {
    console.log("mounted");
    this.connectSocket();
  },
  beforeUnmount() {
    // this.socket.emit('leave');
    this.socket.close();
  },
  components: {
    Chat,
    Game,
    UserScore,
    BigPrompt,
    Loading
  },
};
</script>