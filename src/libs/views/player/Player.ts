import Actor from "../common/Actor";

interface IPlayerConstructor {
  color: string;
}

class Player extends Actor implements IPlayerConstructor {
  color: string;

  constructor(props: IPlayerConstructor) {
    super();
    this.color = props.color;
  }

  /* eslint-disable */
  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {};
}

export default Player;
