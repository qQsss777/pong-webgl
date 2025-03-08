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
  position: number[];
  constructor(props: IDynamicActorConstructor) {
    super();
    this.color = props.color;
    this.position = [];
  }

  abstract increaseLevel: () => void;
  /**
   * Redraw Actor a the same coordinates.
   */
  abstract redraw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
  /**
   * Get new translation
   * @returns update Position
   */
  abstract _updateMatrices: () => void;
}

export default DynamicActor;
