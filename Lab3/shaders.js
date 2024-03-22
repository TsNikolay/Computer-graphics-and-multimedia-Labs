const vertexShader = `
attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix*uModelViewMatrix*vPosition;
    fColor = vColor;
}
`;

const fragmentShader = `
precision mediump float;

varying vec4 fColor;

void main() {
    gl_FragColor = fColor;
}
`;

function createShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Перевірка на успішність лінкування
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("An error occurred while initializing the shader program");
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source); //Вказуємо джерело
  gl.compileShader(shader); // Компілюємо

  // Перевірка на успішність компіляції
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred while compiling a shader");
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export { createShaderProgram, fragmentShader, vertexShader };
