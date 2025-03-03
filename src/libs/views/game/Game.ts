import type Ball from "../ball/Ball";
import type Player from "../player/Player";
import type Background from "../background/Background";
import { canvasResizeObserver } from "../../html/utils/listeners";
import { initShaderProgram } from "../../webgl/program";

interface IGameConstructor {
  rootNode: HTMLDivElement;
  background: Background;
  ball: Ball;
  players: Player[];
}
interface IGameProperties extends IGameConstructor {
  start: () => void;
  destroy: () => void;
}

class Game implements IGameProperties {
  rootNode: HTMLDivElement;
  viewNode = document.createElement("canvas");
  ball: Ball;
  players: Player[];
  background: Background;
  _rs: ResizeObserver;
  _context: WebGLRenderingContext;
  _program: WebGLProgram;

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
    this._rs = canvasResizeObserver(this.rootNode, this.viewNode, this.draw);
    this.ball = props.ball;
    this.players = props.players;
    this.background = props.background;
  }

  /**
   * Display start screen
   */
  start = () => {
    this.draw();
  };

  /**
   * Remove game node and resize observer
   */
  destroy = () => {
    this._rs.disconnect();
    this.rootNode.removeChild(this.viewNode);
  };

  /**
   * Draw canvas
   */
  draw = () => {
    this._context.clearColor(0.0, 0.0, 0.0, 1.0);
    this._context.clear(
      this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT,
    );
    this.background.draw(this._context, this._program);
    //this.players.forEach((pl) => pl.draw(this._context, this._program))
    //this.ball.draw(this._context, this._program)
    //window.requestAnimationFrame(this.draw.bind(this))
  };
}

export default Game;
