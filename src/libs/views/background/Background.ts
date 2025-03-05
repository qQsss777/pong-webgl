import { multiplyMatrix3D } from "../../math/matrix";
import Actor from "../common/Actor";

interface IBackgroundConstructor {
  backgroundColor: [number, number, number, number];
  lineColor: [number, number, number, number];
}

class Background extends Actor implements IBackgroundConstructor {
  backgroundColor: [number, number, number, number];
  lineColor: [number, number, number, number];
  private positionsBack = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  private positionsLine = new Float32Array([
    -0.009, -1.0, 0.0, -0.009, 1.0, 0.0, 0.009, 1.0, 0.0, 0.009, -1.0, 0.0,
  ]);
  private positionsTop = new Float32Array([
    -1.0, 0.991, 0.0, 1.0, 0.991, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  private positionsBottom = new Float32Array([
    -1.0, -0.991, 0.0, 1.0, -0.991, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0,
  ]);
  private positionsLeft = new Float32Array([
    -1.0, -1.0, 0.0, -0.991, -1.0, 0.0, -0.991, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  private positionsRight = new Float32Array([
    0.991, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.991, 1.0, 0.0,
  ]);

  constructor(props: IBackgroundConstructor) {
    super();
    this.backgroundColor = props.backgroundColor;
    this.lineColor = props.lineColor;
    this.matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(uMatrix, false, new Float32Array(this.matrix));
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    // background
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsBack,
      colorUniformBack,
      this.backgroundColor,
    );
    // line
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsLine,
      colorUniformBack,
      this.lineColor,
    );
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsTop,
      colorUniformBack,
      this.lineColor,
    );
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsBottom,
      colorUniformBack,
      this.lineColor,
    );
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsLeft,
      colorUniformBack,
      this.lineColor,
    );
    this.drawTriangles(
      gl,
      positionAttribute,
      this.positionsRight,
      colorUniformBack,
      this.lineColor,
    );
    this.drawCircle(gl, positionAttribute, colorUniformBack, this.lineColor);
  };

  /**
   * draw triangles data
   * @param gl webgl rendering context
   * @param positionAttr position attribute from shader program
   * @param data vertices data
   * @param colorAttr color uniform from shader program
   * @param color color
   */
  private drawTriangles = (
    gl: WebGLRenderingContext,
    positionAttr: GLint,
    data: Float32Array,
    colorAttr: WebGLUniformLocation,
    color: [number, number, number, number],
  ) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorAttr, color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / 3);
  };

  /**
   * draw circle data
   * @param gl webgl rendering context
   * @param positionAttr position attribute from shader program
   * @param colorAttr color uniform from shader program
   * @param color color
   */
  private drawCircle = (
    gl: WebGLRenderingContext,
    positionAttr: GLint,
    colorAttr: WebGLUniformLocation,
    color: [number, number, number, number],
  ) => {
    const radiusInnerList = this.getRadius(gl, 0.49);
    const radiusOuterList = this.getRadius(gl, 0.51);
    const segments = 360;
    const vertices = [];
    const center = [0.0, 0.0];
    for (let i = 0; i <= segments; i++) {
      const angle = (2 * Math.PI * i) / segments;
      const xInner = center[0] + radiusInnerList[0] * Math.cos(angle);
      const yInner = center[1] + radiusInnerList[1] * Math.sin(angle);
      vertices.push(xInner, yInner, 0.0);
      const xOuter = center[0] + radiusOuterList[0] * Math.cos(angle);
      const yOuter = center[1] + radiusOuterList[1] * Math.sin(angle);
      vertices.push(xOuter, yOuter, 0.0);
    }
    const positionsCircle = new Float32Array(vertices);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsCircle, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(colorAttr, color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, positionsCircle.length / 3);
  };
}

export default Background;
