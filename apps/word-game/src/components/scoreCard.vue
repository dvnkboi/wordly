<template>
  <div
    class="flex justify-start items-center w-full gap-2 bg-gray-100 shadow-lg shadow-gray-200 rounded-2xl px-2 py-2"
  >
    <div class="flex justify-center items-center h-10 w-10 relative">
      <transition name="fade-left" appear>
        <div class="transition duration-300 transform">
          <i
            v-if="first"
            class="ri-vip-crown-2-fill text-yellow-400 -translate-y-7 -rotate-45 transform absolute"
          ></i>
        </div>
      </transition>

      <div
        class="p-1 bg-gradient-to-tr from-fuchsia-400 to-orange-400 w-12 h-12 rounded-full shrink-0"
      >
        <transition name="fade" appear>
          <div
            v-if="user.lives <= 0"
            class="absolute w-full h-full bg-slate-100 bg-opacity-60 flex justify-center items-center rounded-full transition duration-300"
          >
            <i class="ri-skull-2-fill"></i>
          </div>
        </transition>

        <img
          :src="user.img"
          alt="cat"
          srcset
          class="w-full h-full object-cover rounded-full outline outline-gray-100 outline-2"
        />
      </div>
    </div>
    <div class="flex justify-start items-start flex-col">
      <div class="text-base capitalize font-semibold flex justify-start items-center">
        {{ user.name }}
        <span class="text-base px-1">|</span>
        <span class="text-xs font-normal">{{ user.lives }} lives left</span>
      </div>
      <div class="flex justify-start items-start text-xs font-normal -mt-1">{{ user.score }} score</div>
    </div>
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
        img: `https://thecatapi.com/api/images/get?format=src&type=jpg&cache=${Date.now()}`,
      },
    },
    message: {
      type: String,
      default: '',
    },
    first: {
      type: Boolean,
      default: false,
    },
  },
  mounded() {
  }
}
</script>

<style>
</style>