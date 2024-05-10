import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import initShaders from "../../libs/initShader";
import { initVertexBuffers } from "../../libs/initVertexBuffers";
import { mat4 } from "gl-matrix";

export default function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  let lastTime = 0;
  let currentAngle = 0;
  const ROTATE_SPEED = 10;
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const pointList: [number, number][] = [
    [0, 0.5],
    [0.5, -0.5],
    [-0.5, -0.5],
  ];
  const buffer = initVertexBuffers(gl, program, pointList);
  // 绕z轴旋转矩阵
  const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  gl.clearColor(0, 0, 0, 1);
  // 清空背景颜色缓冲区（即填充背影颜色）
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, pointList.length);

  // 每帧都进行旋转
  function rotateAnimation() {
    currentAngle = (currentAngle + getCurrentTickAddedAngle()) % 360;
    const theta = (Math.PI * currentAngle) / 180;
    const rotateMatrix = mat4.create();
    mat4.rotateZ(rotateMatrix, rotateMatrix, theta);

    gl.uniformMatrix4fv(u_ModelMatrix, false, rotateMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length);
    requestAnimationFrame(rotateAnimation);
  }

  rotateAnimation();

  function getCurrentTickAddedAngle() {
    if (!lastTime) {
      lastTime = performance.now();
      return currentAngle;
    }
    const now = performance.now();
    const elapsedTime = now - lastTime;
    lastTime = now;
    // 确保均摊下来的旋转量是不变的
    return ((elapsedTime / 1000) * ROTATE_SPEED) % 360;
  }
}
