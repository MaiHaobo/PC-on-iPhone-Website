import './styles.css';
import { bootGlass, initGlassResync, initReveal } from './glass.js';

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

/* 💡 全站自动注入“系统画廊”导航链接 */
function injectGalleryLink() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  if (navLinks.querySelector('a[href*="gallery.html"]')) return;

  const galleryLink = document.createElement('a');
  galleryLink.href = './gallery.html';
  galleryLink.textContent = '系统画廊';

  if (window.location.pathname.includes('gallery.html')) {
    galleryLink.setAttribute('aria-current', 'page');
  }

  // 插在“下载安装”的后面
  const downloadLink = navLinks.querySelector('a[href*="download.html"]');
  if (downloadLink) {
    downloadLink.after(galleryLink);
  } else {
    navLinks.appendChild(galleryLink);
  }
}

/* 💡 全站自动注入页脚版权信息 */
function injectCopyright() {
  const footerInner = document.querySelector('.footer-inner');
  if (!footerInner) return;

  // 先把 HTML 里原有的版权信息全部删掉（防止残留或格式不统一）
  footerInner.querySelectorAll('.footer-legal').forEach((el) => el.remove());

  const currentYear = new Date().getFullYear();

  const utmText = document.createElement('p');
  utmText.className = "footer-legal";
  utmText.style.margin = "0 0 4px 0";
  utmText.innerHTML = 'Powered by <a href="https://getutm.app" target="_blank" rel="noopener" style="color: var(--ink-soft); text-decoration: underline;">UTM</a>';

  const mainText = document.createElement('p');
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

/* 独立页（如 experience.html）没有导航/页脚，跳过玻璃场景 */
const hasScene = Boolean(document.querySelector('.glass-scene'));

initMobileNav();
injectGalleryLink();
injectCopyright();
stampCurrentYear();

if (hasScene) {
  initReveal();
  initGlassResync();

  // Let the first paint happen before allocating GPU resources.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => bootGlass(), { timeout: 1200 });
  } else {
    window.addEventListener("load", () => bootGlass(), { once: true });
  }
}
