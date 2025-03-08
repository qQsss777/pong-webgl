import Actor from "./Actor";

interface IDynamicActorConstructor {
  color: [number, number, number, number];
}

interface IDynamicActorProperties extends IDynamicActorConstructor {
  increaseLevel: () => void;
  redraw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}

abstract class DynamicActor extends Actor implements IDynamicActorProperties {
  color: [number, number, number, number];
  protected direction = true;
  constructor(props: IDynamicActorConstructor) {
    super();
    this.color = props.color;
  }

  abstract increaseLevel: () => void;
  abstract redraw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}

export default DynamicActor;
