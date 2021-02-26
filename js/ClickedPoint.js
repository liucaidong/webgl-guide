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
    attribute float a_PointSize;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
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

  let a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position")
    return
  }
  let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize")

  let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor")

  // gl.vertexAttrib4f(a_Position, 0.5, 0.0, 0.0, 1.0)
  gl.vertexAttrib4fv(a_Position, new Float32Array([0.3, 0.6, 0.3, 1.0]))
  gl.vertexAttrib1f(a_PointSize, 20.0)

  /* 使用匿名函数是为了访问main函数内部的 gl、 canvas、 a_Position 等变量 */
  canvas.onmousedown = function(e) {
    click(e, gl, canvas, a_Position, u_FragColor)
  }

  let g_points = []
  let g_colors = []
  function click(e, gl, canvas, a_Position, u_FragColor) {
    let x = e.clientX
    let y = e.clientY
    let rect = e.target.getBoundingClientRect()
    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2)
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2)
    
    g_points.push([x,y])

    if(x >= 0.0 && y >= 0.0) {
      g_colors.push([1.0, 0.0, 0.0, 1.0])
    }else if(x <= 0.0 && y <= 0.0){
      g_colors.push([0.0, 1.0, 0.0, 1.0])
    }else {
      g_colors.push([1.0, 1.0, 1.0, 1.0])
    }

    /** 
     * 如果不清空画布会怎么样，webgl每次绘制之后，
     * 颜色缓冲区会被重置为默认的(0.0,0.0,0.0,0.0)，
     * alpha分量为0.0，背景色是透明了，所以需要每次绘制之前，
     * 应该用gl.clear来指定背景色
     */
    gl.clear(gl.COLOR_BUFFER_BIT)

    let len = g_points.length
    /* 只画一个点 */
    // gl.vertexAttrib2fv(a_Position, g_points[len - 1])
    // gl.drawArrays(gl.POINTS, 0, 1)

    /* 画全部点 */
    for (let i=0; i<len; i++) {
      gl.vertexAttrib2fv(a_Position, g_points[i])
      gl.uniform4fv(u_FragColor, g_colors[i])
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

}