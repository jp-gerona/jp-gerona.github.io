import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let removeScrollListener: (() => void) | null = null;

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  removeScrollListener?.();
  removeScrollListener = null;

  lenisInstance?.destroy();
  lenisInstance = null;
}

export function initSmoothScroll() {
  if (typeof window === "undefined") {
    return null;
  }

  destroySmoothScroll();

  lenisInstance = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  removeScrollListener = lenisInstance.on("scroll", ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  return lenisInstance;
}
