import CanvasResizeObserver from "./libs/html/CanvasResizeObserver";
import PlayerController from "./libs/html/PlayerController";
import Background from "./libs/views/background/Background";
import Ball from "./libs/views/ball/Ball";
import Game from "./libs/views/game/Game";
import Player from "./libs/views/player/Player";
import "./style.css";

const appDiv = document.getElementById("app") as HTMLDivElement;

const ball = new Ball({
  color: [0.0, 1.0, 0.0, 1.0],
  speed: 0.01,
});

const player = new Player({
  color: [0.0, 0.0, 1.0, 1.0],
  playerController: new PlayerController(),
  side: "right",
  speed: 0.3,
});
const computer = new Player({
  color: [1.0, 0.0, 0.0, 1.0],
  side: "left",
  speed: 0.01,
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
  canvasResizeObserver: new CanvasResizeObserver(),
});

window.addEventListener("beforeunload", () => {
  game.destroy();
});

game.start();
