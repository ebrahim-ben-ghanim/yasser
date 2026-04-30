/**
 * auth.js — Authentication, Nav & Mobile Menu
 * يعتمد على data.js (يجب تحميله أولاً)
 */

function getRootPath() {
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function requireLogin() {
  if (!getSession()) { window.location.href = getRootPath() + 'pages/auth.html'; return false; }
  return true;
}

function requireAdmin() {
  const s = getSession();
  if (!s || s.type !== 'admin') { window.location.href = getRootPath() + 'index.html'; return false; }
  return true;
}

function logout() {
  clearSession();
  window.location.href = getRootPath() + 'index.html';
}

/* ── Nav links array (reused for desktop + mobile) ── */
function getNavLinks() {
  const ROOT = getRootPath();
  const s = getSession();
  if (s && s.type === 'admin') {
    return [
      { label: 'لوحة الإدارة', href: ROOT + 'pages/admin.html' },
      { label: 'المكتبة',       href: ROOT + 'pages/library.html' },
      { label: 'تسجيل الخروج', href: '#', onclick: 'logout()' },
    ];
  } else if (s) {
    return [
      { label: 'لوحتي',          href: ROOT + 'pages/dashboard.html' },
      { label: 'المكتبة',        href: ROOT + 'pages/library.html' },
      { label: 'تسجيل الخروج',  href: '#', onclick: 'logout()' },
    ];
  } else {
    return [
      { label: 'الرئيسية',         href: ROOT + 'index.html' },
      { label: 'المكتبة',          href: ROOT + 'pages/library.html' },
      { label: 'تسجيل الدخول',    href: ROOT + 'pages/auth.html' },
      { label: 'إنشاء حساب',      href: ROOT + 'pages/auth.html', gold: true },
    ];
  }
}

/* ── Desktop nav ── */
function renderNav() {
  const nav = document.getElementById('navBtns');
  if (!nav) return;
  const s = getSession();

  let html = '';
  if (s) html += `<span class="nav-user">مرحباً، ${s.name}</span>`;
  if (s && s.type === 'admin') html += `<span class="badge badge-admin" style="margin-left:4px">مدير</span>`;

  getNavLinks().forEach(l => {
    const cls = l.gold ? 'nav-btn gold' : 'nav-btn';
    const onclick = l.onclick ? `onclick="${l.onclick}"` : '';
    html += `<a class="${cls}" href="${l.href}" ${onclick}>${l.label}</a>`;
  });

  nav.innerHTML = html;
}

/* ── Mobile menu ── */
function renderMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const s = getSession();

  let html = '';
  if (s) {
    html += `<div class="mobile-user">
      <div class="user-avatar" style="width:32px;height:32px;font-size:13px">${s.name.charAt(0)}</div>
      <span>${s.name}</span>
      ${s.type === 'admin' ? '<span class="badge badge-admin">مدير</span>' : ''}
    </div>`;
  }

  getNavLinks().forEach(l => {
    const onclick = l.onclick ? `onclick="${l.onclick}"` : '';
    html += `<a class="mobile-nav-item ${l.gold ? 'gold' : ''}" href="${l.href}" ${onclick}>${l.label}</a>`;
  });

  menu.innerHTML = html;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburgerBtn');
  if (!menu) return;
  const isOpen = !menu.classList.contains('hidden');
  menu.classList.toggle('hidden', isOpen);
  btn.classList.toggle('open', !isOpen);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburgerBtn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add('hidden');
    btn.classList.remove('open');
  }
});

/* ── Alerts & Notices ── */
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';
  setTimeout(() => { if (el) el.style.display = 'none'; }, 3500);
}

function showCopyNotice(msg) {
  let n = document.getElementById('copyNotice');
  if (!n) {
    n = document.createElement('div');
    n.id = 'copyNotice';
    n.className = 'copy-notice';
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 3000);
}
