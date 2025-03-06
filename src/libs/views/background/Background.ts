import { multiplyMatrix3D } from "../../math/matrix";
import Actor from "../common/Actor";

interface IBackgroundConstructor {
  backgroundColor: [number, number, number, number];
  lineColor: [number, number, number, number];
}

interface IStaticRectangle {
  color: [number, number, number, number];
  buffer: WebGLBuffer;
}

class Background extends Actor implements IBackgroundConstructor {
  backgroundColor: [number, number, number, number];
  lineColor: [number, number, number, number];
  _positionsBack = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  _positionsBackBuffer: WebGLBuffer;

  _positionsLine = new Float32Array([
    -0.009, -1.0, 0.0, -0.009, 1.0, 0.0, 0.009, 1.0, 0.0, 0.009, -1.0, 0.0,
  ]);
  _positionsLineBuffer: WebGLBuffer;
  _positionsTop = new Float32Array([
    -1.0, 0.991, 0.0, 1.0, 0.991, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  _positionsTopBuffer: WebGLBuffer;

  _positionsBottom = new Float32Array([
    -1.0, -0.991, 0.0, 1.0, -0.991, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0,
  ]);
  _positionsBottomBuffer: WebGLBuffer;

  _positionsLeft = new Float32Array([
    -1.0, -1.0, 0.0, -0.991, -1.0, 0.0, -0.991, 1.0, 0.0, -1.0, 1.0, 0.0,
  ]);
  _positionsLeftBuffer: WebGLBuffer;

  _positionsRight = new Float32Array([
    0.991, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.991, 1.0, 0.0,
  ]);
  _positionsRightBuffer: WebGLBuffer;
  _staticRectangles: IStaticRectangle[];

  constructor(props: IBackgroundConstructor) {
    super();
    this.backgroundColor = props.backgroundColor;
    this.lineColor = props.lineColor;
    this.matrix = multiplyMatrix3D(this.tMatrix, this.sMatrix);
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    if (!this._positionsBackBuffer) {
      this._initializeBuffers(gl);
      this._assignBufferInfos();
    }
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(uMatrix, false, new Float32Array(this.matrix));
    const colorUniformBack = gl.getUniformLocation(
      program,
      "u_color",
    ) as WebGLUniformLocation;
    // background
    this._drawRectangles(
      gl,
      positionAttribute,
      colorUniformBack,
      this._staticRectangles,
    );
    this._drawCircle(gl, positionAttribute, colorUniformBack, this.lineColor);
  };

  /**
   * draw triangles data
   * @param gl webgl rendering context
   * @param positionAttr position attribute from shader program
   * @param colorAttr color uniform from shader program
   * @param buffersInfos list of buffer and color associated
   */
  _drawRectangles = (
    gl: WebGLRenderingContext,
    positionAttr: GLint,
    colorAttr: WebGLUniformLocation,
    buffersInfos: IStaticRectangle[],
  ) => {
    buffersInfos.forEach((bi) => {
      const { buffer, color } = bi;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionAttr);
      gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);
      gl.uniform4fv(colorAttr, color);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    });
  };

  /**
   * draw circle data
   * @param gl webgl rendering context
   * @param positionAttr position attribute from shader program
   * @param colorAttr color uniform from shader program
   * @param color color
   */
  _drawCircle = (
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

  /**
   * Create buffer and store them in memory
   * @param gl WebGLRenderingContext
   */
  _initializeBuffers = (gl: WebGLRenderingContext): void => {
    this._positionsBackBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsBackBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsBack, gl.STATIC_DRAW);

    this._positionsBottomBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsBottomBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsBottom, gl.STATIC_DRAW);

    this._positionsLeftBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsLeftBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsLeft, gl.STATIC_DRAW);

    this._positionsRightBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsRightBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsRight, gl.STATIC_DRAW);

    this._positionsTopBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsTopBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsTop, gl.STATIC_DRAW);

    this._positionsLineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionsLineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionsLine, gl.STATIC_DRAW);
  };

  /**
   * Assign buffer and color to the list of static rectangles to draw
   */
  _assignBufferInfos = () => {
    this._staticRectangles = [
      {
        buffer: this._positionsBackBuffer,
        color: this.backgroundColor,
      },
      {
        buffer: this._positionsLineBuffer,
        color: this.lineColor,
      },
      {
        buffer: this._positionsBottomBuffer,
        color: this.lineColor,
      },
      {
        buffer: this._positionsTopBuffer,
        color: this.lineColor,
      },
      {
        buffer: this._positionsRightBuffer,
        color: this.lineColor,
      },
      {
        buffer: this._positionsLeftBuffer,
        color: this.lineColor,
      },
    ];
  };
}

export default Background;
