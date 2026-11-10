import './styles.css';

/* ============================================================
   PC on iPhone — site behaviour
   No WebGPU / no liquid-glass dependency: every surface is plain
   CSS frosted glass (backdrop-filter), which is stable in Safari.
   ============================================================ */

function initMobileNav() {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(nav.dataset.open !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-links a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setOpen(false);
  });
}

/* 全站自动注入“系统画廊”导航链接 */
function injectGalleryLink() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  if (navLinks.querySelector('a[href*="gallery.html"]')) return;

  const galleryLink = document.createElement("a");
  galleryLink.href = "./gallery.html";
  galleryLink.textContent = "系统画廊";

  if (window.location.pathname.includes("gallery.html")) {
    galleryLink.setAttribute("aria-current", "page");
  }

  // 插在“下载安装”的后面
  const downloadLink = navLinks.querySelector('a[href*="download.html"]');
  if (downloadLink) {
    downloadLink.after(galleryLink);
  } else {
    navLinks.appendChild(galleryLink);
  }
}

/* 全站自动注入页脚版权信息 */
function injectCopyright() {
  const footerInner = document.querySelector(".footer-inner");
  if (!footerInner) return;

  // 先把 HTML 里原有的版权信息全部删掉（防止残留或格式不统一）
  footerInner.querySelectorAll(".footer-legal").forEach((el) => el.remove());

  const currentYear = new Date().getFullYear();

  const utmText = document.createElement("p");
  utmText.className = "footer-legal";
  utmText.style.margin = "0 0 4px 0";
  utmText.innerHTML =
    'Powered by <a href="https://getutm.app" target="_blank" rel="noopener" style="color: var(--ink-soft); text-decoration: underline;">UTM</a>';

  const mainText = document.createElement("p");
  mainText.className = "footer-legal";
  mainText.style.margin = "0";
  mainText.innerHTML = `© ${currentYear} PC on iPhone. All rights reserved.`;

  footerInner.appendChild(utmText);
  footerInner.appendChild(mainText);
}

function stampCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* Reveal-on-scroll（渐进增强：默认可见，JS 不可用也不会空白） */
function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition =
      "opacity .6s ease, transform .6s cubic-bezier(.2,.7,.3,1)";
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

  // 兜底：万一观察器没触发，2.5s 后强制显示
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

/* 滚动后给导航加投影，让它在内容上方分层 */
function initNavShadow() {
  const wrap = document.querySelector(".site-nav-wrap");
  if (!wrap) return;
  let ticking = false;
  const update = () => {
    wrap.dataset.stuck = window.scrollY > 8 ? "true" : "false";
    ticking = false;
  };
  update();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

initMobileNav();
injectGalleryLink();
injectCopyright();
stampCurrentYear();
initReveal();
initNavShadow();
