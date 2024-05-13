import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import initShaders from "../../libs/initShader";
import { batchDataToBuffer } from "../../libs/batchDataToBuffer";
import { mat4, vec3 } from "gl-matrix";
export function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const a_Positon = gl.getAttribLocation(program, "a_Position");
  const a_Color = gl.getAttribLocation(program, "a_Color");

  const eyePosition = vec3.fromValues(0.2, 0.25, 0.25);

  const verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
    0.0,
    0.5,
    -0.4,
    0.4,
    1.0,
    0.4, // The back green one
    -0.5,
    -0.5,
    -0.4,
    0.4,
    1.0,
    0.4,
    0.5,
    -0.5,
    -0.4,
    1.0,
    0.4,
    0.4,

    0.5,
    0.4,
    -0.2,
    1.0,
    0.4,
    0.4, // The middle yellow one
    -0.5,
    0.4,
    -0.2,
    1.0,
    1.0,
    0.4,
    0.0,
    -0.6,
    -0.2,
    1.0,
    1.0,
    0.4,

    0.0,
    0.5,
    0.0,
    0.4,
    0.4,
    1.0, // The front blue one
    -0.5,
    -0.5,
    0.0,
    0.4,
    0.4,
    1.0,
    0.5,
    -0.5,
    0.0,
    1.0,
    0.4,
    0.4,
  ]);
  const buffer = batchDataToBuffer(gl, {
    data: verticesColors,
    targetInfo: [
      {
        length: 3,
        targetLocation: a_Positon,
      },
      {
        length: 3,
        targetLocation: a_Color,
      },
    ],
  });

  // 视图矩阵
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const viewMatrix = getViewMatrix();
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

  // 模型矩阵
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const modelMatrix = getModelMatrix();
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

  // 模视矩阵
  const u_ModelViewMatrix = gl.getUniformLocation(program, "u_ModelViewMatrix");
  const modelViewMatrix = mat4.create();
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, verticesColors.length / 6);

  document.addEventListener("keydown", handleKeyPress);

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      if (eyePosition[0] >= -1) {
        eyePosition[0] -= 0.01;
      }
    } else if (event.key === "ArrowRight") {
      if (eyePosition[0] <= 1) {
        eyePosition[0] += 0.01;
      }
    } else if (event.key === "ArrowUp") {
      if (eyePosition[1] <= 1) {
        eyePosition[1] += 0.01;
      }
    } else if (event.key === "ArrowDown") {
      if (eyePosition[1] >= -1) {
        eyePosition[1] -= 0.01;
      }
    } else {
      return;
    }
    const viewMatrix = getViewMatrix();
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, verticesColors.length / 6);
  }

  function getModelMatrix() {
    const modelMatrix = mat4.create();
    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
    return modelMatrix;
  }
  function getViewMatrix() {
    const target = vec3.fromValues(0.0, 0.0, 0.0);
    const up = vec3.fromValues(0.0, 1.0, 0.0);
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eyePosition, target, up);
    return viewMatrix;
  }
}
