import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

type SplitTarget = string | Element | Element[] | NodeListOf<Element>;
type CounterTarget = string | Element;

export const COUNTER_MILESTONES = [9, 17, 25, 34, 42, 50, 59, 67, 75, 84, 92, 96, 100] as const;

export type SplitTextOptions = Partial<SplitText.Vars>;

export function splitTextIntoLines(selector: SplitTarget, options: SplitTextOptions = {}) {
  const defaults = {
    ...options,
    type: options.type ?? "lines",
    mask: options.mask ?? "lines",
    aria: options.aria ?? "none",
    linesClass: options.linesClass ?? "line",
  } satisfies SplitText.Vars;

  return SplitText.create(selector, defaults);
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
