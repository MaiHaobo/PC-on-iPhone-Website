/* ============================================================
   Liquid Glass wiring — official DOM structure
   ------------------------------------------------------------
   Follows the library's documented "Without React" pattern:
   a bounded scene root (.lg-scene), a scrolling content layer
   (.lg-content[data-layout=scroll]) that the glass refracts,
   and surfaces that are real content-bearing elements (nav pill)
   registered with addSurface().
   ============================================================ */

const GLASS_SELECTOR = ".glass";

/* Safari/WebKit renders the GPU glass path with broken geometry on iOS:
   the nav text gets refracted into ghosts and a misplaced glass sheet
   covers the page while scrolling. The frosted CSS fallback is stable
   and visually close, so WebKit deliberately uses it. */
function isWebKit() {
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrom|Chromium|Edg|OPR|Firefox/i.test(ua);
}

async function hasWebGPU() {
  if (isWebKit()) return false;
  if (!("gpu" in navigator)) return false;
  if (!window.isSecureContext && location.hostname !== "localhost") return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}

function markUnsupported(reason) {
  document.documentElement.dataset.glass = "fallback";
  const note = document.querySelector("[data-glass-note]");
  if (note) {
    note.textContent = reason;
    note.dataset.visible = "true";
  }
}

let controller;

/* Appearance follows the page background: white page → light glass,
   black page (dark mode) → dark glass. */
function currentAppearance() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Tear the scene down and boot it again: the lens geometry and the
 *  prepared material maps are re-derived from the live DOM, which
 *  re-syncs the glass with the nav after viewport/zoom changes. */
export async function rebuildGlass() {
  const navPill = document.querySelector(".site-nav");
  controller?.dispose();
  controller = undefined;
  if (navPill) {
    navPill.classList.remove("lg-surface");
    delete navPill.dataset.glassActive;
  }
  await bootGlass();
}

/* Debounced re-sync: iOS Safari's toolbars collapsing, rotating the
   device, or browser zoom can shift the geometry the lens was built
   from faster than the scene re-measures it. */
let resyncTimer;
function scheduleResync() {
  if (!controller) return;
  clearTimeout(resyncTimer);
  resyncTimer = setTimeout(() => {
    rebuildGlass().catch(() => {});
  }, 250);
}

export function initGlassResync() {
  window.addEventListener("resize", scheduleResync);
  window.addEventListener("orientationchange", scheduleResync);
  window.visualViewport?.addEventListener("resize", scheduleResync);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) scheduleResync(); // bfcache restore
  });
}

export async function bootGlass() {
  if (controller) return;
  const scene = document.querySelector(".glass-scene");
  const content = document.querySelector(".glass-content");
  const navPill = document.querySelector(".site-nav");
  if (!scene || !content || !navPill) return;

  // Elements that live inside the scrolling content cannot be refracted
  // by the same scene; they keep the CSS material.
  content.querySelectorAll(GLASS_SELECTOR).forEach((el) => {
    el.dataset.glassInner = "true";
  });

  if (!(await hasWebGPU())) {
    markUnsupported(
      isWebKit()
        ? "iPhone Safari 暂用毛玻璃材质（更稳定）"
        : "当前浏览器未提供 WebGPU，已启用毛玻璃降级材质"
    );
    return;
  }

  let newController;
  try {
    const { createGlassScene, attachGeometryMotion } = await import(
      "@glass-sdk/liquid-glass/dom"
    );
    await import("@glass-sdk/liquid-glass/styles.css");

    const appearance = currentAppearance();

    newController = createGlassScene(scene, {
      maxSurfaces: 8,
      onDiagnostic(diagnostic) {
        if (diagnostic.error) {
          console.warn("[glass] diagnostic", diagnostic.error);
          markUnsupported("玻璃渲染器初始化失败，已启用降级材质");
        }
      },
    });

    newController.setContent(content);

    // The nav pill IS the surface: its content renders above the glass
    // layer the library inserts inside it.
    navPill.classList.add("lg-surface");

    // React components wire geometry via this hook; without it the
    // surface never produces a LensFrame and the glass is not painted.
    const animator = attachGeometryMotion(navPill, {
      radius: "capsule",
      layout: true,
      motion: () => "full",
    });
    newController.addAnimator(animator);

    newController.addSurface(navPill, {
      material: "regular",
      appearance,
      interactive: true,
      fluid: true,
      radius: "capsule",
    });
    navPill.dataset.glassActive = "true";
    document.documentElement.dataset.glass = "active";
  } catch (error) {
    console.warn("[glass] renderer unavailable, using fallback material", error);
    markUnsupported("玻璃渲染器不可用，已启用毛玻璃降级材质");
    navPill.classList.remove("lg-surface");
    newController?.dispose();
  }
}

/* ------------------------------------------------------------
   Reveal-on-scroll (progressive; content is visible by default)
   ------------------------------------------------------------ */

export function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .6s ease, transform .6s cubic-bezier(.2,.7,.3,1)";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => observer.observe(el));

  setTimeout(() => {
    targets.forEach((el) => {
      if (el.style.opacity === "0") {
        el.style.opacity = "1";
        el.style.transform = "none";
        observer.unobserve(el);
      }
    });
  }, 2500);
}
