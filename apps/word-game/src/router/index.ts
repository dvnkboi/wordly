import { createRouter, createWebHistory } from "vue-router";
import SinglePlayer from "../views/SinglePlayer.vue";
import MultiPlayer from "../views/MultiPlayer.vue";
import Home from "../views/Home.vue";

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
