attribute vec4 a_Position;
uniform vec4 u_Translation;
uniform float u_Cos, u_Sin;

void main() {
    gl_Position.x = a_Position.x * u_Cos - a_Position.y * u_Sin;
    gl_Position.y = a_Position.x * u_Sin + a_Position.y * u_Cos;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
    // gl_Position = a_Position;
}