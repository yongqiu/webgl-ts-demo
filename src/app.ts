import { mat4, vec3 } from 'gl-matrix';
import vertexShaderSource from './glsl/vertexShader.glsl';

function initWebgl() {
  // 获取画布元素和WebGL上下文
  const canvas = <HTMLCanvasElement>document.getElementById('canvas'); // 获取画布元素
  const gl = canvas.getContext('webgl'); // 获取WebGL上下文

  // 设置画布尺寸
  canvas.width = window.innerWidth; // 设置画布宽度为窗口宽度
  canvas.height = window.innerHeight; // 设置画布高度为窗口高度

  const vertexShader = gl.createShader(gl.VERTEX_SHADER); // 创建顶点着色器对象
  gl.shaderSource(vertexShader, vertexShaderSource); // 设置顶点着色器源代码
  gl.compileShader(vertexShader); // 编译顶点着色器

  // 创建片元着色器
  const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 设置片元颜色为红色
  }
`;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 创建片元着色器对象
  gl.shaderSource(fragmentShader, fragmentShaderSource); // 设置片元着色器源代码
  gl.compileShader(fragmentShader); // 编译片元着色器

  // 创建着色器程序
  const program = gl.createProgram(); // 创建着色器程序对象
  gl.attachShader(program, vertexShader); // 将顶点着色器附加到着色器程序
  gl.attachShader(program, fragmentShader); // 将片元着色器附加到着色器程序
  gl.linkProgram(program); // 链接着色器程序
  gl.useProgram(program); // 使用着色器程序

  // 创建顶点缓冲区
  const positionBuffer = gl.createBuffer(); // 创建顶点缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // 绑定顶点缓冲区
  const positions = [
    0, 0 // 画布中间的点
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // 将顶点数据存入缓冲区

  // 获取顶点着色器中的位置属性
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position'); // 获取顶点着色器中的位置属性的位置
  gl.enableVertexAttribArray(positionAttributeLocation); // 启用顶点属性数组
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0); // 指定顶点属性数据的格式和位置

  // 清空画布并绘制点
  gl.clearColor(0, 0, 0, 1); // 设置清空画布时的颜色
  gl.clear(gl.COLOR_BUFFER_BIT); // 清空画布
  gl.drawArrays(gl.POINTS, 0, 1); // 绘制点
}
initWebgl()