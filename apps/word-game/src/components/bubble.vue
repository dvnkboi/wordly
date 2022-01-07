<template>
  <div
    class="flex justify-start items-center flex-col w-full bg-gray-100 rounded-2xl shadow-lg relative"
  >
    <div
      v-if="user.lives != null"
      class="absolute top-0 right-0 px-4 py-2 text-xs"
    >lives left {{ user.lives }}</div>

    <!-- ? this is top portion: user info -->
    <div
      class="flex justify-start items-center w-full gap-2 bg-gray-100 shadow-lg shadow-gray-200 rounded-2xl px-5 py-2"
    >
      <div class="flex justify-center items-center h-12 w-12">
        <div
          class="p-1 bg-gradient-to-tr from-fuchsia-400 to-orange-400 w-14 h-14 rounded-full shrink-0"
        >
          <img
            :src="user.img"
            alt="cat"
            srcset
            class="w-full h-full object-cover rounded-full outline outline-gray-100 outline-2"
          />
        </div>
      </div>
      <div class="flex justify-start items-start flex-col">
        <div class="flex justify-start items-start text-lg capitalize font-semibold">{{ user.name }}</div>
        <div class="flex justify-start items-start text-base font-normal -mt-2">{{ user.score }}</div>
      </div>
    </div>
    <!-- ? this is bottom portion: msg text -->
    <div
      class="flex justify-start items-center w-full text-lg font-medium px-5 py-2 shrink-0"
    >{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    user: {
      type: Object,
      default: {
        name: 'Cat',
        score: 0,
        lives: 3,
        img: 'https://thecatapi.com/api/images/get?format=src&type=jpg',
      },
    },
    message: {
      type: String,
      default: '',
    },
  },
  mounded() {
  }
}
</script>

<style>
</style>
