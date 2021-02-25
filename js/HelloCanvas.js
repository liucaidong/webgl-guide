function main() {
  let canvas = document.getElementById("webgl")
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element")
    return;
  }

  let gl = getWebGLContext(canvas, true)
  if (!gl) {
    console.log("Failed to get the rendering context for WebGl")
    return;
  }

  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}