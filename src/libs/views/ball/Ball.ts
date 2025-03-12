import { multiplyMatrix3D, translateMatrix } from "../../math/matrix";
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
  radiusSource = 0.075;
  radiusY = 0.075;
  radiusX = 0.075;
  _angleLimitInf = 45;
  _angleLimitSup = 135;

  _center: TCoordinates = [0.0, 0.0, 0.0];
  _angle: number;

  constructor(props: IBallConstructor) {
    super(props);
    this.speed = props.speed;
    this._angle = this._generateRandomNumber(
      this._angleLimitInf,
      this._angleLimitSup,
    );
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this.positionBuffer) {
      this.initializeBuffers(gl);
    }
    this._updateMatrices();
    this._drawBall(gl, program);
  };

  redraw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    this.initializeBuffers(gl);
    this._drawBall(gl, program);
  };

  reset = () => {
    this.translateX = 0;
    this.translateY = 0;
    this._angle = this._generateRandomNumber(45, 135);
  };

  increaseLevel = () => {
    this.speed += 0.00005;
  };

  _drawBall = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribute);
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(uMatrix, false, new Float32Array(this.matrix));
    gl.uniform4fv(colorUniformBack, this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.position.length / 3);
  };

  initializeBuffers = (gl: WebGLRenderingContext) => {
    this.positionBuffer = gl.createBuffer();
    const segments = 360;
    const radius = this.getRadius(gl, this.radiusSource);
    this.radiusX = radius[0];
    this.radiusY = radius[1];
    this.position = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (2 * Math.PI * i) / segments;
      const x = this._center[0] + radius[0] * Math.cos(angle);
      const y = this._center[1] + radius[1] * Math.sin(angle);
      this.position.push(x, y, 0.0);
    }
    this.xCoordinatesRanges = [
      this._center[0] - this.radiusX,
      this._center[0] - this.radiusX,
    ];
    this.yCoordinatesRanges = [
      this._center[1] - this.radiusY,
      this._center[1] - this.radiusY,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.position),
      gl.STATIC_DRAW,
    );
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

  _updateMatrices = (): void => {
    const currentX = this.translateX;
    const currentY = this.translateY;
    const rad = this._angle * (Math.PI / 180);
    const dx = Math.max(
      Math.min(this._center[0] + this.speed * Math.cos(rad), 1),
      -1,
    );
    const dy = Math.max(
      Math.min(this._center[0] + this.speed * Math.sin(rad), 1),
      -1,
    );
    this.translateX = this.directionX
      ? this.translateX + dx
      : this.translateX - dx;
    this.translateY = this.directionY
      ? this.translateY + dy
      : this.translateY - dy;

    if (this.translateX >= 1 - this.radiusX) {
      this.directionX = false;
      this.translateX = currentX;
      this._processCollisionX();
    } else if (this.translateX <= -1) {
      this.directionX = true;
      this.translateX = currentX;
      this._processCollisionX();
    }
    if (this.translateY >= 1 - this.radiusY) {
      this.translateY = currentY;
      this._processCollisionY();
      this.directionY = false;
    } else if (this.translateY <= -1 + this.radiusY) {
      this.translateY = -1 + this.radiusY;
      this._processCollisionY();
      this.directionY = true;
    }
    this.xCoordinatesRanges = [
      this.translateX - this.radiusX,
      this.translateX + this.radiusX,
    ];
    this.yCoordinatesRanges = this.directionY
      ? [this.translateY - this.radiusY, this.translateY + this.radiusY]
      : [
          this._center[1] + this.translateY + this.radiusY,
          this._center[1] + this.radiusY,
        ];
    this.tMatrix = translateMatrix(this.translateX, this.translateY);
    this.matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);
  };

  /**
   * Execute action if x collision
   */
  _processCollisionX = () => {
    this._angle = 180 - this._angle;
    this.dispatch("collisionX", this.position[0].toString());
  };

  /**
   * Execute action if y collision
   */
  _processCollisionY = () => {
    this._angle = Math.min(
      Math.max(this._angle, this._angleLimitInf),
      this._angle,
      this._angleLimitSup,
    );
    this.dispatch("collisionY", this.position[1].toString());
  };
}
