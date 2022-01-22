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
  </div>
</template>

<script>
import { alpha } from 'shared';

export default {
  data() {
    return {
      alreadyGuessed: [],
    }
  },
  methods: {
    handleKeypress(e) {
      if (alpha.includes(e.key.toUpperCase()) && !this.alreadyGuessed.includes(e.key)) {
        if (this.word.find(letter => letter.ltr.toLowerCase() === e.key.toLowerCase())) {
          this.$emit('guessedWord', e.key.toLowerCase(), true);
        }
        else {
          this.$emit('guessedWord', e.key.toLowerCase(), false);
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
    window.addEventListener('keyup', this.handleKeypress);
  },
  props: [
    'word',
    'lettersLeft',
    'round',
    'gameTimeStamp',
    'alreadyGuessedPush'
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
  }
}
</script>


<style>
</style>