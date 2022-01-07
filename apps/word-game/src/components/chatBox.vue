<template>
  <div class="p-5 w-full bg-transparent">
    <div
      @keyup.prevent.stop
      class="w-full h-12 flex justify-start items-center bg-transparent relative p-0.5"
    >
      <input
        class="w-full h-full text-xl bg-gray-100 rounded-2xl relative z-50 focus:border-none border-none focus:ring-2 hover:ring-2 hover:ring-opacity-75 ring-opacity-0 ring-0 ring-pink-400 focus:ring-pink-400 transition duration-300"
        v-model="input"
        type="text"
        @keyup.enter="handleInput"
      />
      <div
        @click="handleInput"
        class="relative w-16 h-full z-50 flex justify-center items-center cursor-pointer group"
      >
        <i
          class="ri-send-plane-fill text-2xl text-gray-50 -ml-1 transform transition duration-300 group-hover:rotate-45 group-hover:scale-125 group-hover:-translate-x-1"
        ></i>
      </div>
      <div class="rounded-[18px] bg-blue-400 shrink-0 absolute top-0 right-0 bottom-0 left-0 z-10"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: ''
    }
  },
  methods: {
    handleInput() {
      this.input = this.input.trim()
      if (this.input.length > 0) {
        this.$emit('msgSend', this.input);
        this.input = '';
      }
    }
  },
}
</script>

<style>
</style>