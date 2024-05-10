attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec3 a_Color;
varying vec4 v_Color;

void main() {
    v_Color = vec4(a_Color, 1.0);
    gl_PointSize = a_PointSize;
    gl_Position = a_Position;
}