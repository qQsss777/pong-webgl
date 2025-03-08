import EventEmitter from "../../event/EventEmitter";
import {
  multiplyMatrix3D,
  scaleMatrix,
  TMatrix3D,
  translateMatrix,
} from "../../math/matrix";

export type TCoordinates = [number, number, number];

interface IActorProperties {
  directionX: boolean;
  directionY: boolean;
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  draw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
  reset: () => void;
  initializeBuffers: (gl: WebGLRenderingContext) => void;
}
abstract class Actor extends EventEmitter implements IActorProperties {
  directionX = true;
  directionY = true;
  translateX = 0;
  translateY = 0;
  scaleX = 1;
  scaleY = 1;
  protected sMatrix: TMatrix3D;
  protected tMatrix: TMatrix3D;
  protected matrix: TMatrix3D;

  constructor() {
    super();
    this.sMatrix = scaleMatrix(this.scaleX, this.scaleY);
    this.tMatrix = translateMatrix(this.translateX, this.translateY);
    this.matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);
  }

  /**
   * Draw actor
   * @param gl webgl rendering context
   * @param program shader program
   */
  abstract draw(gl: WebGLRenderingContext, program: WebGLProgram): void;

  /**
   * Reset actor
   */
  abstract reset(): void;

  /**
   * Create buffer and store them in memory
   * @param gl WebGLRenderingContext
   */
  abstract initializeBuffers: (gl: WebGLRenderingContext) => void;

  /**
   * Get radius for width and height to draw circle
   * @param gl webgl rendering context
   * @param radiusSource radius maximum
   * @returns [radius for width, radius for height]
   */
  protected getRadius = (
    gl: WebGLRenderingContext,
    radiusSource: number,
  ): [number, number] => {
    const heightSuperior = gl.canvas.height > gl.canvas.width;
    if (heightSuperior) {
      const radiusY = radiusSource * (gl.canvas.width / gl.canvas.height);
      return [radiusSource, radiusY];
    } else {
      const radiusX = radiusSource * (gl.canvas.height / gl.canvas.width);
      return [radiusX, radiusSource];
    }
  };
}

export default Actor;
