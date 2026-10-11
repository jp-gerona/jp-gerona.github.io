import { Buffer } from "node:buffer";
import process from "node:process";
import sharp from "sharp";
import { skyFragmentShader, skyVertexShader } from "../src/components/base/skyShaders.js";

// Use an existing Playwright installation and browser; this script installs neither.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome node scripts/generate-sky.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  channel: process.env.CHROME_PATH ? undefined : "chromium",
  headless: true,
});
try {
  const page = await browser.newPage();
  const png = await page.evaluate(({ vertex, fragment }) => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 720;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl)
      throw new Error("WebGL unavailable");
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(gl.getUniformLocation(program, "resolution"), canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, "time"), 0);
    gl.uniform2f(gl.getUniformLocation(program, "seed"), 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return canvas.toDataURL("image/png").split(",")[1];
  }, { vertex: skyVertexShader, fragment: skyFragmentShader });
  await sharp(Buffer.from(png, "base64")).webp({ quality: 82 }).toFile(new URL("../public/assets/sky.webp", import.meta.url).pathname);
}
finally {
  await browser.close();
}
