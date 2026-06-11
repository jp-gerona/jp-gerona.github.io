import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let removeScrollListener: (() => void) | null = null;
let shouldDisableLenisForDevice = false;

const COARSE_POINTER_MEDIA_QUERY = "(pointer: coarse)";
const MOBILE_TABLET_VIEWPORT_QUERY = "(max-width: 1024px)";
const MOBILE_TABLET_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;

function isMobileOrTabletBrowser() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent;
  const isKnownMobileOrTabletUserAgent = MOBILE_TABLET_USER_AGENT_REGEX.test(userAgent);
  const isIpadDesktopMode = userAgent.includes("Macintosh") && window.navigator.maxTouchPoints > 1;
  const hasCoarsePointer = window.matchMedia(COARSE_POINTER_MEDIA_QUERY).matches;
  const isTabletViewport = window.matchMedia(MOBILE_TABLET_VIEWPORT_QUERY).matches;

  return isKnownMobileOrTabletUserAgent || isIpadDesktopMode || (hasCoarsePointer && isTabletViewport);
}

function canUseLenisOnDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return !ScrollTrigger.isTouch && !isMobileOrTabletBrowser();
}

function disableScrollNormalization() {
  const scrollTriggerWithNormalize = ScrollTrigger as unknown as {
    normalizeScroll?: (normalize?: boolean) => unknown;
  };

  scrollTriggerWithNormalize.normalizeScroll?.(false);
}

function setupLenisInstance() {
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
}

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

export function scrollToTop() {
  if (typeof window === "undefined") {
    return;
  }

  if (lenisInstance && !shouldDisableLenisForDevice) {
    lenisInstance.scrollTo(0, {
      duration: 0.9,
      easing: (value: number) => 1 - (1 - value) ** 3,
    });
    return;
  }

  window.scrollTo({ behavior: "smooth", top: 0 });
}

export function initSmoothScroll() {
  if (typeof window === "undefined") {
    return null;
  }

  disableScrollNormalization();
  shouldDisableLenisForDevice = !canUseLenisOnDevice();

  if (shouldDisableLenisForDevice) {
    destroySmoothScroll();
    ScrollTrigger.refresh();
    return null;
  }

  if (!lenisInstance) {
    setupLenisInstance();
  }

  lenisInstance?.start();
  ScrollTrigger.refresh();

  return lenisInstance;
}
