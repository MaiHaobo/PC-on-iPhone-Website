import './style.css';

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

/* 💡 全站自动注入“系统画廊”导航链接 */
function injectGalleryLink() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // 如果已经存在了，就不重复添加
  if (navLinks.querySelector('a[href*="gallery.html"]')) return;

  // 创建新的链接元素
  const galleryLink = document.createElement('a');
  galleryLink.href = './gallery.html';
  galleryLink.textContent = '系统画廊';

  // 如果当前正在画廊页面，就加上 aria-current 属性让它高亮
  if (window.location.pathname.includes('gallery.html')) {
    galleryLink.setAttribute('aria-current', 'page');
  }

  // 💡 修改这里：寻找“下载安装”的链接，并插在它后面
  const downloadLink = navLinks.querySelector('a[href*="download.html"]');
  if (downloadLink) {
    downloadLink.after(galleryLink);
  } else {
    navLinks.appendChild(galleryLink);
  }
}

function stampCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

// 执行所有初始化函数
initMobileNav();
injectGalleryLink(); 
stampCurrentYear();