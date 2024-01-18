attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0); // 设置顶点位置
  gl_PointSize = 20.0; // 设置点的大小
}