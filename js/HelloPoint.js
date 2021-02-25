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

  let vShader = document.getElementById("vertex-shader")
  let fShader = document.getElementById("fragment-shader")

  if (!initShaders(gl, vShader.textContent, fShader.textContent)) {
    console.log("Failed to initialize shaders.")
    return
  }

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 1)
}