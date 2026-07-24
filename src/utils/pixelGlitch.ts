const BL = 14;
const STEP_MS = 90;
const RAMP_MS = 400;
const REACH_FACTOR = 0.62;
const AMBIENT = 0.06;
const CENTER_CLEAR = 0.3;
const SWAP_CHANCE = 0.18;
const SWAP_RADIUS = 3;

interface Sample {
  cols: number;
  rows: number;
  data: Uint8ClampedArray;
}

let cleanup: (() => void) | undefined;

function hash(a: number): number {
  const n = Math.sin(a) * 43758.5453;
  return n - Math.floor(n);
}

export function initPixelGlitch(selector: string): void {
  cleanup?.();
  cleanup = undefined;

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    return;

  const images = [...document.querySelectorAll<HTMLImageElement>(selector)];
  if (images.length === 0)
    return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:10;pointer-events:none;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  function size(): void {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  const off = document.createElement("canvas");
  const offc = off.getContext("2d", { willReadFrequently: true });
  const samples = new WeakMap<HTMLImageElement, Sample>();

  let target: HTMLImageElement | null = null;
  let active: HTMLImageElement | null = null;
  let ramp = 0;
  let lastTs = 0;
  let running = false;
  let rafId = 0;

  function getSample(img: HTMLImageElement, cols: number, rows: number, rect: DOMRect): Sample | null {
    const cached = samples.get(img);
    if (cached && cached.cols === cols && cached.rows === rows)
      return cached;
    const mw = img.naturalWidth;
    const mh = img.naturalHeight;
    if (!mw || !mh || !offc)
      return null;
    off.width = cols;
    off.height = rows;
    const sc = Math.max(rect.width / mw, rect.height / mh);
    const cw = rect.width / sc;
    const ch = rect.height / sc;
    try {
      offc.drawImage(img, (mw - cw) / 2, (mh - ch) / 2, cw, ch, 0, 0, cols, rows);
      const entry: Sample = { cols, rows, data: offc.getImageData(0, 0, cols, rows).data };
      samples.set(img, entry);
      return entry;
    }
    catch {
      return null;
    }
  }

  function loop(ts: number): void {
    const dt = ts - lastTs;
    lastTs = ts;
    ramp = target
      ? Math.min(1, ramp + dt / RAMP_MS)
      : Math.max(0, ramp - dt / RAMP_MS);
    ctx!.clearRect(0, 0, w, h);

    if (active && ramp > 0) {
      const rect = active.getBoundingClientRect();
      if (rect.width > 0 && rect.bottom > 0 && rect.top < h) {
        const cols = Math.floor(rect.width / BL);
        const rows = Math.floor(rect.height / BL);
        if (cols >= 2 && rows >= 2) {
          const sample = getSample(active, cols, rows, rect);
          const eased = ramp * (2 - ramp);
          const reach = Math.min(cols, rows) * REACH_FACTOR * eased;
          if (sample && reach > 0) {
            const step = Math.floor(ts / STEP_MS);
            const left = Math.round(rect.left);
            const top = Math.round(rect.top);
            const s = BL - 1;
            const maxD = Math.sqrt(((cols - 1) / 2) ** 2 + ((rows - 1) / 2) ** 2);
            for (let j = 0; j < rows; j++) {
              for (let i = 0; i < cols; i++) {
                const dcx = Math.min(i, cols - 1 - i);
                const dcy = Math.min(j, rows - 1 - j);
                const d = Math.sqrt(dcx * dcx + dcy * dcy);
                let p = 1 - d / reach;
                p = p > 0 ? p * p : 0;
                const cx = i - (cols - 1) / 2;
                const cy = j - (rows - 1) / 2;
                if (Math.sqrt(cx * cx + cy * cy) / maxD > CENTER_CLEAR)
                  p = Math.max(p, AMBIENT * eased);
                if (p <= 0)
                  continue;
                if (hash(i * 12.9 + j * 78.2 + step * 3.1) > p)
                  continue;
                let k = (j * cols + i) * 4;
                if (hash(i * 3.7 + j * 17.3 + step * 5.9) < SWAP_CHANCE) {
                  const di = Math.round((hash(i * 91.7 + j * 33.1 + step * 7.3) - 0.5) * 2 * SWAP_RADIUS);
                  const dj = Math.round((hash(i * 57.3 + j * 11.9 + step * 2.7) - 0.5) * 2 * SWAP_RADIUS);
                  const ri = Math.min(cols - 1, Math.max(0, i + di));
                  const rj = Math.min(rows - 1, Math.max(0, j + dj));
                  k = (rj * cols + ri) * 4;
                }
                ctx!.fillStyle = `rgb(${sample.data[k]},${sample.data[k + 1]},${sample.data[k + 2]})`;
                ctx!.fillRect(left + i * BL, top + j * BL, s, s);
              }
            }
          }
        }
      }
    }

    if (target || ramp > 0) {
      rafId = requestAnimationFrame(loop);
    }
    else {
      running = false;
      active = null;
      ctx!.clearRect(0, 0, w, h);
    }
  }

  function start(): void {
    if (running)
      return;
    running = true;
    lastTs = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  images.forEach((img) => {
    const host = img.closest("a") ?? img;
    host.addEventListener("mouseenter", () => {
      target = img;
      active = img;
      start();
    });
    host.addEventListener("mouseleave", () => {
      if (target === img)
        target = null;
    });
  });

  cleanup = () => {
    cancelAnimationFrame(rafId);
    running = false;
    window.removeEventListener("resize", size);
    canvas.remove();
  };
}
