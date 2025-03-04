import DynamicActor from "../common/DynamicActor";

interface IPlayerConstructor {
  color: [number, number, number, number];
}

class Player extends DynamicActor implements IPlayerConstructor {
  constructor(props: IPlayerConstructor) {
    super(props);
    console.log("ok");
  }

  /* eslint-disable */
  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {};
}

export default Player;
