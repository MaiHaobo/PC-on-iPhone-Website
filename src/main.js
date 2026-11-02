import './styles.css';

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

/* 💡 全站自动注入完美的页脚版权信息 */
function injectCopyright() {
  const footerInner = document.querySelector('.footer-inner');
  if (!footerInner) return;

  // 1. 先把 HTML 里原有的版权信息全部删掉（防止残留或格式不统一）
  const oldLegals = footerInner.querySelectorAll('.footer-legal');
  oldLegals.forEach(el => el.remove());

  const currentYear = new Date().getFullYear();

  // 2. 动态生成包含 UTM 的版权行
  const utmText = document.createElement('p');
  utmText.className = "footer-legal";
  utmText.style.margin = "0 0 4px 0";
  utmText.innerHTML = 'Powered by <a href="https://getutm.app" target="_blank" rel="noopener" style="color: var(--ink-soft); text-decoration: underline;">UTM</a>';

  // 3. 动态生成年份主版权行
  const mainText = document.createElement('p');
  mainText.className = "footer-legal";
  mainText.style.margin = "0";
  mainText.innerHTML = `© ${currentYear} PC on iPhone. All rights reserved.`;

  // 4. 追加到页脚
  footerInner.appendChild(utmText);
  footerInner.appendChild(mainText);
}

function stampCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

// 执行所有初始化函数
initMobileNav();
injectGalleryLink(); 
injectCopyright(); 
stampCurrentYear();