attribute vec4 a_Position;//顶点位置坐标
attribute vec2 a_TexCoord;//纹理坐标
varying vec2 v_TexCoord;//插值后纹理坐标
/**uniform声明旋转矩阵变量mx、my**/
uniform mat4 mx;//绕x轴旋转矩阵
uniform mat4 my;//绕y轴旋转矩阵
void main() {
  //两个旋转矩阵、顶点齐次坐标连乘
  gl_Position = mx*my*a_Position;
  //纹理坐标插值计算
  v_TexCoord = a_TexCoord;
}