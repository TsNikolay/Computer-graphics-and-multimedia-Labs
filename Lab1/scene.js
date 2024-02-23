function drawScene(gl, programInfo, buffers, squareRotation) {
  clearBuffers(gl);
  setupProjectionMatrix(gl, programInfo, gl.canvas.clientWidth, gl.canvas.clientHeight);
  drawRotatingSquare(gl, programInfo, buffers.square, squareRotation);
  drawMovingSquare(gl, programInfo, buffers.diamond);
  drawTriangle(gl, programInfo, buffers.triangle1);
  drawTriangle(gl, programInfo, buffers.triangle2);
}

// Функція для очищення буферів
function clearBuffers(gl) {
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Функція для налаштування матриці проекції
function setupProjectionMatrix(gl, programInfo, width, height) {
  const fieldOfViewRadians = (-55 * Math.PI) / 180;
  const aspectRatio = width / height;
  const nearPlane = 0.1;
  const farPlane = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfViewRadians, aspectRatio, nearPlane, farPlane);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
}

// Функція для малювання трикутника
function drawTriangle(gl, programInfo, triangleBuffers) {
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [2.5, 0.0, -6.0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffers.color);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  const vertexCount = 3;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}

// Функція для малювання обертаючого квадрата
function drawRotatingSquare(gl, programInfo, squareBuffer, squareRotation) {
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1]);
  setPositionAttribute(gl, squareBuffer.position, programInfo);
  setColorAttribute(gl, squareBuffer.color, programInfo);
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

// Функція для малювання рухомого квадрата
function drawMovingSquare(gl, programInfo, squareBuffer) {
  const modelViewMatrix2 = mat4.create();
  mat4.translate(modelViewMatrix2, modelViewMatrix2, [-2.5, -0.0, -6.0]);
  const translateY = Math.sin(Date.now() * 0.005) * 0.9;
  mat4.translate(modelViewMatrix2, modelViewMatrix2, [0.0, translateY, 0.0]);
  setPositionAttribute(gl, squareBuffer.position, programInfo);
  setColorAttribute(gl, squareBuffer.color, programInfo);
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix2);
  {
    const vertexCount = 5;
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
  }
}

// Функція для встановлення атрибуту позиції
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Функція для встановлення атрибуту кольору
function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };
