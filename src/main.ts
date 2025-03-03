import Background from "./libs/views/background/Background";
import Ball from "./libs/views/ball/Ball";
import Game from "./libs/views/game/Game";
import Player from "./libs/views/player/Player";
import "./style.css";
const appDiv = document.getElementById("app") as HTMLDivElement;
const ball = new Ball({
  color: "orange",
  speed: 5,
});
const player = new Player({
  color: "blue",
});
const computer = new Player({
  color: "red",
});

const background = new Background({
  backgroundColor: "black",
  lineColor: "white",
});
const game = new Game({
  rootNode: appDiv,
  background,
  ball,
  players: [player, computer],
});
game.start();
