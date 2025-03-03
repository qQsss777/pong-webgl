import Actor from "../common/Actor";

interface IBallConstructor {
  speed: number;
  color: string;
}

class Ball extends Actor implements IBallConstructor {
  color: string;
  speed: number;

  constructor(props: IBallConstructor) {
    super();
    this.color = props.color;
    this.speed = props.speed;
  }
  /* eslint-disable */
  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {};
}

export default Ball;
