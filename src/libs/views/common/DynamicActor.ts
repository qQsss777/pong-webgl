import Actor from "./Actor";

interface ICoordinatesRanges {
  x: [number, number];
  y: [number, number];
}

interface IDynamicActorConstructor {
  color: [number, number, number, number];
}

interface IDynamicActorProperties extends IDynamicActorConstructor {
  increaseLevel: () => void;
  redraw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
  getPlayerInformations: () => ICoordinatesRanges;
}

abstract class DynamicActor extends Actor implements IDynamicActorProperties {
  color: [number, number, number, number];
  position: number[];
  positionBuffer: WebGLBuffer;
  yCoordinatesRanges: [number, number];
  xCoordinatesRanges: [number, number];

  constructor(props: IDynamicActorConstructor) {
    super();
    this.color = props.color;
    this.position = [];
    this.yCoordinatesRanges = [-1, 1];
    this.xCoordinatesRanges = [-1, 1];
  }

  getPlayerInformations = (): ICoordinatesRanges => {
    return { x: this.xCoordinatesRanges, y: this.yCoordinatesRanges };
  };

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
