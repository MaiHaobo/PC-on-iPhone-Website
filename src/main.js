/* Shared entry: boots the mobile nav, year, reveal animations, and UTM copyright. */

import "./styles.css";
import { initReveal } from "./glass.js";

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

  // Close when a link is tapped or focus leaves the menu.
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

function stampCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* 💡 新增：全自动注入 UTM 版权信息 */
function injectUTMCopyright() {
  const footerLegal = document.querySelector(".footer-legal");
  if (!footerLegal) return;

  // 防止重复添加
  if (document.body.innerHTML.includes("Powered by UTM")) return;

  const p = document.createElement("p");
  p.className = "footer-legal";
  p.style.margin = "0 0 4px 0";
  p.innerHTML = 'Powered by <a href="https://getutm.app" target="_blank" rel="noopener" style="color: var(--ink-soft); text-decoration: underline;">UTM</a>';
  
  // 插入到现有的版权年份信息上方
  footerLegal.parentNode.insertBefore(p, footerLegal);
}

// 初始化函数
initMobileNav();
stampCurrentYear();
injectUTMCopyright(); // 执行注入
initReveal();

// 注释掉了之前启动 GPU 渲染的代码
// initGlassResync();
// if ("requestIdleCallback" in window) { ... }