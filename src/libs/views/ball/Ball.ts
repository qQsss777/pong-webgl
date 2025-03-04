import DynamicActor from "../common/DynamicActor";

interface IBallConstructor {
  speed: number;
  color: [number, number, number, number];
}

class Ball extends DynamicActor implements IBallConstructor {
  speed: number;

  constructor(props: IBallConstructor) {
    super(props);
    this.speed = props.speed;
  }
  /* eslint-disable */
  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {};
}

export default Ball;
