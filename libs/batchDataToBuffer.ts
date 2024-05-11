type DataType = {
  // 要存入缓存的数据
  data: Float32Array;
  // 每个顶点获取到的数据长度
  // 要绑定目标的信息
  targetInfo: {
    length: number;
    targetLocation: number;
  }[];
};
// 多个数据存入一个缓存中
function batchDataToBuffer(gl: WebGLRenderingContext, { data, targetInfo }: DataType) {
  const buffer = gl.createBuffer();
  const singleVertexLength = targetInfo.reduce((pre, cur) => {
    return pre + cur.length;
  }, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const ELEMENT_SIZE = data.BYTES_PER_ELEMENT;
  for (let i = 0; i < targetInfo.length; i++) {
    const { length, targetLocation } = targetInfo[i];
    let startPosition = 0;
    for (let j = i - 1; j >= 0; --j) {
      startPosition += targetInfo[j].length * ELEMENT_SIZE;
    }
    gl.vertexAttribPointer(
      targetLocation,
      length,
      gl.FLOAT,
      false,
      singleVertexLength * ELEMENT_SIZE,
      startPosition,
    );
    gl.enableVertexAttribArray(targetLocation);
  }
  return buffer;
}

export { batchDataToBuffer };
