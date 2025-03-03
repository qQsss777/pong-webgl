import Actor from "../common/Actor";

interface IBackgroundConstructor {
  backgroundColor: string;
  lineColor: string;
}

class Background extends Actor implements IBackgroundConstructor {
  backgroundColor: string;
  lineColor: string;
  positions = new Float32Array([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);

  constructor(props: IBackgroundConstructor) {
    super();
    this.backgroundColor = props.backgroundColor;
    this.lineColor = props.lineColor;
  }

  draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    // Lier les données des sommets aux shaders
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    // récupération de la couleur
    const color = [0.79, 0.11, 1.0, 1]; // Initial color is blue
    const colorUniform = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(colorUniform, color);
    // appel de rendu
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    console.log(gl.canvas);
  };
}

export default Background;
