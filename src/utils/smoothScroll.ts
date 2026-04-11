import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let removeScrollListener: (() => void) | null = null;
let hasBoundPreloaderEvents = false;
let shouldDisableLenisForDevice = false;
let isScrollLocked = false;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";

const COARSE_POINTER_MEDIA_QUERY = "(pointer: coarse)";
const MOBILE_TABLET_VIEWPORT_QUERY = "(max-width: 1024px)";
const MOBILE_TABLET_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;

type WindowWithScrollFlags = Window & {
  preloaderActive?: boolean;
};

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

function isPreloaderActive() {
  return Boolean((window as WindowWithScrollFlags).preloaderActive);
}

function lockNativeScroll() {
  if (isScrollLocked) {
    return;
  }

  previousHtmlOverflow = document.documentElement.style.overflow;
  previousBodyOverflow = document.body.style.overflow;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  isScrollLocked = true;
}

function unlockNativeScroll() {
  if (!isScrollLocked) {
    return;
  }

  document.documentElement.style.overflow = previousHtmlOverflow;
  document.body.style.overflow = previousBodyOverflow;
  isScrollLocked = false;
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

function bindPreloaderEvents() {
  if (hasBoundPreloaderEvents || typeof window === "undefined") {
    return;
  }

  window.addEventListener("preloaderStart", () => {
    lockNativeScroll();
    lenisInstance?.stop();
  });

  window.addEventListener("preloaderComplete", () => {
    unlockNativeScroll();

    if (lenisInstance && !shouldDisableLenisForDevice) {
      lenisInstance.start();
      ScrollTrigger.refresh();
    }
  });

  hasBoundPreloaderEvents = true;
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

export function initSmoothScroll() {
  if (typeof window === "undefined") {
    return null;
  }

  bindPreloaderEvents();
  disableScrollNormalization();
  shouldDisableLenisForDevice = !canUseLenisOnDevice();

  if (shouldDisableLenisForDevice) {
    destroySmoothScroll();

    if (isPreloaderActive()) {
      lockNativeScroll();
    }
    else {
      unlockNativeScroll();
    }

    ScrollTrigger.refresh();
    return null;
  }

  if (!lenisInstance) {
    setupLenisInstance();
  }

  if (isPreloaderActive()) {
    lockNativeScroll();
    lenisInstance?.stop();
  }
  else {
    unlockNativeScroll();
    lenisInstance?.start();
  }

  ScrollTrigger.refresh();

  return lenisInstance;
}
