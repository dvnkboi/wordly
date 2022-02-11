<template>
  <div
    class="w-full h-screen flex justify-center items-center p-10 bg-gradient-to-br from-sky-400 to-blue-600"
  >
    <div
      class="flex justify-center items-center px-28 py-12 flex-col gap-10 bg-slate-50 shadow-2xl rounded-3xl"
    >
      <div>
        <h1 class="text-7xl font-bold">Wordly</h1>
      </div>
      <div class="flex justify-center items-center flex-row gap-16">
        <router-link to="/singlePlayer">
          <h1 class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl">
            <span class="text-2xl font-bold italic">SinglePlayer</span>
          </h1>
        </router-link>
        <router-link to="/roomCreation">
          <h1 class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl">
            <span class="text-2xl font-bold italic">MultiPlayer</span>
          </h1>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>