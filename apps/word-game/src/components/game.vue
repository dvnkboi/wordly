<template>
  <div class="w-full h-full rounded-2xl px-4 py-2 gap-10 flex justify-start items-center flex-col">
    <div class="w-full flex justify-start items-start flex-col">
      <h1 class="text-5xl font-bold italic">Round {{ round }}</h1>
      <h2 class="text-2xl font-normal">{{ lettersLeft }} letters</h2>
    </div>
    <div class="px-10 py-4 shadow-2xl rounded-2xl flex justify-center items-center">
      <h1
        :class="{ 'px-6': letter.ltr == ' ', 'px-1': letter.ltr != ' ' }"
        class="text-5xl font-bold italic"
        :key="idx"
        v-for="(letter,idx) in word"
      >{{ letter.isGuessed ? letter.ltr : '&#8213;' }}</h1>
    </div>
    <AlreadyGuessed :alreadyGuessed="alreadyGuessed" />
    <svg
      v-if="lives != null"
      height="400"
      width="400"
      stroke="black"
      stroke-width="4"
      fill="white"
    >
      <g id="body">
        <g v-if="lives < 4" id="head">
          <circle cx="200" cy="80" r="20" />
          <g id="rEyes">
            <circle cx="193" cy="80" r="4" />
            <circle cx="207" cy="80" r="4" />
          </g>
          <g id="xEyes" class="hide">
            <line x1="190" y1="78" x2="196" y2="84" />
            <line x1="204" y1="78" x2="210" y2="84" />
            <line x1="190" y1="84" x2="196" y2="78" />
            <line x1="204" y1="84" x2="210" y2="78" />
          </g>
        </g>
        <line v-if="lives < 3" x1="200" y1="100" x2="200" y2="150" />
        <line v-if="lives < 2" id="armL" x1="200" y1="120" x2="170" y2="140" />
        <line v-if="lives < 2" id="armR" x1="200" y1="120" x2="230" y2="140" />
        <line v-if="lives < 1" id="legL" x1="200" y1="150" x2="180" y2="190" />
        <line v-if="lives < 1" id="legR" x1="200" y1="150" x2="220" y2="190" />
      </g>
      <line v-if="lives < 5" x1="10" y1="250" x2="150" y2="250" />
      <line v-if="lives < 5" id="door1" x1="150" y1="250" x2="200" y2="250" />
      <line v-if="lives < 5" id="door2" x1="200" y1="250" x2="250" y2="250" />
      <line v-if="lives < 5" x1="250" y1="250" x2="390" y2="250" />
      <line v-if="lives < 5" x1="100" y1="250" x2="100" y2="20" />
      <line v-if="lives < 5" x1="100" y1="20" x2="200" y2="20" />
      <line v-if="lives < 5" id="rope" x1="200" y1="20" x2="200" y2="60" />
    </svg>
  </div>
</template>

<script>
import { alpha } from 'shared';
import AlreadyGuessed from './alreadyGuessed.vue';

export default {
  data() {
    return {
      alreadyGuessed: [],
    };
  },
  methods: {
    handleKeypress(e) {
      if (this.guessLock) return;
      if (alpha.includes(e.key.toUpperCase()) && !this.alreadyGuessed.includes(e.key)) {
        if (this.word.find(letter => letter.ltr.toLowerCase() === e.key.toLowerCase())) {
          this.$emit("guessedWord", e.key.toLowerCase(), true);
        }
        else {
          this.$emit("guessedWord", e.key.toLowerCase(), false);
        }
        this.handleDuplicates(e);
      }
    },
    handleDuplicates(e) {
      this.alreadyGuessed.push(e.key.toLowerCase());
      //socket stuff
    }
  },
  mounted() {
    window.addEventListener("keyup", this.handleKeypress);
  },
  props: [
    "word",
    "lettersLeft",
    "round",
    "gameTimeStamp",
    "alreadyGuessedPush",
    "lives",
    "guessLock"
  ],
  watch: {
    gameTimeStamp: function (prevTs, newTs) {
      if (prevTs !== newTs) {
        this.alreadyGuessed = [];
      }
    },
    alreadyGuessedPush: {
      handler: function (val) {
        this.alreadyGuessed = val;
      },
      deep: true
    }
  },
  components: { AlreadyGuessed }
}
</script>


<style>
</style>