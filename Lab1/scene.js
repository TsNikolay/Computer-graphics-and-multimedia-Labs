function drawScene(gl, programInfo, buffers, squareRotation) {
  clear(gl);
  setupProjectionMatrix(gl, programInfo, gl.canvas.clientWidth, gl.canvas.clientHeight);
  drawRotatingObject(gl, programInfo, buffers.square, squareRotation);
  drawMovingObject(gl, programInfo, buffers.diamond);
  drawTriangle(gl, programInfo, buffers.triangle1);
  drawTriangle(gl, programInfo, buffers.triangle2);
}

// Функція для очищення буферів
function clear(gl) {
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Функція для налаштування матриці проекції
function setupProjectionMatrix(gl, programInfo, width, height) {
  const fieldOfViewRadians = (-55 * Math.PI) / 180; // Визначає поле зору у радіанах.
  const aspectRatio = width / height; // Співвідношення сторін для матриці проекції
  const nearPlane = 0.1; // Відстань від спостерігача до найближчої видимої точки.
  const farPlane = 100.0; // Максимальну відстань, на яку можуть бути поміщені об'єкти.
  const projectionMatrix = mat4.create(); // Створює нову матрицю 4x4 для матриці проекції.
  mat4.perspective(projectionMatrix, fieldOfViewRadians, aspectRatio, nearPlane, farPlane); // Генерує матрицю перспективної проекції
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix); // Встановлює згенеровану матрицю проекції як значення uniform-змінної у програмі шейдерів WebGL.
}

// Функція для малювання трикутника
function drawTriangle(gl, programInfo, triangleBuffers) {
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [2.5, 0.0, -6.0]); //переміщення

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0); //Встановлює атрибут вершин позиції для програмного об'єкта шейдера
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffers.color);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix); //Встановлює модельно-видову матрицю як значення uniform-змінної у програмі шейдерів WebGL.

  const vertexCount = 3;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}

// Функція для малювання обертаючого квадрата
function drawRotatingObject(gl, programInfo, squareBuffer, squareRotation) {
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1]);
  setPositionAttribute(gl, squareBuffer.position, programInfo);
  setColorAttribute(gl, squareBuffer.color, programInfo);
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}

// Функція для малювання рухомого діаманту
function drawMovingObject(gl, programInfo, squareBuffer) {
  const modelViewMatrix2 = mat4.create();
  mat4.translate(modelViewMatrix2, modelViewMatrix2, [-2.5, -0.0, -6.0]);

  const translateY = Math.sin(Date.now() * 0.005) * 0.9;
  mat4.translate(modelViewMatrix2, modelViewMatrix2, [0.0, translateY, 0.0]);
  setPositionAttribute(gl, squareBuffer.position, programInfo);
  setColorAttribute(gl, squareBuffer.color, programInfo);
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix2);

  const vertexCount = 5;
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
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
