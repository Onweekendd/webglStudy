import initShaders from "../../libs/initShader";
import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import { mat4, vec3 } from "gl-matrix";
import { batchDataToBuffer } from "../../libs/batchDataToBuffer";

export function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const a_Color = gl.getAttribLocation(program, "a_Color");
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  const u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  const u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");

  const modelMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();

  const verticesPositionAndColors = new Float32Array([
    // Vertex coordinates and color
    0.0,
    1.0,
    -4.0,
    0.4,
    1.0,
    0.4, // The back green one

    -0.5,
    -1.0,
    -4.0,
    0.4,
    1.0,
    0.4,

    0.5,
    -1.0,
    -4.0,
    1.0,
    0.4,
    0.4,

    0.0,
    1.0,
    -2.0,
    1.0,
    1.0,
    0.4, // The middle yellow one
    -0.5,
    -1.0,
    -2.0,
    1.0,
    1.0,
    0.4,
    0.5,
    -1.0,
    -2.0,
    1.0,
    0.4,
    0.4,

    0.0,
    1.0,
    0.0,
    0.4,
    0.4,
    1.0, // The front blue one
    -0.5,
    -1.0,
    0.0,
    0.4,
    0.4,
    1.0,
    0.5,
    -1.0,
    0.0,
    1.0,
    0.4,
    0.4,
  ]);

  const buffer = batchDataToBuffer(gl, {
    data: verticesPositionAndColors,
    targetInfo: [
      {
        length: 3,
        targetLocation: a_Position,
      },
      {
        length: 3,
        targetLocation: a_Color,
      },
    ],
  });

  mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0, 0));
  mat4.lookAt(
    viewMatrix,
    vec3.fromValues(0, 0, 5),
    vec3.fromValues(0, 0, -100),
    vec3.fromValues(0, 1, 0),
  );
  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, verticesPositionAndColors.length / 6);

  mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-1.5, 0, 0));
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, verticesPositionAndColors.length / 6);
}
