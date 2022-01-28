<template>
  <bigPrompt
    @replay="startGame"
    class="absolute z-50"
    :shown="showPrompt"
    :message="gameEndMsg"
    :replayPrompt="true"
  />
  <div
    class="flex p-10 h-screen w-screen justify-center items-center gap-5 relative z-0 bg-gradient-to-br from-sky-400 to-blue-600"
    data-test="MultiPlayer"
  >
    <transition name="fade-left" appear>
      <div
        class="w-2/12 bg-gray-50 shadow-2xl rounded-3xl h-full transform transition duration-1000 delay-300 flex justify-center items-center flex-col"
      >
        <UserScore :users="users" />
        <div
          class="flex justify-start items-center w-full gap-2 bg-gray-100 shadow-lg rounded-2xl px-4 py-2 flex-col"
        >
          <h1 class="w-full">Invite Your Friends With this code</h1>
          <div
            @keyup.prevent.stop
            class="bg-gray-200 shadow-xl truncate whitespace-nowrap px-1 py-1 rounded-lg"
            tabindex="-1"
          >{{ roomId }}</div>
        </div>
      </div>
    </transition>
    <transition name="fade-down" appear>
      <div
        class="w-7/12 bg-gray-50 shadow-2xl rounded-3xl h-full transform transition duration-1000 delay-300"
      >
        <Game
          @guessedWord="handleGuess"
          :word="word"
          :lettersLeft="lettersLeft"
          :round="round"
          id="gameContainer"
          :gameTimeStamp="gameTimeStamp"
          :alreadyGuessedPush="alreadyGuessed"
          :guessLock="guessLock"
        />
      </div>
    </transition>

    <transition name="fade-right" appear>
      <div
        class="w-3/12 bg-gray-50 shadow-2xl rounded-3xl h-full transform transition duration-1000 delay-300"
      >
        <Chat
          :users="users"
          :chatMsgToPush="chatMsgToPush"
          :playingUser="playingUser"
          id="chatContainer"
          :sp="false"
          @msgSend="sendMsg"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Chat from '../components/chat.vue'
import Game from '../components/game.vue'
import UserScore from '../components/userScore.vue';
import BigPrompt from '../components/bigPrompt.vue';
import { wait } from 'shared';
import { io } from 'socket.io-client';

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
      word: [],
      letterCount: 0,
      lettersLeft: 0,
      chatMsgToPush: {
        msg: '',
        timeStamp: new Date()
      },
      guessLock: false,
    }
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
      }
    },
    connectSocket() {
      this.socket = io(`ws://${import.meta.env.VITE_HOST}`);

      this.playerName = this.$route.params.playerName;
      this.roomId = this.$route.params.roomId;
      this.socket.on('connect', () => {

        this.playingUser = this.socket.id;

        this.users[this.playingUser.id] = {
          id: this.playingUser,
          name: this.playerName,
          lives: 10,
          score: 0,
          img: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 10)}`
        }

        console.log('connected');

        this.socket.emit('join', this.users[this.playingUser.id], this.roomId);
      });

      this.socket.on('bot', (msg) => {
        this.botSpeak(msg);
      });

      this.socket.on('roomUsersState', (roomUsers, state) => {
        this.users = roomUsers;
        this.readState(state);
        if (this.users[this.playingUser].lives <= 0) this.deadLock = true;
        else this.deadLock = false;
      })

      // this.socket.on('gameEnd', (msg) => {
      //   this.gameEndMsg = msg;
      //   this.showPrompt = true;
      // });

      this.socket.on('chatMsg', (msg) => {

        this.chatMsgToPush = {
          ...msg,
          timeStamp: new Date()
        }

        console.log(this.chatMsgToPush)
      });

      this.socket.on('startGame', (users, state) => {
        this.users = users;
        this.readState(state)
        console.log('start game', state);
      });

    },
    sendMsg(msg) {
      this.socket.emit('chatMsg', msg);
    },
    async handleGuess(letter, correct) {
      if (this.deadLock || this.guessLock) return;
      this.guessLock = true;
      this.socket.emit('guessed', letter, correct);
      await wait(500);
      this.guessLock = false;
    },
    readState(state) {
      if (!state) return;
      this.round = state.round;
      this.letterCount = state.letterCount;
      this.lettersLeft = state.lettersLeft;
      this.word = state.word;
      this.alreadyGuessed = state.alreadyGuessed;
      console.log(state.alreadyGuessed)
    }
  },
  created() {
    window.addEventListener('beforeunload', () => {
      // this.socket.emit('leave');
      this.socket.close();
    })
  },
  async mounted() {
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
    BigPrompt
  },
}
</script>