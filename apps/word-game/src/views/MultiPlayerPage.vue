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
      socket: null,
      showPrompt: false,
      gameEndMsg: '',
      playingUser: null,
      gameTimeStamp: Date.now(),
      users: {
        '0': {
          name: 'Guess Bot',
          lives: Infinity,
          score: Infinity,
          img: 'https://i.pravatar.cc/300?img=1',
        }
      },
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
        msg: msg,
        timeStamp: new Date()
      }
    },
    connectSocket() {
      this.socket = io('ws://localhost:3001');

      this.socket.on('connect', () => {

        this.playingUser = this.socket.id;

        this.users[this.playingUser.id] = {
          id: this.playingUser,
          name: 'Player ' + Object.keys(this.users).length,
          lives: 3,
          score: 0,
          img: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 10)}`
        }

        console.log('connected');

        this.socket.emit('join', this.users[this.playingUser.id], 'room1');
      });

      this.socket.on('bot', (msg) => {
        this.botSpeak(msg);
      });

      this.socket.on('roomUsersState', (roomUsers) => {
        console.log(roomUsers)
        this.users = roomUsers;
      })

      this.socket.on('gameEnd', (msg) => {
        this.gameEndMsg = msg;
        this.showPrompt = true;
      });

      this.socket.on('userState', (user) => {
        this.users[user.userId] = user;
      });

      this.socket.on('chatMsg', (msg) => {

        this.chatMsgToPush = {
          ...msg,
          timeStamp: new Date()
        }

        console.log(this.chatMsgToPush)
      });

    },
    sendMsg(msg) {
      this.socket.emit('chatMsg', msg);
    }
  },
  async mounted() {
    this.connectSocket();
  },
  components: {
    Chat,
    Game,
    UserScore,
    BigPrompt
  }
}
</script>