function initVertexBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexData: [number, number, number][],
): WebGLBuffer;
function initVertexBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexData: [number, number][],
): WebGLBuffer;
function initVertexBuffers(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexData: [number, number][] | [number, number, number][],
): WebGLBuffer {
  // 使用缓冲区批量传递顶点数据
  const vertices = new Float32Array(vertexData.flat(1));
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
  // 判断类型？
  if (vertexData[0].length === 3) {
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  } else {
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  }

  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  return vertexBuffer;
}
export { initVertexBuffers };
