import initShaders from "../../libs/initShader";
import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import { batchDataToBuffer } from "../../libs/batchDataToBuffer";
function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const vertexPositionAndSize = new Float32Array([
    0.0, 0.5, 10.0, 0.725, 0.132, 0.898, -0.5, -0.5, 20.0, 0.456, 0.789, 0.234, 0.5, -0.5, 30.0,
    0.901, 0.567, 0.098,
  ]);
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  const a_Color = gl.getAttribLocation(program, "a_Color");
  const buffer = batchDataToBuffer(gl, {
    data: vertexPositionAndSize,
    singleVertexLength: 6,
    targetInfo: [
      {
        length: 2,
        targetLocation: a_Position,
      },
      {
        length: 1,
        targetLocation: a_PointSize,
      },
      {
        length: 3,
        targetLocation: a_Color,
      },
    ],
  });
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionAndSize.length / 3);
}

export default main;
