import type Ball from "../ball/Ball";
import type Player from "../player/Player";
import type Background from "../background/Background";
import type CanvasResizeObserver from "../../html/CanvasResizeObserver";
import { initShaderProgram } from "../../webgl/program";

interface IGameConstructor {
  rootNode: HTMLDivElement;
  background: Background;
  ball: Ball;
  players: Player[];
  canvasResizeObserver: CanvasResizeObserver;
}
interface IGameProperties extends IGameConstructor {
  start: () => void;
  destroy: () => void;
  pause: () => void;
}

class Game implements IGameProperties {
  rootNode: HTMLDivElement;
  viewNode = document.createElement("canvas");
  ball: Ball;
  players: Player[];
  background: Background;
  canvasResizeObserver: CanvasResizeObserver;
  _context: WebGLRenderingContext;
  _program: WebGLProgram;
  _status: "stopped" | "started" = "stopped";

  constructor(props: IGameConstructor) {
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
    this._program = program;
    this._context = ctx;
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
    this._status = "started";
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
    this._status = "stopped";
  };

  /**
   * Draw canvas
   */
  draw = () => {
    this._context.viewport(0, 0, this.viewNode.width, this.viewNode.height);
    this._context.clearColor(0.0, 0.0, 0.0, 1.0);
    this._context.clear(
      this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT,
    );
    this.background.draw(this._context, this._program);
    this.players.forEach((pl) => pl.draw(this._context, this._program));
    this.ball.draw(this._context, this._program);
    if (this._status === "started")
      window.requestAnimationFrame(this.draw.bind(this));
  };

  _initializeListener = () => {
    this.canvasResizeObserver.initialize(
      this.rootNode,
      this.viewNode,
      this.draw,
    );
    this.ball.subscribe("collision", () => {
      this.pause();
    });
  };
}

export default Game;
