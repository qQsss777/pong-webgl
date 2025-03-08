import { TCoordinates } from "../common/Actor";
import DynamicActor from "../common/DynamicActor";

interface IBallConstructor {
  speed: number;
  color: [number, number, number, number];
}

/**
 * Ball Actor
 */
export default class Ball extends DynamicActor implements IBallConstructor {
  speed: number;
  position: TCoordinates = [0.0, 0.0, 0.0];
  _positionBuffer: WebGLBuffer;
  _angle: number;

  constructor(props: IBallConstructor) {
    super(props);
    this.speed = props.speed;
    this._angle = this._generateRandomNumber(45, 135);
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this._positionBuffer) {
      this.initializeBuffers(gl);
    }
    this._updatePosition(this.position, this._angle, this.speed);
    this._drawBall(gl, program);
    this._checkCollision();
  };

  redraw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this._positionBuffer) {
      this.initializeBuffers(gl);
    }
    this._drawBall(gl, program);
  };

  reset = () => {
    this.position = [0.0, 0.0, 0.0];
    this._angle = this._generateRandomNumber(45, 135);
  };

  increaseLevel: () => void;

  _drawBall = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    const segments = 360;
    const vertices = [];
    const radius = this.getRadius(gl, 0.075);
    for (let i = 0; i <= segments; i++) {
      const angle = (2 * Math.PI * i) / segments;
      const x = this.position[0] + radius[0] * Math.cos(angle);
      const y = this.position[1] + radius[1] * Math.sin(angle);
      vertices.push(x, y, 0.0);
    }
    const positionsCircle = new Float32Array(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsCircle, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribute);
    gl.uniform4fv(colorUniformBack, this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionsCircle.length / 3);
  };

  initializeBuffers = (gl: WebGLRenderingContext) => {
    this._positionBuffer = gl.createBuffer();
  };

  _checkCollision = () => {
    if (this.position[0] === 1 || this.position[0] === -1) {
      this._angle = 180 - this._angle;
      this.dispatch("collision", this.position[0].toString());
    } else if (this.position[1] === 1) {
      this._angle = 90 - this._angle - this._angle;
    } else if (this.position[1] === -1) {
      this._angle = Math.abs(90 + this._angle + this._angle);
    }
  };

  /**
   * Calculate angle in cartesian plan
   * @param start mininum value for angle
   * @param end maximum value for angle
   * @returns angle in cartesian plan
   */
  _generateRandomNumber = (start: number, end: number): number => {
    return Math.floor(Math.random() * (start - end + 1) + end) - 90;
  };

  /**
   * Get new translation
   * @param origin array of ball center to udpate
   * @param angle angle for move
   * @param distance distance to use for translation
   * @returns update Position
   */
  _updatePosition = (
    origin: [number, number, number],
    angle: number,
    distance: number,
  ): void => {
    const rad = angle * (Math.PI / 180);
    const deltaX = Math.max(
      Math.min(origin[0] + distance * Math.cos(rad), 1),
      -1,
    );
    const deltaY = Math.max(
      Math.min(origin[1] + distance * Math.sin(rad), 1),
      -1,
    );
    origin[0] = deltaX;
    origin[1] = deltaY;
  };
}
