/* Shared entry: boots the glass scene, mobile nav, and reveal animations. */

import "./styles.css";
import { bootGlass, initReveal } from "./glass.js";

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

initMobileNav();
stampCurrentYear();
initReveal();

// Let the first paint happen before allocating GPU resources.
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => bootGlass(), { timeout: 1200 });
} else {
  window.addEventListener("load", () => bootGlass(), { once: true });
}
