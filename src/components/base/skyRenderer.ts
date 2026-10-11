import { skyFragmentShader, skyVertexShader } from "./skyShaders";

// Keep the starting sky consistent through navigation, but vary it on a full reload.
const skySeed = new Float32Array([Math.random() * 64, Math.random() * 64]);

export function createSkyRenderer(host: HTMLElement) {
  const canvas = host.querySelector("canvas")!;
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl)
    return;

  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  function release() {
    canvas.classList.add("opacity-0");
    shaders.forEach(shader => gl!.deleteShader(shader));
    gl!.deleteBuffer(buffer);
    gl!.deleteProgram(program);
  }

  for (const [type, source] of [[gl.VERTEX_SHADER, skyVertexShader], [gl.FRAGMENT_SHADER, skyFragmentShader]] as const) {
    const shader = gl.createShader(type);
    if (!shader || !program || !buffer) {
      release();
      return;
    }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      release();
      return;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program!);
  if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) {
    release();
    return;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program!, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program!, "resolution");
  const time = gl.getUniformLocation(program!, "time");
  gl.uniform2fv(gl.getUniformLocation(program!, "seed"), skySeed);
  let visible = false;
  let destroyed = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let lastDraw = -Infinity;
  let frameInterval = 1000 / 24;

  function draw() {
    gl!.uniform2f(resolution, canvas.width, canvas.height);
    gl!.uniform1f(time, elapsed / 1000);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    canvas.classList.remove("opacity-0");
  }

  function resize() {
    const bounds = host.getBoundingClientRect();
    const scale = Math.min(1, 1920 / Math.max(bounds.width, 1), Math.sqrt(1200000 / Math.max(bounds.width * bounds.height, 1)));
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    // Spend the pixel budget on clarity; slow cloud motion needs fewer refreshes.
    frameInterval = Math.max(1000 / 24, canvas.width * canvas.height / 9600000 * 1000);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    if (visible)
      draw();
  }

  function tick(now: number) {
    if (previous)
      elapsed += Math.min(now - previous, 100);
    previous = now;
    if (elapsed - lastDraw >= frameInterval) {
      draw();
      lastDraw = elapsed;
    }
    frame = requestAnimationFrame(tick);
  }

  function setVisible(next: boolean) {
    if (destroyed || next === visible)
      return;
    visible = next;
    previous = 0;
    if (visible) {
      draw();
      frame = requestAnimationFrame(tick);
    }
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  function destroy() {
    if (destroyed)
      return;
    destroyed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    canvas.removeEventListener("webglcontextlost", destroy);
    release();
    gl!.getExtension("WEBGL_lose_context")?.loseContext();
    // A lost context cannot be reused when switching back from the static fallback.
    canvas.replaceWith(canvas.cloneNode(false));
  }

  canvas.addEventListener("webglcontextlost", destroy);
  return { setVisible, destroy };
}
