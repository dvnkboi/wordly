<template>
  <div
    class="w-full h-screen flex justify-center items-center p-10 transform transition duration-500 bg-gradient-to-br from-sky-400 to-blue-600"
  >
    <div
      class="flex justify-center items-center px-28 py-14 flex-col gap-10 bg-slate-50 shadow-2xl rounded-3xl"
    >
      <div class="flex justify-center items-center gap-8 flex-col w-full">
        <div>
          <h1 class="text-7xl font-bold">Join a Room</h1>
        </div>
        <div class="flex justify-center items-start flex-col w-full gap-4">
          <label class="pl-4 text-xl" for="roomId">Room name</label>
          <input
            class="outline-none border-none rounded-2xl text-2xl shadow-xl w-full bg-slate-100"
            id="roomId"
            name="roomId"
            type="text"
            v-model="roomId"
          />
          <label class="pl-4 text-xl" for="playerName">Player Name</label>
          <input
            class="outline-none border-none rounded-2xl text-2xl shadow-xl w-full bg-slate-100"
            id="playerName"
            name="playerName"
            type="text"
            v-model="playerName"
          />
        </div>
        <h1
          @click="joinRoom"
          class="bg-slate-100 rounded-2xl w-6/12 py-2 shadow-xl cursor-pointer flex justify-center items-center"
        >
          <span class="text-2xl font-bold italic">Join</span>
        </h1>
      </div>
      <div>&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213; or &#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;</div>
      <div class="flex justify-center items-center gap-8 flex-col w-full">
        <div>
          <h1 class="text-7xl font-bold">Create a room</h1>
        </div>
        <div class="flex justify-center items-start flex-col w-full">
          <label class="pl-4 text-xl" for="PlayerName">Player Name</label>
          <input
            class="outline-none border-none rounded-2xl text-2xl shadow-xl w-full bg-slate-100"
            id="PlayerName"
            name="PlayerName"
            type="text"
            v-model="playerName"
          />
        </div>
        <h1
          @click="createRoom"
          class="bg-slate-100 rounded-2xl w-6/12 py-2 shadow-xl cursor-pointer flex justify-center items-center"
        >
          <span class="text-2xl font-bold italic">Create</span>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';

export default {
  data() {
    return {
      playerName: '',
      roomId: ''
    }
  },
  methods: {
    joinRoom() {
      this.$router.push({
        name: 'multiplayer',
        params: {
          playerName: this.playerName,
          roomId: this.roomId
        }
      })
    },
    createRoom() {
      this.$router.push({
        name: 'multiplayer',
        params: {
          playerName: this.playerName,
          roomId: uuid()
        }
      })
    }
  }

}
</script>

<style>
</style>