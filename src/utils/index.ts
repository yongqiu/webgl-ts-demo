import * as glMatrix from 'gl-matrix'

// 手写矩阵
const rotateMatrixByFloat = (gl, program, angle, uniform: string, type: 'x' | 'y' | 'z') => {
  const rad = Math.PI * angle / 180.0 //将角度转换为弧度
  const cosB = Math.cos(rad)
  const sinB = Math.sin(rad)
  let rotateMatrix: Float32Array;
  switch (type) {
    case 'x':
      rotateMatrix = new Float32Array([
        1, 0, 0, 0,
        0, cosB, sinB, 0,
        0, -sinB, cosB, 0,
        0, 0, 0, 1
      ])
      break;
    case "y":
      rotateMatrix = new Float32Array([
        cosB, 0, sinB, 0,
        0, 1, 0, 0,
        -sinB, 0, cosB, 0,
        0, 0, 0, 1
      ])
      break;
    case "z":
      rotateMatrix = new Float32Array([
        cosB, sinB, 0, 0,
        -sinB, cosB, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ])
      break;
    default:
      break;
  }

  const rotateXUniformLocation = gl.getUniformLocation(program, uniform);
  gl.uniformMatrix4fv(rotateXUniformLocation, false, rotateMatrix)
}

// 通过gl-matrix库生成矩阵
const rotateMatrix = (gl: WebGLRenderingContext, program, angle, uniform: string, type: 'x' | 'y' | 'z') => {
  const rad = Math.PI * angle / 180.0 //将角度转换为弧度
  // let rotateMatrix: Float32Array;
  const mat4 = glMatrix.mat4.create();
  const matOut = glMatrix.mat4.create();
  switch (type) {
    case 'x':
      glMatrix.mat4.rotateX(matOut, mat4, rad);
      break;
    case "y":
      glMatrix.mat4.rotateY(matOut, mat4, rad);
      break;
    case "z":
      glMatrix.mat4.rotateZ(matOut, mat4, rad);
      break;
    default:
      break;
  }

  const uniformLocation = gl.getUniformLocation(program, uniform);
  gl.uniformMatrix4fv(uniformLocation, false, matOut);
}

const translateMatrix = (gl: WebGLRenderingContext, program, value, uniform: string, type: 'x' | 'y' | 'z') => {
  const mat4 = glMatrix.mat4.create();//单位矩阵，辅助创建平移矩阵
  // 创建一个平移矩阵(沿着x平移2)
  const matOut = glMatrix.mat4.create();
  switch (type) {
    case 'x':
      glMatrix.mat4.translate(matOut, mat4, [value, 0, 0]);
      break;
    case "y":
      glMatrix.mat4.translate(matOut, mat4, [0, value, 0]);
      break;
    case "z":
      glMatrix.mat4.translate(matOut, mat4, [0, 0, value]);
      break;
    default:
      break;
  }

  const uniformLocation = gl.getUniformLocation(program, uniform);
  gl.uniformMatrix4fv(uniformLocation, false, matOut);

}

const scaleMatrix = (gl: WebGLRenderingContext, program, scale, uniform: string, type?: 'x' | 'y' | 'z') => {
  const mat4 = glMatrix.mat4.create();
  // 创建一个缩放矩阵(x缩放10) 
  const matOut = glMatrix.mat4.create();
  if (!type) {
    glMatrix.mat4.scale(matOut, mat4, [scale, scale, scale]);
  } else {
    switch (type) {
      case 'x':
        glMatrix.mat4.scale(matOut, mat4, [scale, 1, 1]);
        break;
      case "y":
        glMatrix.mat4.scale(matOut, mat4, [0, scale, 0]);
        break;
      case "z":
        glMatrix.mat4.scale(matOut, mat4, [0, 0, scale]);
        break;
      default:
        break;
    }
  }
  const uniformLocation = gl.getUniformLocation(program, uniform);
  gl.uniformMatrix4fv(uniformLocation, false, matOut);
}



export const utils = {
  rotateMatrix,
  translateMatrix,
  scaleMatrix
}