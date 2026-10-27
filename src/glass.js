/* ============================================================
   Liquid Glass wiring
   ------------------------------------------------------------
   The material is rendered by @glass-sdk/liquid-glass (WGSL /
   WebGPU). It has no CDN build, so it is bundled by Vite.

   Every `.glass` element keeps a CSS backdrop-filter fallback in
   styles.css. Only when the renderer reports a working scene do we
   flag the surface with [data-glass-active="true"] and let the
   real material take over. On Safari, older browsers, or machines
   without a WebGPU adapter the page still looks intentional.
   ============================================================ */

const GLASS_SELECTOR = ".glass";

/** Feature probe: WebGPU needs a secure context and a live adapter. */
async function hasWebGPU() {
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

/**
 * Boot the glass scene for the current page.
 * `root` is the element that holds the page background the glass
 * should refract (the <main> wrapper), so one scene per document.
 */
export async function bootGlass(root = document.body) {
  const surfaces = root.querySelectorAll(GLASS_SELECTOR);
  if (!surfaces.length) return;

  if (!(await hasWebGPU())) {
    markUnsupported("当前浏览器未提供 WebGPU，已启用毛玻璃降级材质");
    return;
  }

  let controller;
  try {
    const { createGlassScene } = await import("@glass-sdk/liquid-glass/dom");
    await import("@glass-sdk/liquid-glass/styles.css");

    controller = createGlassScene(root, {
      onDiagnostic(diagnostic) {
        if (diagnostic.error) {
          console.warn("[glass] diagnostic", diagnostic.error);
          markUnsupported("玻璃渲染器初始化失败，已启用降级材质");
        }
      },
    });

    surfaces.forEach((surface) => {
      const isInteractive =
        surface.hasAttribute("data-glass-interactive") ||
        surface.tagName === "BUTTON" ||
        surface.tagName === "A";

      controller.addSurface(surface, {
        material: surface.dataset.glassMaterial || "regular",
        appearance: "dark",
        interactive: isInteractive,
        fluid: true,
      });

      surface.dataset.glassActive = "true";
    });

    document.documentElement.dataset.glass = "active";
  } catch (error) {
    console.warn("[glass] renderer unavailable, using fallback material", error);
    markUnsupported("玻璃渲染器不可用，已启用毛玻璃降级材质");
    controller?.dispose();
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

  // Safety net: if nothing reveals within 2.5s (printing, odd embeds,
  // observers that never fire), show everything rather than hide content.
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
