import { createRouter, createWebHistory } from "vue-router";
import SinglePlayer from "../views/singlePlayer.vue";
import MultiPlayer from "../views/multiPlayer.vue";
import Home from "../views/home.vue";

const routes = [
  {
    path: "/singleplayer",
    name: "singlePlayer",
    component: SinglePlayer,
  },
  {
    path: "/multiplayer",
    name: "multiplayer",
    component: MultiPlayer,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
