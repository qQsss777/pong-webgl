import DynamicActor from "../common/DynamicActor";

interface IPlayerConstructor {
  color: [number, number, number, number];
}

class Player extends DynamicActor implements IPlayerConstructor {
  constructor(props: IPlayerConstructor) {
    super(props);
    console.log("ok");
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }

  /* eslint-disable */
  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {};
}

export default Player;
