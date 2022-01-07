import { createRouter, createWebHistory } from "vue-router";
import SinglePlayer from "../views/SinglePlayer.vue";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/singleplayer",
    name: "singlePlayer",
    component: SinglePlayer,
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
