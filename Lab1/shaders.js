// Вершинний шейдер
const VSHADER_SOURCE = `
attribute vec4 aVertexPosition;  //атрибут вершини, чьотирьохзначний вектор з позицією вершини
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;  //юніф. зм. для передачі матриць моделі-виду в шейдер
uniform mat4 uProjectionMatrix;  //юніф. зм. для передачі проекції . Для перетв. вершин в координати екрана

varying lowp vec4 vColor;  //зміна , що передає  колір з вершинного шейдера у фрагментний

void main(void){
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition; //кінцева позиція вершини
  vColor = aVertexColor;
}
`;

// Фрагментний шейдер
const FSHADER_SOURCE = `
varying lowp vec4 vColor; //зміна що отримана з вершинного шейдеру, колір 

void main(void){
  gl_FragColor = vColor;
}
`;

// Функція для створення програми шейдерів
function createShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Під час ініціалізації програми шейдерів виникла помилка");
    return null;
  }

  return shaderProgram;
}

// Функція для завантаження шейдера
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Під час компіляції шейдера виникла помилка");
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export { createShaderProgram, loadShader, VSHADER_SOURCE, FSHADER_SOURCE };
