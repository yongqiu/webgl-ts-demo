import { mat4, vec3 } from 'gl-matrix';
import vboxShaderSource from './glsl/vertex-box-shader.glsl';
import vpicShaderSource from './glsl/vertex-pic-shader.glsl';
import fboxShaderSource from './glsl/fragment-box-shader.glsl';
import fpicShaderSource from './glsl/fragment-pic-shader.glsl';
import pic from './images/glb.jpg';

import { utils } from './utils';


function draw() {
  const gl = initGl();
  const boxProgram = createProgram(gl, vboxShaderSource, fboxShaderSource);

  const picProgram = createProgram(gl, vpicShaderSource, fpicShaderSource);



  /**
     创建顶点位置数据数组data,Javascript中小数点前面的0可以省略
     **/
  var cubeData = new Float32Array([
    .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5,      //面1
    .5, .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5,      //面2
    .5, .5, .5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, .5,      //面3
    -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5,//面4
    -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5,//面5
    .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5 //面6
  ]);
  /**
   创建顶点颜色数组colorData
   **/
  var colorData = new Float32Array([
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面1
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,//绿色——面2
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,//蓝色——面3
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,//黄色——面4
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,//黑色——面5
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 //白色——面6
  ]);

  /**纹理映射顶点数据**/
  var picData = new Float32Array([
    -0.5, 0.5, -0.51,//左上角——v0
    -0.5, -0.5, -0.51,//左下角——v1
    0.5, 0.5, -0.51,//右上角——v2
    0.5, -0.5, -0.51//右下角——v3
  ]);
  /**UV纹理坐标数据textureData**/
  var textureData = new Float32Array([
    0, 1,//左上角——uv0
    0, 0,//左下角——uv1
    1, 1,//右上角——uv2
    1, 0 //右下角——uv3
  ]);

  /**加载纹理图像像素数据**/
  var image = new Image();
  image.onload = texture;
  image.src = pic;


  // box着色器变量
  const apos = gl.getAttribLocation(boxProgram, 'apos');  // 获取顶点着色器中的apos的储存地址
  const a_color = gl.getAttribLocation(boxProgram, 'a_color');  // 获取顶点着色器中的apos的储存地址
  // pic着色器变量
  var texturePosition = gl.getAttribLocation(picProgram, 'a_Position');
  var a_TexCoord = gl.getAttribLocation(picProgram, 'a_TexCoord');
  var u_Sampler = gl.getUniformLocation(picProgram, 'u_Sampler');




  function texture() {
    gl.useProgram(picProgram); // 使用着色器程序
    var texture = gl.createTexture();//创建纹理图像缓冲区
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //纹理图片上下反转
    gl.activeTexture(gl.TEXTURE0);//激活0号纹理单元TEXTURE0
    gl.bindTexture(gl.TEXTURE_2D, texture);//绑定纹理缓冲区
    //设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //设置纹素格式，png格式对应gl.RGBA
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    vertexBuffer(gl, picData, texturePosition, 3);
    vertexBuffer(gl, textureData, a_TexCoord, 2);
    gl.uniform1i(u_Sampler, 0);//纹理缓冲区单元TEXTURE0中的颜色数据传入片元着色器
    // pic旋转
    utils.rotateMatrix(gl, picProgram, 30, 'my', 'y')
    utils.rotateMatrix(gl, picProgram, 30, 'mx', 'x')
    /**执行绘制，纹理映射像素值存入颜色缓冲区**/
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(boxProgram);
    // box定点、颜色缓冲区
    vertexBuffer(gl, cubeData, apos, 3);
    vertexBuffer(gl, colorData, a_color, 3);
    // box旋转
    utils.rotateMatrix(gl, boxProgram, 30, 'matX', 'x')
    utils.rotateMatrix(gl, boxProgram, 30, 'matY', 'y')
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }







  // 绘制
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 清空画布并绘制点
  // gl.clearColor(0, 0, 0, 1); // 设置清空画布时的颜色
  // gl.clear(gl.COLOR_BUFFER_BIT); // 清空画布


  /**执行绘制之前，一定要开启深度测试，以免颜色混乱**/
  gl.enable(gl.DEPTH_TEST);
  /**执行绘制命令**/





}

const createProgram = (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER); // 创建顶点着色器对象
  gl.shaderSource(vertexShader, vertexSource); // 设置顶点着色器源代码
  gl.compileShader(vertexShader); // 编译顶点着色器

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 创建片元着色器对象
  gl.shaderSource(fragmentShader, fragmentSource); // 设置片元着色器源代码
  gl.compileShader(fragmentShader); // 编译片元着色器

  // 创建着色器程序
  const program = gl.createProgram(); // 创建着色器程序对象
  gl.attachShader(program, vertexShader); // 将顶点着色器附加到着色器程序
  gl.attachShader(program, fragmentShader); // 将片元着色器附加到着色器程序
  gl.linkProgram(program); // 链接着色器程序


  return program;
}

const initGl = (): WebGLRenderingContext => {
  // 获取画布元素和WebGL上下文
  const canvas = <HTMLCanvasElement>document.getElementById('canvas'); // 获取画布元素
  const gl = canvas.getContext('webgl'); // 获取WebGL上下文

  // 设置画布尺寸
  canvas.width = 800; // 设置画布宽度为窗口宽度
  canvas.height = 800; // 设置画布高度为窗口高度
  canvas.style.backgroundColor = '#0d72da'
  return gl;
}

/**
     * 顶点数据配置函数vertexBuffer()
     * 顶点数据data
     * 顶点位置position
     * 间隔数量n
     **/
function vertexBuffer(gl: WebGLRenderingContext, data: Float32Array, location: number, size: number) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);
}

draw()