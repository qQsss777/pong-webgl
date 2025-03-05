import { generateRandomNumber } from "../../math/angle";
import { TCoordinates } from "../common/Actor";
import DynamicActor from "../common/DynamicActor";

interface IBallConstructor {
  speed: number;
  color: [number, number, number, number];
}

/**
 * Ball Actor
 */
class Ball extends DynamicActor implements IBallConstructor {
  speed: number;
  private position: TCoordinates = [0.0, 0.0, 0.0];
  private angle = generateRandomNumber(45, 135);
  constructor(props: IBallConstructor) {
    super(props);
    this.speed = props.speed;
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    this.updatePosition(this.position, this.angle, this.speed);
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
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsCircle, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribute);
    gl.uniform4fv(colorUniformBack, this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionsCircle.length / 3);
    if (this.position[0] === 1 || this.position[0] === -1) {
      this.angle = 180 - this.angle;
    } else if (this.position[1] === 1) {
      this.angle = 90 - this.angle - this.angle;
    } else if (this.position[1] === -1) {
      this.angle = Math.abs(90 + this.angle + this.angle);
    }
  };

  /**
   * Get new translation
   * @param origin array of ball center to udpate
   * @param angle angle for move
   * @param distance distance to use for translation
   * @returns update Position
   */
  updatePosition = (
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

  getNewAngle = (angle: number): number => {
    if (angle >= 0 || angle <= 90) {
      return angle + 90;
    } else if (angle > 90 || angle <= 180) {
      return angle + 90;
    }
  };
}

export default Ball;
