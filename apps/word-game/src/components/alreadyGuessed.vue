<template>
  <div class="w-full flex justify-start items-start flex-col">
    <h1 class="text-4xl font-semibold italic">Already Guessed</h1>
    <div class="flex justify-start items-center flex-row flex-wrap gap-4 px-10">
      <transition-group name="fade-down" appear>
        <div
          :key="'letter_' + letter"
          v-for="letter in alreadyGuessed"
          class="relative transform transition duration-300"
        >
          <div class="absolute w-full h-full transform translate-y-1/2">
            <div
              class="bg-red-500 h-1 w-full transform -translate-y-1/2 scale-x-110 rounded-full opacity-80"
            ></div>
          </div>
          <h1
            class="text-3xl font-bold italic px-5 py-2 rounded-2xl bg-slate-100 shadow-xl uppercase"
          >{{ letter }}</h1>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: ['alreadyGuessed']
}
</script>

<style>
</style>