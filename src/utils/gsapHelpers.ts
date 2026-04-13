import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

type SplitTarget = string | Element | Element[] | NodeListOf<Element>;
type CounterTarget = string | Element;

export const COUNTER_MILESTONES = [9, 17, 25, 34, 42, 50, 59, 67, 75, 84, 92, 96, 100] as const;

export type SplitTextOptions = Partial<SplitText.Vars>;

export interface SplitTextHoverSwapOptions {
  currentSelector?: string;
  nextSelector?: string;
  type?: string;
  duration?: number;
  stagger?: number;
  ease?: string;
}

function ensureSplitTextPlugin() {
  gsap.registerPlugin(SplitText);
}

function toElementArray(target: SplitTarget): Element[] {
  if (typeof target === "string") {
    return [...document.querySelectorAll(target)];
  }

  if (target instanceof Element) {
    return [target];
  }

  return [...target];
}

function resolveSplitTargets(split: SplitText, type: string, fallback: HTMLElement): Element[] {
  const splitTypePriority = type
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);

  for (const splitType of splitTypePriority) {
    if (splitType === "chars" && split.chars.length > 0) {
      return split.chars;
    }

    if (splitType === "words" && split.words.length > 0) {
      return split.words;
    }

    if (splitType === "lines" && split.lines.length > 0) {
      return split.lines;
    }
  }

  if (split.chars.length > 0) {
    return split.chars;
  }

  if (split.words.length > 0) {
    return split.words;
  }

  if (split.lines.length > 0) {
    return split.lines;
  }

  return [fallback];
}

function createSplitTargets(target: HTMLElement, type: string): Element[] {
  try {
    const split = SplitText.create(target, { aria: "none", type });
    return resolveSplitTargets(split, type, target);
  }
  catch {
    return [target];
  }
}

export function splitTextIntoLines(selector: SplitTarget, options: SplitTextOptions = {}) {
  ensureSplitTextPlugin();

  const defaults = {
    ...options,
    type: options.type ?? "lines",
    mask: options.mask ?? "lines",
    aria: options.aria ?? "none",
    linesClass: options.linesClass ?? "line",
  } satisfies SplitText.Vars;

  return SplitText.create(selector, defaults);
}

export function setupSplitTextHoverSwap(target: SplitTarget, options: SplitTextHoverSwapOptions = {}) {
  if (typeof window === "undefined") {
    return;
  }

  ensureSplitTextPlugin();

  const {
    currentSelector = "[data-split-hover-current]",
    nextSelector = "[data-split-hover-next]",
    type = "lines",
    duration = 0.16,
    stagger = 0,
    ease = "power3.out",
  } = options;

  const targets = toElementArray(target);

  targets.forEach((hoverTarget) => {
    if (!(hoverTarget instanceof HTMLElement) || hoverTarget.dataset.hoverSwapReady === "true") {
      return;
    }

    const currentText = hoverTarget.querySelector<HTMLElement>(currentSelector);
    const nextText = hoverTarget.querySelector<HTMLElement>(nextSelector);

    if (!currentText || !nextText) {
      return;
    }

    const currentTargets = createSplitTargets(currentText, type);
    const nextTargets = createSplitTargets(nextText, type);

    gsap.set([...currentTargets, ...nextTargets], {
      willChange: "transform",
    });
    gsap.set(currentTargets, { yPercent: 0 });
    gsap.set(nextTargets, { yPercent: 100 });

    const hoverTimeline = gsap.timeline({
      defaults: { duration, ease },
      paused: true,
    });

    hoverTimeline
      .to(currentTargets, {
        overwrite: "auto",
        stagger,
        yPercent: -100,
      }, 0)
      .to(nextTargets, {
        overwrite: "auto",
        stagger,
        yPercent: 0,
      }, 0);

    const playHoverIn = () => hoverTimeline.play();
    const playHoverOut = () => hoverTimeline.reverse();

    hoverTarget.addEventListener("mouseenter", playHoverIn);
    hoverTarget.addEventListener("mouseleave", playHoverOut);
    hoverTarget.addEventListener("focusin", playHoverIn);
    hoverTarget.addEventListener("focusout", playHoverOut);

    hoverTarget.dataset.hoverSwapReady = "true";
  });
}

export function animateCounter(
  selector: CounterTarget,
  duration = 1,
  delay = 0,
  onUpdate?: (progress: number) => void,
) {
  const counterElement = typeof selector === "string"
    ? document.querySelector<HTMLElement>(selector)
    : selector;

  if (!(counterElement instanceof HTMLElement)) {
    return null;
  }

  counterElement.textContent = "";
  counterElement.style.overflow = "hidden";
  counterElement.style.display = "inline-flex";
  counterElement.style.height = "1em";
  counterElement.style.lineHeight = "1em";
  counterElement.style.justifyContent = "flex-end";
  counterElement.style.minWidth = "4ch";
  counterElement.style.textAlign = "right";

  const strip = document.createElement("div");
  strip.style.display = "flex";
  strip.style.flexDirection = "column";
  strip.style.alignItems = "flex-end";
  strip.style.width = "100%";
  strip.style.willChange = "transform";

  for (let value = 0; value <= 100; value += 1) {
    const item = document.createElement("div");
    item.textContent = `${value}%`;
    item.style.height = "1em";
    item.style.lineHeight = "1em";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "flex-end";
    item.style.width = "100%";
    item.style.minWidth = "4ch";
    strip.append(item);
  }

  counterElement.append(strip);

  const firstItem = strip.firstElementChild as HTMLDivElement | null;
  const itemHeight = firstItem?.getBoundingClientRect().height
    || counterElement.getBoundingClientRect().height
    || 16;

  const counterTimeline = gsap.timeline({ delay });
  const rampEase = gsap.parseEase("power3.in");
  let previousRampedProgress = 0;

  for (const milestone of COUNTER_MILESTONES) {
    const currentProgress = milestone / 100;
    const currentRampedProgress = rampEase(currentProgress);
    const stepDuration = Math.max((currentRampedProgress - previousRampedProgress) * duration, 0.02);

    counterTimeline.to(strip, {
      y: -(milestone * itemHeight),
      duration: stepDuration,
      ease: "expo.out",
      overwrite: "auto",
      onStart: () => {
        onUpdate?.(milestone);
      },
    });

    previousRampedProgress = currentRampedProgress;
  }

  return counterTimeline;
}
