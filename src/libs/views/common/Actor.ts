interface IActorProperties {
  draw: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}
abstract class Actor implements IActorProperties {
  abstract draw(gl: WebGLRenderingContext, program: WebGLProgram): void;
}

export default Actor;
