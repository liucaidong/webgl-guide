function main() {
  let canvas = document.getElementById("webgl")
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element")
    return
  }

  let gl = getWebGLContext(canvas, true)
  if (!gl) {
    console.log("Failed to get the rendering context for WebGl")
    return
  }

  let vShaderText = `
    attribute vec4 a_Position;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = 20.0;
    }
  `

  let fShaderText = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      // if(gl_FragCoord.x < 100.0){
      //   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      // }else if (gl_FragCoord.x < 200.0) {
      //   gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      // }else {
      //   gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      // }

      // gl_FragColor = vec4(gl_FragCoord.x / 400.0 * 1.0, 1.0, 0.0, 1.0);

      float r = distance(gl_PointCoord, vec2(0.5, 0.5));
      if (r < 0.5) {
        gl_FragColor = u_FragColor;
      }else {
        discard;
      }
    }
  `

  if (!initShaders(gl, vShaderText, fShaderText)) {
    console.log("Failed to initialize shaders.")
    return
  }

  let dotCount = 5
  /* 设置顶点位置 */
  initVertexBuffers(gl, new Float32Array([
    0.0, 0.5, 
    -0.5, -0.5, 
    0.5, -0.5, 
    0.3, -0.3
  ]), dotCount)

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  
  /** 
   * 如果不清空画布会怎么样，webgl每次绘制之后，
   * 颜色缓冲区会被重置为默认的(0.0,0.0,0.0,0.0)，
   * alpha分量为0.0，背景色是透明了，所以需要每次绘制之前，
   * 应该用gl.clear来指定背景色
   */
  gl.clear(gl.COLOR_BUFFER_BIT)

  /* 只需要调用一次就绘制完成 */
  gl.drawArrays(gl.POINTS, 0, dotCount)

}

/* 批量设置顶点位置 */
function initVertexBuffers(gl, vertices, dotCount) {
  
  /* 1. 创建缓冲区对象 */
  let vertexBuffer = gl.createBuffer()
  if(!vertexBuffer) {
    console.log("Failed to create the buffer object")
    return -1
  }
  /* 2. 将缓冲区对象绑定到目标 */
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  /* 3. 向缓冲区对象中写入数据 */
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  /* 4. 找到a_Position的位置 */
  let a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }
  /* 5. 将缓冲区对象分配给a_Position变量 */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  /* 6. 连接a_Position变量与分配给它的缓冲区对象 */
  gl.enableVertexAttribArray(a_Position)

}