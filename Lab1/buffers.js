// Функція для створення буферів
function createBuffers(gl) {
  return {
    triangle1: createBuffer(
      gl,
      [-1.0, 0.8, 0.0, -1.0, -1.0, 0.0, 1.5, 0.8, 0.0],
      [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0]
    ),
    triangle2: createBuffer(
      gl,
      [1.5, 0.8, 0.0, -1.0, -1.0, 0.0, 1.5, -1.0, 0.0],
      [0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0]
    ),
    square: createBuffer(
      gl,
      [0.8, 0.8, -0.8, 0.8, 0.8, -0.8, -0.8, -0.8],
      [0.0, 0.0, 1.0, 1.0, 0.0, 0.5, 1.0, 1.0, 0.0, 0.75, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]
    ),
    diamond: createBuffer(
      gl,
      [-0.3, 0.1, 0.3, 0.1, 0.6, 0.35, 0.0, 0.9, -0.6, 0.35],
      [
        1.0, 1.0, 1.0, 1.0, 0.7, 0.7, 1.0, 1.0, 0.9, 0.9, 1.0, 1.0, 0.3, 0.3, 1.0, 1.0, 0.9, 0.9,
        1.0, 1.0,
      ]
    ),
  };
}

// Функція для створення буфера
function createBuffer(gl, positions, colors) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return { position: positionBuffer, color: colorBuffer };
}

export { createBuffers };
