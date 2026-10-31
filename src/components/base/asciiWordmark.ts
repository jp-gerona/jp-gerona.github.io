type InteractionPhase = "assembled" | "scattered" | "fallen";

interface CharacterParticle {
  homePositionX: number;
  homePositionY: number;
  positionX: number;
  positionY: number;
  scatteredPositionX: number;
  scatteredPositionY: number;
  horizontalVelocity: number;
  verticalVelocity: number;
  transitionDelay: number;
  character: string;
  nextCharacterChange: number;
  settled: boolean;
}

const ASCII_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&";
const MAXIMUM_PARTICLES = 1800;
const cleanupWordmarks = new Set<() => void>();

function randomCharacter(): string {
  return ASCII_CHARACTERS[Math.floor(Math.random() * ASCII_CHARACTERS.length)];
}

function initializeWordmark(container: HTMLElement): (() => void) | undefined {
  const button = container.querySelector("button");
  const canvas = container.querySelector("canvas");
  const context = canvas?.getContext("2d");
  if (!button || !canvas || !context)
    return;

  const abortController = new AbortController();
  const eventOptions = { signal: abortController.signal };
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = reducedMotionQuery.matches;
  let particles: CharacterParticle[] = [];
  let interactionPhase: InteractionPhase = "assembled";
  let canvasWidth = 0;
  let canvasHeight = 0;
  let characterSize = 8;
  let characterColor = "";
  let animationFrame = 0;
  let previousTimestamp = 0;
  let simulationTime = 0;
  let phaseStartTime = 0;
  let visible = false;
  let intersectsViewport = false;
  let fontsReady = false;
  let resizePending = true;
  let destroyed = false;
  const pointerPosition = { positionX: 0, positionY: 0, active: false };

  function updateInteractionLabel() {
    const nextAction = interactionPhase === "assembled"
      ? "scatter"
      : interactionPhase === "scattered" ? "drop" : "reconstruct";
    const accessibleLabel = reducedMotion
      ? `ASCII wordmark: ${mobileQuery.matches ? "jp" : container.dataset.wordmarkText}`
      : `${nextAction[0].toUpperCase()}${nextAction.slice(1)} ASCII wordmark`;
    button!.setAttribute("aria-label", accessibleLabel);
    button!.disabled = reducedMotion;
  }

  function scatterParticle(particle: CharacterParticle) {
    particle.scatteredPositionX = Math.max(characterSize, Math.min(canvasWidth - characterSize, particle.homePositionX + (Math.random() - 0.5) * canvasWidth * 0.35));
    particle.scatteredPositionY = Math.max(characterSize, Math.min(canvasHeight - characterSize, particle.homePositionY + (Math.random() - 0.5) * canvasHeight * 0.55));
  }

  function populateParticles() {
    const bounds = button!.getBoundingClientRect();
    canvasWidth = Math.round(bounds.width);
    canvasHeight = Math.round(bounds.height);
    if (!canvasWidth || !canvasHeight)
      return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(canvasWidth * pixelRatio);
    canvas!.height = Math.round(canvasHeight * pixelRatio);
    context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    characterColor = getComputedStyle(container).color;

    const wordmarkText = mobileQuery.matches ? "jp" : container.dataset.wordmarkText!;
    const sampler = document.createElement("canvas");
    sampler.width = canvasWidth;
    sampler.height = canvasHeight;
    const samplerContext = sampler.getContext("2d")!;
    samplerContext.font = "800 100px system-ui, sans-serif";
    const measuredText = samplerContext.measureText(wordmarkText);
    const textHeight = measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent;
    const maskFontSize = 100 * Math.min(canvasWidth * 0.88 / measuredText.width, canvasHeight * 0.7 / textHeight);
    samplerContext.font = `800 ${maskFontSize}px system-ui, sans-serif`;
    const fittedText = samplerContext.measureText(wordmarkText);
    const textPositionX = (canvasWidth - fittedText.width) / 2;
    const textPositionY = (canvasHeight + fittedText.actualBoundingBoxAscent - fittedText.actualBoundingBoxDescent) / 2;
    samplerContext.fillText(wordmarkText, textPositionX, textPositionY);
    const maskPixels = samplerContext.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const gridSpacing = Math.max(11, Math.ceil(Math.sqrt(fittedText.width * (fittedText.actualBoundingBoxAscent + fittedText.actualBoundingBoxDescent) / MAXIMUM_PARTICLES)));
    characterSize = 11;
    particles = [];

    for (let positionY = gridSpacing; positionY < canvasHeight - gridSpacing; positionY += gridSpacing) {
      for (let positionX = gridSpacing; positionX < canvasWidth - gridSpacing; positionX += gridSpacing) {
        if (maskPixels[(positionY * canvasWidth + positionX) * 4 + 3] < 128)
          continue;
        if (particles.length >= MAXIMUM_PARTICLES)
          break;
        const particle: CharacterParticle = {
          homePositionX: positionX,
          homePositionY: positionY,
          positionX,
          positionY,
          scatteredPositionX: positionX,
          scatteredPositionY: positionY,
          horizontalVelocity: 0,
          verticalVelocity: 0,
          transitionDelay: Math.random() * 180,
          character: randomCharacter(),
          nextCharacterChange: simulationTime + 200 + Math.random() * 1800,
          settled: true,
        };
        if (interactionPhase === "scattered") {
          scatterParticle(particle);
          particle.positionX = particle.scatteredPositionX;
          particle.positionY = particle.scatteredPositionY;
        }
        else if (interactionPhase === "fallen") {
          particle.positionY = canvasHeight - characterSize;
        }
        particles.push(particle);
      }
    }

    pointerPosition.active = false;
    resizePending = false;
    updateInteractionLabel();
    drawParticles();
    canvas!.classList.remove("opacity-0");
  }

  function drawParticles() {
    context!.clearRect(0, 0, canvasWidth, canvasHeight);
    context!.fillStyle = characterColor;
    context!.font = `${characterSize}px 'Departure Mono', monospace`;
    context!.textAlign = "center";
    context!.textBaseline = "middle";
    for (const particle of particles)
      context!.fillText(particle.character, particle.positionX, particle.positionY);
  }

  function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousTimestamp = 0;
  }

  function renderFrame(timestamp: number) {
    animationFrame = 0;
    if (destroyed || !visible || document.hidden)
      return;
    if (resizePending)
      populateParticles();
    if (reducedMotion) {
      drawParticles();
      return;
    }

    const elapsedSeconds = previousTimestamp ? Math.min((timestamp - previousTimestamp) / 1000, 0.05) : 0;
    previousTimestamp = timestamp;
    simulationTime += elapsedSeconds * 1000;
    const easingFactor = 1 - Math.exp(-9 * elapsedSeconds);
    const characterPadding = characterSize;
    const floorPositionY = canvasHeight - characterPadding;
    const hoverRadius = Math.min(110, canvasWidth * 0.15);

    for (const particle of particles) {
      if (simulationTime >= particle.nextCharacterChange) {
        particle.character = randomCharacter();
        particle.nextCharacterChange = simulationTime + 400 + Math.random() * 1800;
      }

      if (simulationTime - phaseStartTime >= particle.transitionDelay) {
        if (interactionPhase === "fallen" && !particle.settled) {
          particle.verticalVelocity += 1000 * elapsedSeconds;
          particle.positionX += particle.horizontalVelocity * elapsedSeconds;
          particle.positionY += particle.verticalVelocity * elapsedSeconds;
          if (particle.positionY >= floorPositionY) {
            particle.positionY = floorPositionY;
            particle.verticalVelocity *= -0.25;
            particle.horizontalVelocity *= 0.6;
            if (Math.abs(particle.verticalVelocity) < 25) {
              particle.verticalVelocity = 0;
              particle.horizontalVelocity = 0;
              particle.settled = true;
            }
          }
        }
        else if (interactionPhase !== "fallen") {
          let targetPositionX = interactionPhase === "assembled" ? particle.homePositionX : particle.scatteredPositionX;
          let targetPositionY = interactionPhase === "assembled" ? particle.homePositionY : particle.scatteredPositionY;
          if (pointerPosition.active) {
            const distanceX = targetPositionX - pointerPosition.positionX;
            const distanceY = targetPositionY - pointerPosition.positionY;
            const distance = Math.hypot(distanceX, distanceY);
            if (distance < hoverRadius) {
              const repulsion = (1 - distance / hoverRadius) * 65;
              targetPositionX += (distance ? distanceX / distance : 1) * repulsion;
              targetPositionY += (distance ? distanceY / distance : 0) * repulsion;
            }
          }
          particle.positionX += (targetPositionX - particle.positionX) * easingFactor;
          particle.positionY += (targetPositionY - particle.positionY) * easingFactor;
        }
      }

      particle.positionX = Math.max(characterPadding, Math.min(canvasWidth - characterPadding, particle.positionX));
      particle.positionY = Math.max(characterPadding, Math.min(floorPositionY, particle.positionY));
    }

    drawParticles();
    animationFrame = requestAnimationFrame(renderFrame);
  }

  function resumeAnimation() {
    if (!destroyed && fontsReady && visible && !document.hidden && !animationFrame)
      animationFrame = requestAnimationFrame(renderFrame);
  }

  function updateVisibility() {
    const coveringContent = container.closest("footer")?.previousElementSibling;
    // The sticky footer can intersect the viewport while the page still covers it.
    const uncovered = !coveringContent || coveringContent.getBoundingClientRect().bottom < button!.getBoundingClientRect().bottom;
    visible = intersectsViewport && uncovered;
    if (visible)
      resumeAnimation();
    else
      stopAnimation();
  }

  button.addEventListener("click", () => {
    if (reducedMotion || !particles.length)
      return;
    interactionPhase = interactionPhase === "assembled" ? "scattered" : interactionPhase === "scattered" ? "fallen" : "assembled";
    phaseStartTime = simulationTime;
    pointerPosition.active = false;
    for (const particle of particles) {
      if (interactionPhase === "scattered") {
        scatterParticle(particle);
      }
      particle.horizontalVelocity = (Math.random() - 0.5) * 60;
      particle.verticalVelocity = 0;
      particle.settled = false;
    }
    updateInteractionLabel();
    resumeAnimation();
  }, eventOptions);

  button.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !hoverQuery.matches || reducedMotion)
      return;
    const bounds = button.getBoundingClientRect();
    pointerPosition.positionX = event.clientX - bounds.left;
    pointerPosition.positionY = event.clientY - bounds.top;
    pointerPosition.active = true;
  }, eventOptions);
  button.addEventListener("pointerleave", () => {
    pointerPosition.active = false;
  }, eventOptions);

  const resizeObserver = new ResizeObserver(() => {
    resizePending = true;
    updateVisibility();
  });
  resizeObserver.observe(button);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    intersectsViewport = entry.isIntersecting;
    updateVisibility();
  });
  intersectionObserver.observe(button);

  window.addEventListener("scroll", updateVisibility, { ...eventOptions, passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden)
      stopAnimation();
    else
      resumeAnimation();
  }, eventOptions);
  reducedMotionQuery.addEventListener("change", (event) => {
    reducedMotion = event.matches;
    stopAnimation();
    if (reducedMotion)
      interactionPhase = "assembled";
    resizePending = true;
    updateInteractionLabel();
    resumeAnimation();
  }, eventOptions);
  mobileQuery.addEventListener("change", () => {
    resizePending = true;
    resumeAnimation();
  }, eventOptions);
  hoverQuery.addEventListener("change", () => {
    pointerPosition.active = false;
  }, eventOptions);

  updateInteractionLabel();
  void document.fonts.ready.then(() => {
    fontsReady = true;
    resumeAnimation();
  });

  return () => {
    destroyed = true;
    stopAnimation();
    abortController.abort();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    button.disabled = true;
    delete container.dataset.wordmarkInitialized;
    canvas.classList.add("opacity-0");
  };
}

export function initializeAsciiWordmarks(): void {
  for (const container of document.querySelectorAll<HTMLElement>("[data-ascii-wordmark]")) {
    if (container.dataset.wordmarkInitialized)
      continue;
    const cleanup = initializeWordmark(container);
    if (cleanup) {
      container.dataset.wordmarkInitialized = "true";
      cleanupWordmarks.add(cleanup);
    }
  }
}

export function destroyAsciiWordmarks(): void {
  for (const cleanup of cleanupWordmarks)
    cleanup();
  cleanupWordmarks.clear();
}
