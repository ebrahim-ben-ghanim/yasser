/**
 * auth.js — Authentication & Nav helpers
 * يعتمد على data.js (يجب تحميله أولاً)
 */

function renderNav() {
  const nav = document.getElementById('navBtns');
  if (!nav) return;
  const s = getSession();
  const ROOT = getRootPath();

  if (s) {
    if (s.type === 'admin') {
      nav.innerHTML = `
        <span class="nav-user">مرحباً، ${s.name}</span>
        <span class="badge badge-admin">مدير</span>
        <a class="nav-btn" href="${ROOT}pages/admin.html">لوحة الإدارة</a>
        <a class="nav-btn" href="${ROOT}pages/library.html">المكتبة</a>
        <button class="nav-btn" onclick="logout()">خروج</button>`;
    } else {
      nav.innerHTML = `
        <span class="nav-user">مرحباً، ${s.name}</span>
        <a class="nav-btn" href="${ROOT}pages/dashboard.html">لوحتي</a>
        <a class="nav-btn" href="${ROOT}pages/library.html">المكتبة</a>
        <button class="nav-btn" onclick="logout()">خروج</button>`;
    }
  } else {
    nav.innerHTML = `
      <a class="nav-btn" href="${ROOT}index.html">الرئيسية</a>
      <a class="nav-btn" href="${ROOT}pages/library.html">المكتبة</a>
      <a class="nav-btn" href="${ROOT}pages/auth.html">تسجيل الدخول</a>
      <a class="nav-btn gold" href="${ROOT}pages/auth.html">إنشاء حساب</a>`;
  }
}

function logout() {
  clearSession();
  window.location.href = getRootPath() + 'index.html';
}

/** يحدد المسار النسبي لجذر المشروع بناءً على موقع الصفحة الحالية */
function getRootPath() {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '../' : './';
}

function requireLogin() {
  if (!getSession()) {
    window.location.href = getRootPath() + 'pages/auth.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  const s = getSession();
  if (!s || s.type !== 'admin') {
    window.location.href = getRootPath() + 'index.html';
    return false;
  }
  return true;
}

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
  if (!n) { n = document.createElement('div'); n.id = 'copyNotice'; n.className = 'copy-notice'; document.body.appendChild(n); }
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 3000);
}
