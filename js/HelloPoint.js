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
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

  // gl.vertexAttrib4f(a_Position, 0.5, 0.0, 0.0, 1.0)
  gl.vertexAttrib4fv(a_Position, new Float32Array([0.3, 0.6, 0.3, 1.0]))
  gl.vertexAttrib1f(a_PointSize, 50.0)

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 1)
}