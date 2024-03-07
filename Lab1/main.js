import { createBuffers } from "./buffers.js";
import { drawScene } from "./scene.js";
import { createShaderProgram, VSHADER_SOURCE, FSHADER_SOURCE } from "./shaders.js";

window.onload = function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Під час ініціалізації WebGL сталася помилка");
    return;
  }

  // Створюємо інформацію про програму шейдерів
  const programInfo = createProgramInfo(gl);

  // Створюємо буфери
  const buffers = createBuffers(gl);

  let previousTime = 0;
  let rotationAngle = 0.0;
  let elapsedTime = 0;

  function render(currentTime) {
    currentTime = currentTime * 0.001;
    elapsedTime = currentTime - previousTime;
    previousTime = currentTime;

    drawScene(gl, programInfo, buffers, rotationAngle);
    rotationAngle -= elapsedTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};

// Функція для створення інформації про програму шейдерів
function createProgramInfo(gl) {
  const shaderProgram = createShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };
  return programInfo;
}
