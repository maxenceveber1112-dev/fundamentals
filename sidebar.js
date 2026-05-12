// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Sidebar V3
// Composant partagé : sidebar 64px→240px hover + ctx-header
// Pages : dashboard.html, plan.html, brique-*.html
// Spec : sidebar.js injecte CSS + HTML, breadcrumb configurable
// Toggle dark/light reste en haut à droite (dans ctx-header)
// ═══════════════════════════════════════════════════════════════

(function initSidebar() {
  // ── Config par page ───────────────────────────────────────────
  const page = (window.location.pathname.split('/').pop() || 'dashboard.html');
  const isDashboard = page === 'dashboard.html';
  const isPlan      = page === 'plan.html';
  const isBrique    = page.startsWith('brique-');

  // Breadcrumb & titre contextuels
  function getBreadcrumb() {
    if (isDashboard) return { title: 'Dashboard', crumb: '' };
    if (isPlan)      return { title: 'Mon plan', crumb: '·\u00a0\u00a0Dashboard\u00a0/\u00a0<b>Mon plan</b>' };
    if (isBrique) {
      // Récupère le nom de la brique depuis le <title> ou h1
      const titleEl = document.querySelector('h1.brique-title, .brique-name');
      const pageName = titleEl ? titleEl.textContent.trim() : 'Brique';
      return { title: pageName, crumb: '·\u00a0\u00a0Mon plan\u00a0/\u00a0<b>' + pageName + '</b>' };
    }
    return { title: 'Fundamental', crumb: '' };
  }

  // Active state par page
  function getActiveNav() {
    if (isDashboard) return 'dashboard';
    if (isPlan || isBrique) return 'plan';
    return '';
  }

  // ── CSS injection ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── Sidebar shell ── */
    html, body { margin: 0; padding: 0; height: 100%; }
    body { overflow-x: hidden; }

    .f-sidebar-shell {
      display: flex;
      min-height: 100dvh;
      position: relative;
    }

    /* ── Sidebar ── */
    .f-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 64px;
      height: 100%;
      background: var(--bg-elevated, #FFFFFF);
      border-right: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      display: flex;
      flex-direction: column;
      align-items: stretch;
      z-index: 200;
      transition: width 200ms cubic-bezier(.4,0,.2,1);
      overflow: hidden;
      flex-shrink: 0;
    }
    html.dark .f-sidebar {
      background: var(--bg-elevated, #161824);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .f-sidebar:hover { width: 240px; }

    /* Logo */
    .f-sidebar-logo {
      height: 64px;
      display: flex; align-items: center;
      padding: 0 20px;
      flex-shrink: 0;
      text-decoration: none;
    }
    .f-sidebar-logo .f-sb-mark {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: var(--accent-soft, rgba(196,181,253,.22));
      border: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      display: flex; align-items: center; justify-content: center;
      color: var(--accent-strong, #5B21B6);
      font-family: 'Fraunces', serif;
      font-style: italic; font-weight: 500; font-size: 18px;
      flex-shrink: 0;
      line-height: 1;
    }
    html.dark .f-sidebar-logo .f-sb-mark {
      background: rgba(167,139,250,.14);
      color: #C4B5FD;
    }
    .f-sidebar-logo .f-sb-wordmark {
      margin-left: 12px;
      font-size: 14px; font-weight: 600;
      color: var(--text, #1C1917);
      letter-spacing: -.01em;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-6px);
      transition: opacity 100ms ease 80ms, transform 150ms ease 80ms;
    }
    .f-sidebar:hover .f-sidebar-logo .f-sb-wordmark { opacity: 1; transform: translateX(0); }

    /* Nav items */
    .f-sidebar-nav {
      flex: 1;
      display: flex; flex-direction: column;
      padding: 12px 0;
      gap: 2px;
    }
    .f-sidebar-item {
      position: relative;
      display: flex; align-items: center;
      height: 44px;
      padding: 0 22px;
      margin: 0 8px;
      border-radius: 10px;
      color: var(--text-muted, #78716C);
      cursor: pointer;
      text-decoration: none;
      transition: background .15s ease, color .15s ease;
    }
    .f-sidebar-item:hover {
      background: var(--border-subtle, rgba(28,25,23,.07));
      color: var(--text, #1C1917);
    }
    html.dark .f-sidebar-item:hover {
      background: rgba(255,255,255,.06);
      color: var(--text, #F5F5F4);
    }
    .f-sidebar-item .f-sb-ico {
      flex-shrink: 0; width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .f-sidebar-item .f-sb-label {
      margin-left: 14px;
      font-size: 13.5px; font-weight: 500;
      color: var(--text-secondary, #57534E);
      white-space: nowrap;
      opacity: 0; transform: translateX(-6px);
      transition: opacity 100ms ease 80ms, transform 150ms ease 80ms;
    }
    html.dark .f-sidebar-item .f-sb-label { color: var(--text-secondary, #D4D4D8); }
    .f-sidebar:hover .f-sidebar-item .f-sb-label { opacity: 1; transform: translateX(0); }

    .f-sidebar-item.active {
      background: var(--accent-soft, rgba(196,181,253,.22));
      color: var(--accent-strong, #5B21B6);
    }
    html.dark .f-sidebar-item.active {
      background: rgba(167,139,250,.14);
      color: #C4B5FD;
    }
    .f-sidebar-item.active::before {
      content: '';
      position: absolute; left: -8px; top: 8px; bottom: 8px;
      width: 2px;
      background: var(--accent-strong, #5B21B6);
      border-radius: 0 2px 2px 0;
    }
    html.dark .f-sidebar-item.active::before { background: #A78BFA; }
    .f-sidebar-item.active .f-sb-label { color: var(--accent-strong, #5B21B6); }
    html.dark .f-sidebar-item.active .f-sb-label { color: #C4B5FD; }

    /* New dot */
    .f-sb-newdot {
      position: absolute; top: 10px; left: 36px;
      width: 6px; height: 6px; border-radius: 999px;
      background: var(--accent-strong, #5B21B6);
    }
    html.dark .f-sb-newdot { background: #A78BFA; }

    /* Bottom */
    .f-sidebar-bottom {
      border-top: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      padding: 12px 0 16px;
    }
    .f-sidebar-avatar-row {
      display: flex; align-items: center;
      height: 52px; padding: 0 14px;
    }
    .f-sidebar-avatar-circle {
      width: 36px; height: 36px; border-radius: 999px;
      background: var(--accent-soft, rgba(196,181,253,.22));
      border: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      color: var(--accent-strong, #5B21B6);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      flex-shrink: 0; letter-spacing: 0;
    }
    html.dark .f-sidebar-avatar-circle {
      background: linear-gradient(135deg, #8B5CF6, #3B82F6);
      color: #fff;
    }
    .f-sidebar-avatar-info {
      margin-left: 10px;
      opacity: 0;
      transform: translateX(-6px);
      transition: opacity 100ms ease 80ms, transform 150ms ease 80ms;
      white-space: nowrap;
      overflow: hidden;
    }
    .f-sidebar:hover .f-sidebar-avatar-info { opacity: 1; transform: translateX(0); }
    .f-sidebar-avatar-name {
      font-size: 13px; font-weight: 500;
      color: var(--text, #1C1917); line-height: 1.3;
    }
    html.dark .f-sidebar-avatar-name { color: var(--text, #F5F5F4); }
    .f-sidebar-avatar-sub {
      font-size: 11px; color: var(--text-faint, #A8A29E);
    }

    /* ── Content zone ── */
    .f-content {
      margin-left: 64px;
      width: calc(100% - 64px);
      min-height: 100dvh;
      display: flex; flex-direction: column;
      position: relative;
    }

    /* ── Ctx-header ── */
    .f-ctx-header {
      position: sticky; top: 0; z-index: 100;
      height: 56px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem;
      background: var(--nav-bg, rgba(250,248,245,.88));
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      flex-shrink: 0;
    }
    html.dark .f-ctx-header { background: var(--nav-bg, rgba(11,11,26,.82)); }

    .f-ctx-left { display: flex; align-items: center; gap: 8px; }
    .f-ctx-title {
      font-size: 14px; font-weight: 600;
      color: var(--text, #1C1917); letter-spacing: -.01em;
    }
    html.dark .f-ctx-title { color: var(--text, #F5F5F4); }
    .f-ctx-breadcrumb {
      font-size: 12.5px;
      color: var(--text-muted, #78716C);
    }
    .f-ctx-breadcrumb b {
      color: var(--text, #1C1917); font-weight: 500;
    }
    html.dark .f-ctx-breadcrumb { color: var(--text-muted, #A1A1AA); }
    html.dark .f-ctx-breadcrumb b { color: var(--text, #F5F5F4); }

    .f-ctx-right { display: flex; align-items: center; gap: 8px; }

    /* Theme toggle pill */
    .f-theme-toggle {
      position: relative;
      width: 44px; height: 24px;
      border-radius: 999px;
      background: var(--track, #E7E5E4);
      border: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      cursor: pointer;
      transition: background .25s ease, border-color .25s ease;
      flex-shrink: 0;
    }
    html.dark .f-theme-toggle {
      background: rgba(255,255,255,.10);
      border-color: rgba(255,255,255,.12);
    }
    .f-theme-toggle .f-tt-knob {
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 999px;
      background: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0,0,0,.18);
      transition: transform 200ms cubic-bezier(.4,0,.2,1), background .25s ease;
    }
    html.dark .f-theme-toggle .f-tt-knob {
      background: #1C1B33;
      transform: translateX(20px);
      box-shadow: 0 1px 3px rgba(0,0,0,.5);
    }
    .f-theme-toggle .f-tt-sun {
      position: absolute; left: 5px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted, #78716C);
      pointer-events: none;
      transition: opacity .25s ease;
    }
    .f-theme-toggle .f-tt-moon {
      position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
      color: var(--text-faint, #A8A29E);
      pointer-events: none;
      opacity: .5;
      transition: opacity .25s ease;
    }
    html.dark .f-theme-toggle .f-tt-sun { opacity: .4; }
    html.dark .f-theme-toggle .f-tt-moon { opacity: 1; color: #C4B5FD; }

    /* Responsive */
    @media(max-width: 768px) {
      .f-sidebar { display: none; }
      .f-content { margin-left: 0; width: 100%; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML injection ────────────────────────────────────────────
  // Wrap body content in shell structure
  const body = document.body;
  const { title, crumb } = getBreadcrumb();
  const activeNav = getActiveNav();

  // Create sidebar HTML
  const sidebar = document.createElement('aside');
  sidebar.className = 'f-sidebar';
  sidebar.setAttribute('aria-label', 'Navigation principale');
  sidebar.innerHTML = `
    <a href="dashboard.html" class="f-sidebar-logo" aria-label="Fundamental — Accueil">
      <div class="f-sb-mark">f</div>
      <span class="f-sb-wordmark">Fundamental</span>
    </a>
    <nav class="f-sidebar-nav" aria-label="Menu principal">
      <a href="dashboard.html" class="f-sidebar-item${activeNav==='dashboard'?' active':''}" aria-current="${activeNav==='dashboard'?'page':'false'}">
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </span>
        <span class="f-sb-label">Dashboard</span>
      </a>
      <a href="plan.html" class="f-sidebar-item${activeNav==='plan'?' active':''}" aria-current="${activeNav==='plan'?'page':'false'}">
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </span>
        <span class="f-sb-label">Mon plan</span>
      </a>
      <a href="#" class="f-sidebar-item" aria-label="Explorer (bientôt disponible)">
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </span>
        <span class="f-sb-label">Explorer</span>
      </a>
      <a href="#" class="f-sidebar-item" aria-label="Objectifs (bientôt disponible)">
        <span class="f-sb-newdot" aria-hidden="true"></span>
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
        </span>
        <span class="f-sb-label">Objectifs</span>
      </a>
    </nav>
    <div class="f-sidebar-bottom">
      <div class="f-sidebar-avatar-row" id="f-sb-avatar-row">
        <div class="f-sidebar-avatar-circle" id="f-sb-avatar-circle">?</div>
        <div class="f-sidebar-avatar-info" id="f-sb-avatar-info">
          <div class="f-sidebar-avatar-name" id="f-sb-avatar-name">—</div>
          <div class="f-sidebar-avatar-sub">Bêta</div>
        </div>
      </div>
    </div>
  `;

  // Create content zone
  const contentZone = document.createElement('div');
  contentZone.className = 'f-content';

  // Create ctx-header
  const ctxHeader = document.createElement('header');
  ctxHeader.className = 'f-ctx-header';
  ctxHeader.id = 'f-ctx-header';
  ctxHeader.innerHTML = `
    <div class="f-ctx-left">
      <span class="f-ctx-title">${title}</span>
      ${crumb ? `<span class="f-ctx-breadcrumb">${crumb}</span>` : ''}
    </div>
    <div class="f-ctx-right" id="f-ctx-right">
      <button class="f-theme-toggle" id="f-theme-toggle" type="button" aria-label="Basculer le thème">
        <svg class="f-tt-sun" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg class="f-tt-moon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <span class="f-tt-knob"></span>
      </button>
      <!-- Avatar injecté par nav-avatar.js via #f-ctx-right -->
    </div>
  `;

  // ── DOM restructure ───────────────────────────────────────────
  // Move all existing body children into contentZone (except our sidebar)
  const existingChildren = Array.from(body.children);
  existingChildren.forEach(el => contentZone.appendChild(el));

  // Prepend ctx-header inside contentZone
  contentZone.insertBefore(ctxHeader, contentZone.firstChild);

  // Build shell
  const shell = document.createElement('div');
  shell.className = 'f-sidebar-shell';
  shell.appendChild(sidebar);
  shell.appendChild(contentZone);
  body.appendChild(shell);

  // ── Theme toggle logic ────────────────────────────────────────
  const toggleBtn = document.getElementById('f-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('fundamental-theme', isDark ? 'dark' : 'light');
    });
  }

  // ── Avatar fill (async, after user loaded) ────────────────────
  // nav-avatar.js also runs — we just need to fill the sidebar avatar
  // We do it lazily after getCurrentUser() resolves (shared.js)
  async function fillSidebarAvatar() {
    try {
      if (typeof getCurrentUser !== 'function') return;
      const user = await getCurrentUser();
      if (!user) return;
      const email = user.email || '';
      const initials = email.slice(0, 2).toUpperCase() || 'U';
      const avatarEl = document.getElementById('f-sb-avatar-circle');
      const nameEl   = document.getElementById('f-sb-avatar-name');
      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl)   nameEl.textContent = email.length > 22 ? email.slice(0, 22) + '…' : email;
    } catch(e) {}
  }
  // Wait for DOM + scripts to be ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fillSidebarAvatar, 200);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(fillSidebarAvatar, 200));
  }

  // ── Patch nav-avatar.js injection point ──────────────────────
  // nav-avatar.js looks for .nav-right or #nav-right-slot
  // We expose the ctx-header right zone as that slot
  const ctxRight = document.getElementById('f-ctx-right');
  if (ctxRight) {
    ctxRight.classList.add('nav-right');
    ctxRight.id = 'nav-right-slot';
  }

  // ── Compat tokens for nav-avatar.js styles ───────────────────
  // nav-avatar.js uses --indigo, --violet, --indigo-dim, --indigo-glow
  // These only exist in brique CSS; add fallbacks for dashboard/plan pages
  const compatStyle = document.createElement('style');
  compatStyle.textContent = `
    :root {
      --indigo: var(--accent-strong, #5B21B6);
      --violet: var(--accent-strong, #5B21B6);
      --indigo-dim: var(--accent-soft, rgba(196,181,253,.22));
      --indigo-glow: rgba(91,33,182,.15);
      --surface-2: var(--surface-2, #F5F5F4);
      --surface-3: var(--surface-3, #EDEBE8);
      --border: var(--border-subtle, rgba(28,25,23,.07));
    }
    html.dark {
      --indigo: var(--accent-strong, #A78BFA);
      --violet: var(--accent-strong, #A78BFA);
      --indigo-dim: var(--accent-soft, rgba(167,139,250,.14));
      --indigo-glow: rgba(167,139,250,.20);
    }
  `;
  document.head.appendChild(compatStyle);

})();
