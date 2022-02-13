<template>
  <router-view />
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

body {
  --s: 20vmin;
  --p: calc(var(--s) / 2);
  --c1: rgb(154, 221, 252);
  --c2: dodgerblue;
  --c3: white;
  --bg: var(--c3);
  --d: 12000ms;
  --e: cubic-bezier(0.76, 0, 0.24, 1);

  background-color: var(--bg);
  background-image: linear-gradient(45deg, var(--c1) 25%, transparent 25%),
    linear-gradient(-45deg, var(--c1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--c2) 75%),
    linear-gradient(-45deg, transparent 75%, var(--c2) 75%);
  background-size: var(--s) var(--s);
  background-position: calc(var(--p) * 1) calc(var(--p) * 0),
    calc(var(--p) * -1) calc(var(--p) * 1),
    calc(var(--p) * 1) calc(var(--p) * -1),
    calc(var(--p) * -1) calc(var(--p) * 0);
  animation: color var(--d) var(--e) infinite,
    position var(--d) var(--e) infinite;

  overflow: hidden;
}

@keyframes color {
  0%,
  25% {
    --bg: var(--c3);
  }
  26%,
  50% {
    --bg: var(--c1);
  }
  51%,
  75% {
    --bg: var(--c3);
  }
  76%,
  100% {
    --bg: var(--c2);
  }
}

@keyframes position {
  0% {
    background-position: calc(var(--p) * 1) calc(var(--p) * 0),
      calc(var(--p) * -1) calc(var(--p) * 1),
      calc(var(--p) * 1) calc(var(--p) * -1),
      calc(var(--p) * -1) calc(var(--p) * 0);
  }
  25% {
    background-position: calc(var(--p) * 1) calc(var(--p) * 4),
      calc(var(--p) * -1) calc(var(--p) * 5),
      calc(var(--p) * 1) calc(var(--p) * 3),
      calc(var(--p) * -1) calc(var(--p) * 4);
  }
  50% {
    background-position: calc(var(--p) * 3) calc(var(--p) * 8),
      calc(var(--p) * -3) calc(var(--p) * 9),
      calc(var(--p) * 2) calc(var(--p) * 7),
      calc(var(--p) * -2) calc(var(--p) * 8);
  }
  75% {
    background-position: calc(var(--p) * 3) calc(var(--p) * 12),
      calc(var(--p) * -3) calc(var(--p) * 13),
      calc(var(--p) * 2) calc(var(--p) * 11),
      calc(var(--p) * -2) calc(var(--p) * 12);
  }
  100% {
    background-position: calc(var(--p) * 5) calc(var(--p) * 16),
      calc(var(--p) * -5) calc(var(--p) * 17),
      calc(var(--p) * 5) calc(var(--p) * 15),
      calc(var(--p) * -5) calc(var(--p) * 16);
  }
}

@media (prefers-reduced-motion) {
  body {
    animation: none;
  }
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

.list-fade-up-enter-from,
.list-fade-up-leave-to {
  opacity: 0;
}

.list-fade-up-leave-active {
  position: absolute;
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