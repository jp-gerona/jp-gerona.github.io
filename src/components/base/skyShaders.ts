export const skyVertexShader = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const skyFragmentShader = `
precision highp float;
varying vec2 uv;
uniform vec2 resolution;
uniform float time;
uniform vec2 seed;

float random(vec2 cell) {
  vec3 seed = fract(vec3(cell.x, cell.y, cell.x + cell.y) * 0.1031);
  seed += dot(seed, seed.yzx + 31.32);
  return fract((seed.x + seed.y) * seed.z);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 weight = fract(point);
  weight = weight * weight * (3.0 - 2.0 * weight);
  return mix(
    mix(random(cell), random(cell + vec2(1.0, 0.0)), weight.x),
    mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0)), weight.x),
    weight.y
  );
}

float layeredNoise(vec2 point, float frequency) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
  for (int octave = 0; octave < 5; octave++) {
    // Average detail smaller than a canvas pixel instead of letting it alias.
    float detail = 1.0 - smoothstep(0.25, 0.75, frequency / resolution.y);
    value += mix(0.5, noise(point), detail) * amplitude;
    point = rotation * point * 2.0 + vec2(7.2, 9.1);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

void main() {
  vec2 point = vec2(uv.x * resolution.x / resolution.y, uv.y) + seed;
  float clock = time * 0.04;
  vec2 drift = vec2(clock, 0.0);
  vec2 turbulence = 0.10 * vec2(
    noise(point * 0.5 + clock * 0.25),
    noise(point * 0.5 + vec2(3.1) - clock * 0.2)
  );
  vec2 flow = drift + turbulence;
  float region = layeredNoise(point * 1.2 + vec2(4.5, 12.3) + flow * 0.2, 1.2);
  // A fixed frequency avoids folding the domain as the coverage field changes.
  vec2 domain = point * 6.5 + flow;
  float body = layeredNoise(domain, 6.5);
  float edges = layeredNoise(point * 13.0 + flow * 1.3, 13.0);
  float wisps = layeredNoise(point * 26.0 + flow * 1.6, 26.0);
  float field = body * 0.65 + edges * 0.3 + wisps * 0.15;
  float coverage = 0.53 + (0.5 - region) * 0.18;
  float density = smoothstep(coverage, coverage + 0.14, field);
  float above = layeredNoise(domain + vec2(0.0, 0.04), 6.5);
  float light = clamp(0.35 + (body - above) * 7.0, 0.0, 1.0);
  vec3 cloud = mix(vec3(0.65, 0.78, 0.91), vec3(1.0), light);
  vec3 sky = mix(vec3(0.42, 0.66, 0.88), vec3(0.10, 0.36, 0.68), uv.y);
  gl_FragColor = vec4(mix(sky, cloud, density), 1.0);
}
`;
