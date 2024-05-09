import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import initShaders from "../../libs/initShader";
export default function main() {
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const pointList: [number, number][] = [
    [0, 0.5],
    [0.5, -0.5],
    [-0.5, -0.5],
  ];
  const buffer = initVertexBuffers(pointList);
  const u_Translation = gl.getUniformLocation(program, "u_Translation");
  const u_Cos = gl.getUniformLocation(program, "u_Cos");
  const u_Sin = gl.getUniformLocation(program, "u_Sin");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空背景颜色缓冲区（即填充背影颜色）
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, pointList.length);

  rotate(90);
  translate([0.0, 0.0]);
  function initVertexBuffers(pointList: [number, number][]) {
    // 使用缓冲区批量传递顶点数据
    const vertices = new Float32Array(pointList.flat(1));
    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program!, "a_Position");

    // 将缓冲区对象分配给a_Position变量   前一章使用的是 vertexAttrib3f 进行分配，但只能分配一个值
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return vertexBuffer;
  }
  function translate(translation: [number, number]) {
    gl.uniform4f(u_Translation, translation[0], translation[1], 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length);
  }
  function rotate(angle: number) {
    const theta = (angle * Math.PI) / 180;

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    console.log(cos, sin);

    gl.uniform1f(u_Cos, cos);
    gl.uniform1f(u_Sin, sin);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length);
  }
}

main();
