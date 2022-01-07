<template>
  <div class="w-full h-screen flex justify-center items-center p-10">
    <div
      class="flex justify-center items-center p-28 flex-col gap-10 bg-slate-50 shadow-2xl rounded-2xl"
    >
      <div>
        <h1 class="text-7xl font-bold">Wordly</h1>
      </div>
      <div class="flex justify-center items-center flex-row gap-16">
        <router-link to="/singlePlayer">
          <h1 class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl">
            <span class="text-2xl font-bold italic">Single Player</span>
          </h1>
        </router-link>
        <router-link to="/multiPlayer">
          <h1 class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl">
            <span class="text-2xl font-bold italic">Single Player</span>
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