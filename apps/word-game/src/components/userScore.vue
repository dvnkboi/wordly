<template>
  <div class="flex justify-start items-start flex-col gap-5 py-1 overflow-auto h-full w-full">
    <h1 class="font-bold italic text-4xl px-4">Scoreboard</h1>
    <div
      v-if="sortedUsers != {}"
      class="px-2 pb-1 w-full flex justify-start items-start flex-col gap-2"
    >
      <transition-group name="fade-left" appear>
        <scoreCard
          class="transition duration-300 transform"
          :key="user[0]"
          v-for="user in sortedUsers"
          :user="user[1]"
          :first="this.sortedUsers[0][0] == user[0]"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import scoreCard from "./scoreCard.vue"

export default {
  data() {
    return {
      sortedUsers: {},
      first: 0
    }
  },
  components: {
    scoreCard
  },
  props: ['users'],
  watch: {
    users: {
      handler: function (users) {
        this.sortedUsers = Object.entries(this.users).filter((e) => e[0] != "0").sort((a, b) => {
          return b[1].score - a[1].score;
        });
      },
      deep: true
    }
  },
  mounted() {
    this.sortedUsers = Object.entries(this.users).filter((e) => e[0] != "0").sort((a, b) => {
      return b[1].score - a[1].score;
    });
  }
}
</script>

<style>
</style>