// eslint-disable-next-line unused-imports/no-unused-imports
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

type SplitTarget = string | Element | Element[] | NodeListOf<Element>;
type CounterTarget = string | Element;

export type SplitTextOptions = Partial<SplitText.Vars>;

export function splitTextIntoLines(selector: SplitTarget, options: SplitTextOptions = {}) {
  const defaults = {
    ...options,
    type: options.type ?? "lines",
    mask: options.mask ?? "lines",
    linesClass: options.linesClass ?? "line",
  } satisfies SplitText.Vars;

  return SplitText.create(selector, defaults);
}

export function animateCounter(selector: CounterTarget, duration = 5, delay = 0) {
  const counterElement = typeof selector === "string"
    ? document.querySelector(selector)
    : selector;

  if (!counterElement) {
    return;
  }

  let currentValue = 0;
  const updateInterval = 200;
  const maxDuration = duration * 1000;
  const startTime = Date.now();

  setTimeout(() => {
    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / maxDuration;

      if (currentValue < 100 && elapsedTime < maxDuration) {
        const target = Math.floor(progress * 100);
        const jump = Math.floor(Math.random() * 25) + 5;
        currentValue = Math.min(currentValue + jump, target, 100);

        counterElement.textContent = currentValue.toString().padStart(2, "0");
        setTimeout(updateCounter, updateInterval + Math.random() * 100);
      }
      else {
        counterElement.textContent = "100";
      }
    };

    updateCounter();
  }, delay * 1000);
}
