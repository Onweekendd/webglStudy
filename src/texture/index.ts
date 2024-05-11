import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import initShaders from "../../libs/initShader";
import Texture01 from "/images/Texture01.png";
import Texture02 from "/images/Texture02.png";
import { batchDataToBuffer } from "../../libs/batchDataToBuffer";
import { initTexture } from "../../libs/loadTexture";
async function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const a_Positon = gl.getAttribLocation(program, "a_Position");
  const a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
  const u_Sampler1 = gl.getUniformLocation(program, "u_Sampler1");
  const u_Sampler2 = gl.getUniformLocation(program, "u_Sampler2");
  if (u_Sampler1 === null || u_Sampler2 === null) {
    console.log("Failed to get uniform location");
    return;
  }
  const vertexPositionsWithUvCoordinates = new Float32Array([
    -0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.5, -0.5, 1.0, 0.0,
  ]);

  const buffer = batchDataToBuffer(gl, {
    data: vertexPositionsWithUvCoordinates,
    targetInfo: [
      {
        length: 2,
        targetLocation: a_Positon,
      },
      {
        length: 2,
        targetLocation: a_TexCoord,
      },
    ],
  });

  await initTexture(gl, u_Sampler1, Texture01, 0);
  await initTexture(gl, u_Sampler2, Texture02, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export { main };
