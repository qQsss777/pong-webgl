/**
 * matrix not necessery but i want to learn how to use it
 */
export const vsSource = `
attribute vec4 a_position;
uniform mat4 u_matrix;

void main() {
   gl_Position = a_position * u_matrix;
}
`;

export const fsSource = `
precision lowp float;
uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

export const initShaderProgram = (
  gl: WebGLRenderingContext,
): WebGLProgram | null => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return null;
  // Créer le programme shader
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Si la création du programme shader a échoué, alerte
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Impossible d'initialiser le programme shader : " +
        gl.getProgramInfoLog(shaderProgram),
    );
    return null;
  }
  return shaderProgram;
};

const loadShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  // Envoyer le source à l'objet shader

  gl.shaderSource(shader, source);

  // Compiler le programme shader

  gl.compileShader(shader);

  // Vérifier s'il a ét compilé avec succès
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Erreur lors de la compilation: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};
