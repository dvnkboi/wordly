<template>
  <!--//!message a voir quand qlqun perd ou gagne -->
  <bigPrompt
    @replay="startGame"
    class="absolute z-50"
    :shown="showPrompt"
    :message="gameEndMsg"
    :replayPrompt="true"
  />
  <!-- //!toute la page -->
  <div
    class="flex p-10 h-screen w-screen justify-center items-center gap-5 relative z-0 bg-gradient-to-br from-sky-400 to-blue-600"
    data-test="singlePlayer"
  >
    <transition name="fade-left" appear>
      <!-- //! liste de scores des utilisateurs  -->
      <div
        class="w-2/12 bg-gray-50 shadow-2xl rounded-3xl h-full transform transition duration-1000 delay-300"
      >
        <UserScore :users="users" />
      </div>
    </transition>
    <transition name="fade-down" appear>
      <!-- //! jeu -->
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
      <!--//!chat -->
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
    }
  },
  methods: {
    //! logique pour traiter la saisie d'une lettre (traitement des cas si lettre et correct ou pas)
    async handleGuess(letter, correct) {
      //? si l'utilisatuer appuis successivement de maniere rapide sur une lettre, on le bloque pour un moment
      if (this.guessLock) {
        return;
      }
      else {
        this.guessLock = true;

        //? si on a de lettre a deviner
        if (this.lettersLeft > 0) {

          await wait(50);

          //? confirm que l'utilisateur a cliquer sur un mot dans le chat
          this.botSpeak(`${this.users[this.playingUser.id].name} guessed ${letter}`);

          //? attend que le bot ait parler
          await wait(500 + Math.random() * 1000);

          //? si la lettre est correcte
          if (correct) {
            this.handleCorrectGuess(letter);

            //check if letter in word and display guess text
            this.botSpeak(`${letter} is in the word! ${this.users[this.playingUser.id].name} scores some points`);

            await wait(300);

            //? si la partie est finie
            if (this.lettersLeft <= 0) {
              this.gameEndMsg = 'You Win!';
              this.showPrompt = true;
              await this.$lf.setItem('currentRound', this.round);
            }
          }
          //? si la lettre est incorrecte
          else {
            this.users[this.playingUser.id].lives--;
            this.botSpeak(`${letter} is not in the word! :c ${this.users[this.playingUser.id].name} loses a life`);
          }
          //? si le joueur est mort
          if (this.users[this.playingUser.id].lives <= 0) {
            this.gameEndMsg = 'You Lost :c womp wooomp';
            this.showPrompt = true;
            await this.$lf.setItem('currentRound', this.round);
          }
        }
        //? sauvegarde du score
        await this.$lf.setItem('spUser', JSON.stringify(this.users[this.playingUser.id]));
        this.guessLock = false;
      }

    },
    //! quand la lettre devinee est correcte
    handleCorrectGuess(inputLetter) {
      //? si la lettre est dans le mot
      this.word.map(letter => {
        if (letter.ltr.toLowerCase() == inputLetter.toLowerCase()) {
          letter.isGuessed = true;

          //? mapper les lettres du mot avec le score qu'on va avoir, 20 pour la premiere lettre, 1 pour la derniere
          this.users[this.playingUser.id].score += Math.ceil(map(this.lettersLeft, this.letterCount, 0, 20, 0));
          this.lettersLeft--;
        }
      });
    },
    //! quand le joueur clique sur le bouton "rejouer"
    async startGame() {

      //? reinitialise la session, remet les vie a 5, augmente le round ...
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
    },
    //! message que le bot va parler
    botSpeak(msg) {
      this.chatMsgToPush = {
        userId: '0',
        message: msg,
        timeStamp: new Date()
      }
    }
  },
  // ! ce que ce passe quand la page est chargée
  async mounted() {
    //? restaurer l'etat precedent de l'utilisateur 
    // string "{user: 1}" => objet {user:1} || object.user => 1  
    this.users[this.playingUser.id] = JSON.parse(await this.$lf.getItem('spUser'));

    //?creer nouveau utilisateur si on est la premiere fois
    if (this.users[this.playingUser.id] == null) {
      this.users[this.playingUser.id] = {
        name: 'You',
        lives: 5,
        score: 0,
        img: 'https://i.pravatar.cc/300?img=5',
      }
    }

    //?choisis un mot aleatoire
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