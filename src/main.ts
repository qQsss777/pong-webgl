import EventEmitter from "./libs/event/EventEmitter";
import Background from "./libs/views/background/Background";
import Ball from "./libs/views/ball/Ball";
import Game from "./libs/views/game/Game";
import Player from "./libs/views/player/Player";
import "./style.css";
const appDiv = document.getElementById("app") as HTMLDivElement;
const collisionEmitter = new EventEmitter();
const ball = new Ball({
  color: [0.0, 1.0, 0.0, 1.0],
  speed: 0.007,
  collisionEmitter,
});

const player = new Player({
  color: [0.0, 0.0, 1.0, 1.0],
});
const computer = new Player({
  color: [1.0, 0.0, 0.0, 0.0],
});

const background = new Background({
  lineColor: [1.0, 1.0, 1.0, 1.0],
  backgroundColor: [0.0, 0.0, 0.0, 1.0],
});
const game = new Game({
  rootNode: appDiv,
  background,
  ball,
  players: [player, computer],
});

const stopCollisionSubscribe = collisionEmitter.subscribe(
  "collision",
  (data) => {
    console.log(data);
  },
);
window.addEventListener("beforeunload", () => {
  stopCollisionSubscribe();
  game.destroy();
});

game.start();
