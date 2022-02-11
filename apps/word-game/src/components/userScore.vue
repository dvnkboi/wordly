<template>
  <div class="flex justify-start items-start flex-col gap-5 py-1 overflow-auto h-full w-full">
    <h1 class="font-bold italic text-4xl px-4">Scoreboard</h1>
    <div v-if="users != {}" class="px-2 pb-1 w-full flex justify-start items-start flex-col gap-2">
      <transition-group name="fade-left" appear>
        <scoreCard
          class="transition duration-300 transform"
          :key="user[0]"
          v-for="user in users"
          :user="user[1]"
          :first="this.users[0][0] == user[0]"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import scoreCard from "./scoreCard.vue"

export default {
  components: {
    scoreCard
  },
  props: ['users'],
  mounted() {
  }
}
</script>

<style>
</style>