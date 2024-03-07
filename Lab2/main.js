import { fragmentShader, vertexShader, createShaderProgram } from "./shaders.js";

//Змінні для точки
let pointBuffer;
let pointColorBuffer;
let pointIndex = 0;
const pointVertexNumber = 1;

//Змінні для трикутника
let triangleBuffer;
let triangleColorBuffer;
let triangleIndex = 0;
let trianglePoints = [];
const triangleVertexNumber = 3;

//Змінні для круга
let circleBuffer;
let circleColorBuffer;
let circleIndex = 0;
let circlePoints = [];
const circleVertexNumber = 38;

//Змінні та налаштування програми
let canvas;
let gl;
let vPosition;
let vColor;
let color = vec4(0.9, 0.9, 0.9, 1.0);
let drawMode = "points";
const maxNumOfFigures = 15;

//Елементи інтерфейсу
const clearButton = document.getElementById("clearButton");
const colorSelect = document.getElementById("colorSelect");
const drawModeOptions = document.getElementsByName("drawMode");

//Ініціалізація програми
window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {
    alert("WebGL is not available");
  }

  clearButton.addEventListener("click", clearCanvas);

  colorSelect.addEventListener("change", function (event) {
    color = vec4(event.target.value.split(",").map(parseFloat));
  });

  drawModeOptions.forEach((option) => {
    option.addEventListener("change", function (event) {
      drawMode = event.target.value;
    });
  });

  canvas.addEventListener("click", (event) => {
    // Перетворимо координати кліка в діапазон [-1, 1]
    const canvasRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const mouseCoordinates = vec2(
      (2 * x) / canvas.width - 1,
      (2 * (canvas.height - y)) / canvas.height - 1
    );

    switch (drawMode) {
      case "points":
        if (isMaximumReached(pointIndex, maxNumOfFigures, 1)) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer); // Прив'язуємо буфер вершин точок
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * pointIndex, flatten(mouseCoordinates)); // Записуємо координати нової точки у буфер вершин

        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer); // Прив'язуємо буфер кольорів точок
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * pointIndex, flatten(color)); // Записуємо кольори для нової точки у буфер кольорів

        pointIndex += pointVertexNumber;
        break;
      case "triangles":
        if (isMaximumReached(triangleIndex, maxNumOfFigures, 3)) return;

        trianglePoints.push(mouseCoordinates);

        if (trianglePoints.length === 3) {
          gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 8 * triangleIndex, flatten(trianglePoints));

          gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
          for (let i = 0; i < trianglePoints.length; i++) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (triangleIndex + i), flatten(color));
          }

          triangleIndex += triangleVertexNumber;
          trianglePoints = [];
        }
        break;
      case "circles":
        if (isMaximumReached(circleIndex, maxNumOfFigures, 39)) return;

        if (circlePoints.length === 0) {
          circlePoints.push(mouseCoordinates);
        } else {
          const radius = distance(mouseCoordinates, circlePoints[0]);
          for (let i = 0; i <= 360; i += 10) {
            const angle = radians(i);
            const x = circlePoints[0][0] + radius * Math.cos(angle);
            const y = circlePoints[0][1] + radius * Math.sin(angle);
            circlePoints.push(vec2(x, y));
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 8 * circleIndex, flatten(circlePoints));

          gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
          for (let i = 0; i < circlePoints.length; i++) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (circleIndex + i), flatten(color));
          }

          circleIndex += circleVertexNumber;
          circlePoints = [];
        }
        break;
    }
  });

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.2, 0.2, 0.2, 1.0);

  const program = createShaderProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  pointBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * 1 * maxNumOfFigures, gl.STATIC_DRAW);

  triangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * 3 * maxNumOfFigures, gl.STATIC_DRAW);

  circleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * 38 * maxNumOfFigures, gl.STATIC_DRAW);

  pointColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * pointVertexNumber * maxNumOfFigures, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * triangleVertexNumber * maxNumOfFigures, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  circleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * circleVertexNumber * maxNumOfFigures, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  vPosition = gl.getAttribLocation(program, "vPosition");
  vColor = gl.getAttribLocation(program, "vColor");

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawFigures(pointBuffer, pointColorBuffer, pointIndex, pointVertexNumber, "point");
  drawFigures(triangleBuffer, triangleColorBuffer, triangleIndex, triangleVertexNumber, "triangle");
  drawFigures(circleBuffer, circleColorBuffer, circleIndex, circleVertexNumber, "circle");
  window.requestAnimationFrame(render);
}

function clearCanvas() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  pointIndex = 0;
  triangleIndex = 0;
  circleIndex = 0;
  trianglePoints = [];
  circlePoints = [];
}

function drawFigures(buffer, colorBuffer, index, vertexNumber, type) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); //зв'язуємо буфер з контекстом WebGL
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); //ставимо вказівник атрибута вершини для позиції вершин
  gl.enableVertexAttribArray(vPosition); //Вмикаємо атрибут вершини

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  for (let i = 0; i < index; i += vertexNumber) {
    if (type === "point") {
      gl.drawArrays(gl.POINTS, i, vertexNumber);
    } else if (type === "triangle") {
      gl.drawArrays(gl.TRIANGLES, i, vertexNumber);
    } else {
      gl.drawArrays(gl.TRIANGLE_FAN, i, vertexNumber);
    }
  }
}

function isMaximumReached(figureIndex, maxNumberOfFigures, numberOfFigureVertex) {
  if (figureIndex / numberOfFigureVertex >= maxNumberOfFigures) {
    alert("The maximum number of figures of this type has been reached ");
    return true;
  } else {
    return false;
  }
}

function distance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}
