<template>
  <transition name="fade-x" appear>
    <div class="h-screen w-screen transition duration-500 transform overflow-hidden">
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
            <UserScore :users="playingUsers" />
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
              :lives="this.users[this.playingUser.id]?.lives || null"
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
              :sp="true"
            />
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import Chat from '../components/chat.vue'
import Game from '../components/game.vue'
import UserScore from '../components/userScore.vue';
import BigPrompt from '../components/bigPrompt.vue';
import { map, wait, getWordArray, words } from 'shared';
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      round: 0,
      showPrompt: false,
      gameEndMsg: '',
      playingUser: {
        id: uuidv4(),
      },
      gameTimeStamp: Date.now(),
      users: {
        '0': {
          name: 'Guess Bot',
          lives: Infinity,
          score: Infinity,
          img: 'https://i.pravatar.cc/300?img=10',
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
      playingUsers: {}
    }
  },
  methods: {
    async handleGuess(letter, correct) {
      if (this.guessLock) {
        console.log('skipped')
        return;
      }
      else {
        console.log(this.guessLock);
        this.guessLock = true;
        if (this.lettersLeft > 0) {

          await wait(50);

          this.botSpeak(`${this.users[this.playingUser.id].name} guessed ${letter}`);

          await wait(500 + Math.random() * 1000);

          if (correct) {
            this.handleCorrectGuess(letter);

            //check if letter in word and display guess text
            this.botSpeak(`${letter} is in the word! ${this.users[this.playingUser.id].name} scores some points`);

            await wait(300);

            if (this.lettersLeft <= 0) {
              this.gameEndMsg = 'You Win!';
              this.showPrompt = true;
              await this.$lf.setItem('currentRound', this.round);
            }
          }
          else {
            this.users[this.playingUser.id].lives--;
            this.botSpeak(`${letter} is not in the word! :c ${this.users[this.playingUser.id].name} loses a life`);
          }
          if (this.users[this.playingUser.id].lives <= 0) {
            this.gameEndMsg = 'You Lost :c womp wooomp';
            this.showPrompt = true;
            await this.$lf.setItem('currentRound', this.round);
          }
        }

        this.playingUsers = Object.entries(this.users).filter((e) => e[0] != "0").sort((a, b) => {
          return b[1].score - a[1].score;
        });

        await this.$lf.setItem('spUser', JSON.stringify(this.users[this.playingUser.id]));
        this.guessLock = false;
      }

    },
    handleCorrectGuess(inputLetter) {
      this.word.map(letter => {
        if (letter.ltr.toLowerCase() == inputLetter.toLowerCase()) {
          letter.isGuessed = true;
          this.users[this.playingUser.id].score += Math.ceil(map(this.lettersLeft, this.letterCount, 0, 20, 0));
          this.lettersLeft--;
          console.log(this.lettersLeft, this.letterCount);
        }
      });
    },
    async startGame() {

      this.gameTimeStamp = Date.now();
      this.showPrompt = false;
      this.round++;
      this.users[this.playingUser.id].lives = 5;
      this.word = getWordArray(words[Math.floor(Math.random() * words.length)]);
      this.word.forEach(letter => {
        if (letter.ltr != ' ') this.letterCount++;
        if (!letter.isGuessed) {
          this.lettersLeft++;
        }
      });

      console.log(this.lettersLeft, this.letterCount);
    },
    botSpeak(msg) {
      this.chatMsgToPush = {
        userId: '0',
        message: msg,
        timeStamp: new Date()
      }
    }
  },
  async mounted() {

    this.users[this.playingUser.id] = JSON.parse(await this.$lf.getItem('spUser'));



    if (this.users[this.playingUser.id] == null) {
      this.users[this.playingUser.id] = {
        id: this.playingUser,
        name: "You",
        lives: 5,
        score: 0,
        img: `https://thecatapi.com/api/images/get?format=src&type=jpg&cache=${Date.now()}`,
      }
    }

    this.playingUsers = Object.entries(this.users).filter((e) => e[0] != "0").sort((a, b) => {
      return b[1].score - a[1].score;
    });

    console.log(this.users);

    //get random word
    this.round = await this.$lf.getItem('currentRound');

    await this.startGame();

    await wait(2000);

    //check if letter in word and display guess text
    this.botSpeak(`Welcome to the game! ${this.users[this.playingUser.id].name} starts the game`);

    await wait(500);

    this.botSpeak(`the word you have to guess has ${this.lettersLeft} letters`);

  },
  components: {
    Chat,
    Game,
    UserScore,
    BigPrompt
  }
}
</script>