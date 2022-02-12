<template>
  <transition name="fade-x" appear>
    <div
      class="w-full h-screen flex justify-center items-center flex-col p-10 transition duration-500 transform gap-10"
    >
      <div>
        <h1 class="text-9xl text-black font-bold mix-blend-exclusion">Wordly</h1>
      </div>
      <div
        class="flex justify-center items-center px-12 py-4 flex-col bg-slate-50 shadow-2xl rounded-3xl"
      >
        <div class="flex justify-center items-center flex-row gap-28">
          <router-link to="/singlePlayer">
            <h1
              class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl transform transition duration-300 hover:-translate-y-1"
            >
              <span class="text-2xl font-bold italic">SinglePlayer</span>
            </h1>
          </router-link>
          <router-link to="/roomCreation">
            <h1
              class="bg-slate-100 rounded-2xl px-3 py-2 shadow-xl transform transition duration-300 hover:-translate-y-1"
            >
              <span class="text-2xl font-bold italic">MultiPlayer</span>
            </h1>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {

}
</script>

<style>
</style>