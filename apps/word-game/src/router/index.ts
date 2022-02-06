import { createRouter, createWebHistory } from "vue-router";
import SinglePlayer from "../views/SinglePlayerPage.vue";
import MultiPlayer from "../views/MultiPlayerPage.vue";
import RoomCreation from '../views/RoomCreation.vue';
import Home from "../views/HomePage.vue";

const routes = [
  {
    path: "/singleplayer",
    name: "singlePlayer",
    component: SinglePlayer,
  },
  {
    path: "/multiplayer/:roomId/:playerName",
    name: "multiplayer",
    component: MultiPlayer,

  },
  {
    path: "/roomCreation",
    name: "roomCreation",
    component: RoomCreation,
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
