/**
 * Initializes and uses a shader program based on provided vertex and fragment shader source code.
 * This function creates a shader program, attaches the compiled shaders to it, links the program,
 * and sets it as the current active program in the provided WebGL rendering context.
 *
 * @param gl The WebGLRenderingContext to use for shader program initialization.
 * @param vertexShaderString The source code of the vertex shader.
 * @param fragmentShaderString The source code of the fragment shader.
 * @returns The created and initialized shader program, or null if the program could not be created or linked successfully.
 */
export default function initShaders(
  gl: WebGLRenderingContext,
  vertexShaderString: string,
  fragmentShaderString: string,
) {
  const program = createProgram(gl, vertexShaderString, fragmentShaderString);
  if (!program) {
    return null;
  }
  gl.useProgram(program);
  return program;
}

/**
 * Creates a shader program from the provided vertex and fragment shader sources.
 * @param gl the WebGLRenderingContext
 * @param vertexShaderSource the source code of the vertex shader
 * @param fragmentShaderSource the source code of the fragment shader
 * @returns the created shader program or null if an error occurred
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexShaderString: string,
  fragmentShaderString: string,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderString);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return null;
}

/**
 * Creates a shader of the specified type.
 * @param gl the WebGLRenderingContext
 * @param type the type of the shader, e.g. gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param source the source code of the shader
 * @returns the created shader or null if an error occurred
 */
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}
