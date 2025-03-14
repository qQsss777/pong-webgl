import PlayerController from "../../html/PlayerController";
import {
  multiplyMatrix3D,
  scaleMatrix,
  translateMatrix,
} from "../../math/matrix";
import DynamicActor from "../common/DynamicActor";

type TSide = "left" | "right";
interface IPlayerConstructor {
  color: [number, number, number, number];
  side: TSide;
  playerController?: PlayerController;
  speed: number;
}

class Player extends DynamicActor implements IPlayerConstructor {
  playerController: PlayerController;
  position = [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0];
  side: TSide = "right";
  speed: number;
  _width = 0.02;
  _height = 0.5;

  constructor(props: IPlayerConstructor) {
    super(props);
    this.speed = props.speed;
    this.side = props.side;
    this._initializePosition();
    this.playerController = props.playerController ?? undefined;
    if (this.playerController) {
      this._initializeListeners();
    }
  }

  reset(): void {
    this.translateX = 0;
    this.translateY = 0;
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this.positionBuffer) {
      this.initializeBuffers(gl);
    }
    if (!this.playerController) {
      this._updateMatrices();
    }
    this._drawElement(gl, program);
  };

  redraw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this.positionBuffer) {
      this.initializeBuffers(gl);
    }
    this._drawElement(gl, program);
  };

  increaseLevel = () => {
    this.scaleY += 0.1;
  };

  initializeBuffers = (gl: WebGLRenderingContext) => {
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.position),
      gl.STATIC_DRAW,
    );
  };

  /**
   * Initialize positions
   */
  _initializePosition = () => {
    if (this.side === "left") {
      this.position = [
        -1.0,
        -1.0,
        0.0,
        -1 + this._width,
        -1.0,
        0.0,
        -1 + this._width,
        -1 + this._height,
        0.0,
        -1.0,
        -1 + this._height,
        0.0,
      ];
      this.xCoordinatesRanges = [-1, -1 + this._width];
      this.yCoordinatesRanges = [-1, -1 + this._height];
    } else {
      this.position = [
        1.0 - this._width,
        -1.0,
        0.0,
        1,
        -1.0,
        0.0,
        1 + this._width,
        -1 + this._height,
        0.0,
        1.0 - this._width,
        -1 + this._height,
        0.0,
      ];
      this.xCoordinatesRanges = [1 - this._width, 1];
      this.yCoordinatesRanges = [-1, -1 + this._height];
    }
  };

  _drawElement = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(uMatrix, false, new Float32Array(this.matrix));
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorUniformBack, this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.position.length / 3);
  };

  _updateMatrices = (): void => {
    this.translateY = this.directionY
      ? this.translateY + this.speed
      : this.translateY - this.speed;
    if (this.translateY >= 1 + this._height) {
      this.directionY = false;
      this.translateY = 1 + this._height;
    } else if (this.translateY <= 0) {
      this.directionY = true;
      this.translateY = 0;
    }
    const initalY = this.position[1];
    this.yCoordinatesRanges = [
      initalY + this.translateY,
      initalY + this.translateY + this._height,
    ];
    this.tMatrix = translateMatrix(this.translateX, this.translateY);
    this.sMatrix = scaleMatrix(this.scaleX, this.scaleY);
    this.matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);
  };

  /**
   * intialize listener for player
   */
  _initializeListeners = () => {
    this.playerController.initialize([
      {
        name: "keydown",
        callback: this._listenArrowsPressed,
      },
    ]);
  };

  /**
   * Listen keyboard and arrow up / down press
   * @param event envent keyboard
   */
  _listenArrowsPressed = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === "ArrowUp") {
      this.directionY = true;
      this._updateMatrices();
    } else if (key === "ArrowDown") {
      this.directionY = false;

      this._updateMatrices();
    }
  };
}

export default Player;
