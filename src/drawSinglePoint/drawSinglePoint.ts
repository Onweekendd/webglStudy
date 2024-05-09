import vertexShader from "./shaders/vertex.vs.glsl";
import fragmentShader from "./shaders/fragment.fs.glsl";
import initShaders from "../../libs/initShader";
export default function main() {
  const pointCoordinates: [number, number][] = [];
  const pointColors: [number, number, number, number][] = [];
  const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl") as WebGLRenderingContext;
  const program = initShaders(gl, vertexShader, fragmentShader);
  if (!program) {
    console.log("Failed to initialize WebGL");
    return;
  }
  const a_Position = gl.getAttribLocation(program, "a_Position");
  const a_Color = gl.getAttribLocation(program, "a_Color");
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空背景颜色缓冲区（即填充背影颜色）
  gl.clear(gl.COLOR_BUFFER_BIT);

  canvas.onclick = click;
  function click(event: MouseEvent) {
    // 屏幕坐标
    const clientX = event.clientX;
    const clientY = event.clientY;

    // canvas坐标
    const rect = canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    // 归一化设备坐标
    const x = (2 * canvasX) / canvas.width - 1;
    const y = 1 - (2 * canvasY) / canvas.height;

    pointCoordinates.push([x, y]);
    if (x >= 0 && y >= 0) {
      pointColors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0 && y < 0) {
      pointColors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
      pointColors.push([1.0, 1.0, 1.0, 1.0]);
    }

    // webgl每次绘制时，都会清空背景颜色为 (0,0,0,0)  所以每次重新绘制时 需要清空背景颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < pointCoordinates.length; i++) {
      const xy = pointCoordinates[i];
      console.log(xy);

      const rgba = pointColors[i];
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      gl.vertexAttrib4f(a_Color, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }
}

main();
