<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" class="transition duration-1000 transform overflow-hidden" />
    </transition>
  </router-view>
</template>

<script>
export default {

}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap");
@import url("https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply bg-gradient-to-br from-sky-400 to-blue-600;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-25px);
}

.fade-x-enter-from {
  opacity: 0;
  transform: translateX(25px);
}

.fade-x-leave-to {
  opacity: 0;
  transform: translateX(-25px);
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(25px);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-25px);
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(25px);
}
</style>  


<style type="text/css">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-button {
  width: 24px;
  height: 24px;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-200;
  border: 0px none #ffffff;
  border-radius: 100px;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-300;
}
::-webkit-scrollbar-thumb:active {
  @apply bg-slate-300;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
  border: 0px none #ffffff;
  border-radius: 100px;
}
::-webkit-scrollbar-track:hover {
  @apply bg-transparent;
}
::-webkit-scrollbar-track:active {
  @apply bg-slate-400 bg-opacity-20;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>