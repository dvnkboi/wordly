import { createRouter, createWebHistory } from "vue-router";
import SinglePlayer from "../views/SinglePlayerPage.vue";
import MultiPlayer from "../views/MultiPlayerPage.vue";
import Home from "../views/HomePage.vue";

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
