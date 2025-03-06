import PlayerController from "../../html/PlayerController";
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
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(uMatrix, false, new Float32Array(this.matrix));
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.position),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorUniformBack, this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.position.length / 3);
  };

  increaseLevel: () => void;

  _initializePosition = () => {
    if (this.side === "right") {
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
    }
  };
}

export default Player;
