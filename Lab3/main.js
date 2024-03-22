"use strict";

import { fragmentShader, vertexShader, createShaderProgram } from "./shaders.js";
let projection = "orthogonal";

window.onload = function init() {
  let canvas;
  let gl;

  const numPositions = 36;
  const positionsArray = [];
  const colorsArray = [];

  let near;
  let vertices;
  let far;
  let radius;

  if (projection === "orthogonal") {
    vertices = [
      vec4(-0.5, -0.5, 0.5, 1.0),
      vec4(-0.5, 0.5, 0.5, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0.5, -0.5, 0.5, 1.0),
      vec4(-0.5, -0.5, -0.5, 1.0),
      vec4(-0.5, 0.5, -0.5, 1.0),
      vec4(0.5, 0.5, -0.5, 1.0),
      vec4(0.5, -0.5, -0.5, 1.0),
    ];

    near = -1;
    far = 1;
    radius = 0.1;
  } else {
    vertices = [
      vec4(-0.5, -0.5, 1.5, 1.0),
      vec4(-0.5, 0.5, 1.5, 1.0),
      vec4(0.5, 0.5, 1.5, 1.0),
      vec4(0.5, -0.5, 1.5, 1.0),
      vec4(-0.5, -0.5, 0.5, 1.0),
      vec4(-0.5, 0.5, 0.5, 1.0),
      vec4(0.5, 0.5, 0.5, 1.0),
      vec4(0.5, -0.5, 0.5, 1.0),
    ];

    near = 1.2;
    far = 12;
    radius = 4.0;
  }

  const vertexColors = [
    vec4(0.5, 0.0, 0.5, 1),
    vec4(1.0, 0.5, 0.0, 1),
    vec4(1.0, 1.0, 0.0, 1),
    vec4(0.0, 0.3, 1.0, 1),
    vec4(0.5, 0.0, 0.5, 1),
    vec4(1.0, 0.5, 0.0, 1),
    vec4(1.0, 1.0, 0.0, 1),
    vec4(0.0, 0.3, 1.0, 1),
  ];

  let theta = 0.0; // Кут повороту навколо осі Y
  let phi = 0.0; // Кут повороту навколо осі X
  const dr = (5.0 * Math.PI) / 180.0; // Крок зміни угла

  const left = -1.0;
  const right = 1.0;
  const top = 1.0;
  const bottom = -1.0;
  const fovy = 45.0; //Кут нахилу
  let aspect; // Співвідношення ширини канвасу до його висоти

  let modelViewMatrix, projectionMatrix;
  let modelViewMatrixLoc, projectionMatrixLoc;
  let eye; // Положення камери

  const at = vec3(0.0, 0.0, 0.0); //Точка куди дивиться камера
  const up = vec3(0.0, 1.0, 0.0); // Напрямок "вгору" для камери

  const downButton = document.getElementById("Down");
  const upButton = document.getElementById("Up");
  const leftButton = document.getElementById("Left");
  const rightButton = document.getElementById("Right");
  const modeButton = document.getElementById("Mode");

  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  gl.viewport(0, 0, canvas.width, canvas.height);

  aspect = canvas.width / canvas.height; //???
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.8, 0.8, 0.8, 0.87);

  const program = createShaderProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  colorCube();

  const cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  const colorLoc = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

  let interval1, interval2, interval3, interval4;

  downButton.onmousedown = function () {
    interval1 = setInterval(function () {
      theta += dr;
    }, 50);
  };
  downButton.onmouseup = function () {
    clearInterval(interval1);
  };

  upButton.onmousedown = function () {
    interval2 = setInterval(function () {
      theta -= dr;
    }, 50);
  };
  upButton.onmouseup = function () {
    clearInterval(interval2);
  };

  leftButton.onmousedown = function () {
    interval3 = setInterval(function () {
      phi += dr;
    }, 50);
  };
  leftButton.onmouseup = function () {
    clearInterval(interval3);
  };

  rightButton.onmousedown = function () {
    interval4 = setInterval(function () {
      phi -= dr;
    }, 50);
  };
  rightButton.onmouseup = function () {
    clearInterval(interval4);
  };

  modeButton.onclick = function () {
    toggleProjection();
  };

  render();

  function colorCube() {
    quad(1, 0, 3, 2, vertexColors[1], vertexColors[0], vertexColors[3], vertexColors[2]);
    quad(2, 3, 7, 6, vertexColors[2], vertexColors[3], vertexColors[7], vertexColors[6]);
    quad(3, 0, 4, 7, vertexColors[3], vertexColors[0], vertexColors[4], vertexColors[7]);
    quad(6, 5, 1, 2, vertexColors[6], vertexColors[5], vertexColors[1], vertexColors[2]);
    quad(4, 5, 6, 7, vertexColors[4], vertexColors[5], vertexColors[6], vertexColors[7]);
    quad(5, 4, 0, 1, vertexColors[5], vertexColors[4], vertexColors[0], vertexColors[1]);
  }

  function quad(a, b, c, d, colorA, colorB, colorC, colorD) {
    positionsArray.push(vertices[a]);
    colorsArray.push(colorA);
    positionsArray.push(vertices[b]);
    colorsArray.push(colorB);
    positionsArray.push(vertices[c]);
    colorsArray.push(colorC);
    positionsArray.push(vertices[a]);
    colorsArray.push(colorA);
    positionsArray.push(vertices[c]);
    colorsArray.push(colorC);
    positionsArray.push(vertices[d]);
    colorsArray.push(colorD);
  }

  function toggleProjection() {
    projection = projection === "orthogonal" ? "perspective" : "orthogonal";
    init();
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius * Math.sin(phi), radius * Math.sin(theta), radius * Math.cos(phi));
    modelViewMatrix = lookAt(eye, at, up);

    if (projection === "orthogonal") {
      projectionMatrix = ortho(left, right, bottom, top, near, far);
    } else {
      projectionMatrix = perspective(fovy, aspect, near, far);
    }
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
  }
};
