<template>
  <transition name="fade" appear>
    <!-- //!message qui s'affiche shown = true  -->
    <div
      v-if="shown"
      class="absolte w-screen h-screen bg-slate-400 bg-opacity-30 backdrop-blur-lg flex justify-center items-center gap-16 flex-col transition duration-1000"
    >
      <!-- //!message a afficher -->
      <h1 class="text-7xl font-bold italic">{{ message }}</h1>
      <div
        @click="replay"
        class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl cursor-pointer group transform hover:-translate-y-1 transition duration-300"
      >
        <!-- //!bouton qu'on peut cliquer pour rejouer -->
        <span
          class="text-2xl font-bold group-hover:-translate-y-2 transform transition duration-300"
        >Play again?</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    replay() {
      this.$emit('replay');
    }
  },
  props: {
    shown: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'You lost'
    },
    replayPrompt: {
      type: Boolean,
      default: true
    },
  }
}
</script>

<style>
</style>