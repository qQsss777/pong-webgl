import type Ball from "../ball/Ball";
import type Player from "../player/Player";
import type Background from "../background/Background";
import type CanvasResizeObserver from "../../html/CanvasResizeObserver";
import { initShaderProgram } from "../../webgl/program";
import { intersect } from "../../math/intersection";
import EventEmitter from "../../event/EventEmitter";

interface IGameConstructor {
  rootNode: HTMLDivElement;
  background: Background;
  ball: Ball;
  players: [Player, Player];
  canvasResizeObserver: CanvasResizeObserver;
  timeAfterCollision: number;
}
interface IGameProperties extends IGameConstructor {
  start: () => void;
  destroy: () => void;
  pause: () => void;
  reset: () => void;
  context: WebGLRenderingContext;
  program: WebGLProgram;
  status: "stopped" | "started" | "paused";
}

class Game extends EventEmitter implements IGameProperties {
  rootNode: HTMLDivElement;
  viewNode = document.createElement("canvas");
  ball: Ball;
  players: [Player, Player];
  background: Background;
  canvasResizeObserver: CanvasResizeObserver;
  context: WebGLRenderingContext;
  program: WebGLProgram;
  status: "stopped" | "started" | "paused" = "stopped";
  timeAfterCollision: number;

  constructor(props: IGameConstructor) {
    super();
    this.rootNode = props.rootNode;
    this.viewNode.style.display = "block";
    this.rootNode.appendChild(this.viewNode);
    const ctx = this.viewNode.getContext("webgl");
    if (!ctx) {
      throw new Error("WebGL2 not implemented");
    }
    const program = initShaderProgram(ctx);
    if (!program) {
      throw new Error("Issue wth shader program");
    }
    this.timeAfterCollision = props.timeAfterCollision;
    this.program = program;
    this.context = ctx;
    this.canvasResizeObserver = props.canvasResizeObserver;
    this.ball = props.ball;
    this.players = props.players;
    this.background = props.background;
    this._initializeListener();
  }

  /**
   * Display start screen
   */
  start = () => {
    this.status = "started";
    this.dispatch("status", this.status);
    this.draw();
  };

  /**
   * Remove game node and resize observer
   */
  destroy = () => {
    this.canvasResizeObserver.reset();
    this.rootNode.removeChild(this.viewNode);
  };

  /**
   * set game in pause mode
   */
  pause = () => {
    this.status = "paused";
    this.dispatch("status", this.status);
  };

  /**
   * Draw canvas
   */
  draw = () => {
    this._clearCanvas();
    this.background.draw(this.context, this.program);
    this.players.forEach((pl) => pl.draw(this.context, this.program));
    this.ball.draw(this.context, this.program);
    if (this.status === "started")
      window.requestAnimationFrame(this.draw.bind(this));
  };

  /**
   * Re draw element at current position
   */
  redraw = () => {
    this._clearCanvas();
    this.background.draw(this.context, this.program);
    this.players.forEach((pl) => pl.redraw(this.context, this.program));
    this.ball.redraw(this.context, this.program);
  };

  reset = () => {
    this.ball.reset();
    this.players.forEach((pl) => pl.reset());
  };

  /**
   * Initialize listener : resize and collition detector
   */
  _initializeListener = () => {
    this.canvasResizeObserver.initialize(
      this.rootNode,
      this.viewNode,
      this.redraw,
    );

    // rules part
    this.ball.subscribe("collisionX", () => {
      let canContinue = false;
      const ballData = this.ball.getPlayerInformations();
      const side = Math.round(ballData.x[0]) === 1 ? "right" : "left";
      const player = this.players.find((pl) => pl.side === side);
      if (!player) return;
      const playerData = player.getPlayerInformations().y;
      canContinue = intersect(ballData.y, playerData);
      if (!canContinue) {
        this.pause();
        setTimeout(() => {
          this.reset();
          this.start();
          this.ball.increaseLevel();
          if (player.side === "right") player.increaseLevel();
        }, this.timeAfterCollision);
      }
    });
  };

  /**
   * Clear canvas with black color
   */
  _clearCanvas = () => {
    this.context.viewport(0, 0, this.viewNode.width, this.viewNode.height);
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT,
    );
  };
}

export default Game;
