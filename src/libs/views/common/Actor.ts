interface IActorProperties {
  draw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}
abstract class Actor implements IActorProperties {
  /**
   * Draw actor
   * @param gl webgl rendering context
   * @param program shader program
   */
  abstract draw(gl: WebGLRenderingContext, program: WebGLProgram): void;
}

export default Actor;
