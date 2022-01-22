<template>
  <bigPrompt
    @replay="startGame"
    class="absolute z-50"
    :shown="showPrompt"
    :message="gameEndMsg"
    :replayPrompt="true"
  />
  <div
    class="flex p-10 h-screen w-screen justify-center items-center gap-5 relative z-0"
    data-test="singlePlayer"
  >
    <transition name="fade-left" appear>
      <div
        class="w-2/12 bg-gray-50 shadow-2xl rounded-3xl h-full transform transition duration-1000 delay-300"
      >
        <UserScore :users="users" />
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
import { map, wait, getWordArray, words } from 'shared';
import { v4 as uuidv4 } from 'uuid';
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
      this.socket = io('ws://localhost:3001');

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
    handleGuess(letter, correct) {
      if (this.deadLock) return;
      console.log('guess', letter, correct);
      this.socket.emit('guessed', letter, correct);
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