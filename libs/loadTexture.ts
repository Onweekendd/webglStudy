/**
 * Initializes a WebGL texture from an image URL.
 *
 * @param gl - The WebGL rendering context.
 * @param samplerLocation - The WebGL program to which the texture will be bound.
 * @param imageUrl - The URL of the image to load into the texture.
 * @param textUnitNo - The WebGL texture unit to which the texture will be bound.
 *
 * @returns A Promise that resolves to the initialized WebGL texture when the image is loaded,
 *          or rejects with an error if the image fails to load.
 */
export function initTexture(
  gl: WebGLRenderingContext,
  samplerLocation: WebGLUniformLocation,
  imageUrl: string,
  textUnitNo: number = 0,
) {
  const texture = gl.createTexture();
  const image = new Image();
  /**
   * Loads the image into the WebGL texture.
   *
   * Flips the image along the y-axis before loading it into the texture.
   */
  function loadTexture() {
    // 对图像进行y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 准备激活的纹理单元（因为WebGL无法直接操作纹理对象，只能通过纹理单元进行操作）
    // @ts-expect-error (${textUnitNo}) ---> TEXTURE[0 ~ 7]
    gl.activeTexture(gl[`TEXTURE${textUnitNo}`]);
    // 指定纹理要绑定的对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(samplerLocation, textUnitNo);
  }
  return new Promise((resolve, reject) => {
    image.onload = () => {
      loadTexture();
      resolve(texture);
    };
    image.onerror = () => {
      reject(new Error("Failed to load texture"));
    };
    image.src = imageUrl;
  });
}
