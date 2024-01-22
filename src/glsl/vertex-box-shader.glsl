//attribute声明vec4类型变量apos
attribute vec4 apos;
// attribute声明顶点颜色变量
attribute vec4 a_color;
//varying声明顶点颜色插值后变量
varying vec4 v_color;
uniform mat4 matY;
uniform mat4 matX;
uniform mat4 translateX;
uniform mat4 matScale;
void main() {
  gl_Position = matX*matY*apos;
  //顶点颜色插值计算
  v_color = a_color;
}