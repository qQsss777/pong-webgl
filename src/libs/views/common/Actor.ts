import {
  multiplyMatrix3D,
  scaleMatrix,
  translateMatrix,
} from "../../math/matrix";

export type TCoordinates = [number, number, number];

interface IActorProperties {
  draw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}
abstract class Actor implements IActorProperties {
  protected sMatrix = scaleMatrix(1, 1);
  protected tMatrix = translateMatrix(0, 0);
  protected matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);

  /**
   * Draw actor
   * @param gl webgl rendering context
   * @param program shader program
   */
  abstract draw(gl: WebGLRenderingContext, program: WebGLProgram): void;

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
