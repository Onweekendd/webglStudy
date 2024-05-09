attribute vec4 a_Position;
uniform vec4 u_Translation;
uniform mat4 u_xformMatrix;

void main() {
    gl_Position = u_xformMatrix * a_Position;
}