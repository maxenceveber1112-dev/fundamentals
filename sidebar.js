// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Sidebar V3
// Approche non-destructive : sidebar fixed + padding-left sur body
// Pages : dashboard.html, plan.html, brique-*.html
// ═══════════════════════════════════════════════════════════════

(function initSidebar() {
  // ── Config par page ───────────────────────────────────────────
  const page = (window.location.pathname.split('/').pop() || 'dashboard.html');
  const isDashboard = page === 'dashboard.html';
  const isPlan      = page === 'plan.html';
  const isBrique    = page.startsWith('brique-');
  const isProfil    = page === 'profil.html';
  const isSimulateur = page.indexOf('simulateur-') === 0;

  // Guard : sidebar uniquement sur les pages post-auth
  // index.html = onboarding pré-auth, auth.html = connexion → pas de sidebar
  if (!isDashboard && !isPlan && !isBrique && !isProfil && !isSimulateur) return;

  // ── Breadcrumb & titre contextuels ───────────────────────────
  function getBreadcrumb() {
    if (isDashboard) return { title: 'Dashboard', crumb: '' };
    if (isPlan)      return { title: 'Mon plan', crumb: '\u00b7\u00a0\u00a0Dashboard\u00a0/\u00a0<b>Mon plan</b>' };
    if (isProfil)    return { title: 'Profil', crumb: '\u00b7\u00a0\u00a0Dashboard\u00a0/\u00a0<b>Profil</b>' };
    if (isSimulateur) { var st = page === 'simulateur-budget.html' ? 'Simulateur de budget' : "Simulateur d'emprunt"; return { title: 'Simulateur', crumb: '\u00b7\u00a0\u00a0Dashboard\u00a0/\u00a0<b>' + st + '</b>' }; }
    if (isBrique) {
      // Priorité 1 : attribut data-brick-name sur le <body>
      const bodyName = document.body.getAttribute('data-brick-name');
      if (bodyName) return { title: bodyName, crumb: '\u00b7\u00a0\u00a0Dashboard\u00a0/\u00a0<b>' + bodyName + '</b>' };
      // Priorité 2 : premier élément avec .brick-title ou .brique-title (pas h1 générique)
      const el = document.querySelector('.brick-title, .brique-title');
      const nom = el ? el.textContent.trim().slice(0, 40) : 'Brique';
      return { title: nom, crumb: '\u00b7\u00a0\u00a0Dashboard\u00a0/\u00a0<b>' + nom + '</b>' };
    }
    return { title: 'Fundamental', crumb: '' };
  }

  function getActiveNav() {
    if (isDashboard) return 'dashboard';
    return '';
  }

  // ── CSS ───────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.id = 'f-sidebar-styles';
  style.textContent = `
    /* ── Body padding pour laisser la place à la sidebar fixe ── */
    body.f-has-sidebar {
      padding-left: 64px !important;
      box-sizing: border-box;
    }

    /* ── Sidebar fixe ── */
    .f-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 64px;
      height: 100dvh;
      background: var(--bg-elevated, #FFFFFF);
      border-right: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      display: flex;
      flex-direction: column;
      z-index: 500;
      transition: width 200ms cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    html.dark .f-sidebar {
      background: var(--bg-elevated, #161824);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .f-sidebar:hover {
      width: 240px;
    }

    /* Logo */
    .f-sidebar-logo {
      height: 64px;
      display: flex; align-items: center;
      padding: 0 20px;
      flex-shrink: 0;
      text-decoration: none;
    }
    .f-sb-mark {
      width: 32px; height: 32px; flex-shrink: 0;
      border-radius: 9px;
      background: #8B93B8;
      border: none;
      display: flex; align-items: center; justify-content: center;
      color: #ffffff;
      font-family: 'Fraunces', serif;
      font-style: italic; font-weight: 500; font-size: 19px;
      line-height: 1;
      box-shadow: 0 4px 14px rgba(90,100,170,.35);
    }
    html.dark .f-sb-mark {
      background: #17172e;
      color: #8F8CD4;
      border: none;
    }
    .f-sb-wordmark {
      margin-left: 12px;
      font-size: 14px; font-weight: 600;
      color: var(--text, #1C1917);
      letter-spacing: -.01em;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 120ms ease 60ms, transform 150ms ease 60ms;
    }
    html.dark .f-sb-wordmark { color: var(--text, #F5F5F4); }
    .f-sidebar:hover .f-sb-wordmark { opacity: 1; transform: translateX(0); }

    /* Nav items */
    .f-sidebar-nav {
      flex: 1;
      display: flex; flex-direction: column;
      padding: 8px 0;
      gap: 2px;
      overflow: hidden;
    }
    .f-sidebar-item {
      position: relative;
      display: flex; align-items: center;
      height: 44px;
      padding: 0 0 0 22px;
      margin: 0 8px;
      border-radius: 10px;
      color: var(--text-muted, #78716C);
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      transition: background .15s ease, color .15s ease;
    }
    .f-sidebar-item:hover {
      background: rgba(28,25,23,.06);
      color: var(--text, #1C1917);
    }
    html.dark .f-sidebar-item:hover {
      background: rgba(255,255,255,.06);
      color: var(--text, #F5F5F4);
    }
    .f-sb-ico {
      flex-shrink: 0; width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .f-sb-label {
      margin-left: 14px;
      font-size: 13.5px; font-weight: 500;
      color: var(--text-secondary, #57534E);
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-6px);
      transition: opacity 120ms ease 60ms, transform 150ms ease 60ms;
    }
    html.dark .f-sb-label { color: var(--text-secondary, #D4D4D8); }
    .f-sidebar:hover .f-sb-label { opacity: 1; transform: translateX(0); }

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
    .f-sidebar-item.active .f-sb-label {
      color: var(--accent-strong, #5B21B6);
    }
    html.dark .f-sidebar-item.active .f-sb-label { color: #C4B5FD; }

    /* New dot */
    .f-sb-newdot {
      position: absolute; top: 10px; left: 36px;
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent-strong, #5B21B6);
    }
    html.dark .f-sb-newdot { background: #A78BFA; }

    /* Bottom avatar */
    .f-sidebar-bottom {
      border-top: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      padding: 10px 0 14px;
      overflow: hidden;
    }
    html.dark .f-sidebar-bottom { border-color: rgba(255,255,255,.08); }

    .f-sb-avatar-row {
      display: flex; align-items: center;
      height: 48px; padding: 0 14px;
      overflow: hidden;
    }
    .f-sb-avatar-circle {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent-soft, rgba(196,181,253,.22));
      border: 1px solid var(--border-subtle, rgba(28,25,23,.07));
      color: var(--accent-strong, #5B21B6);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      flex-shrink: 0;
    }
    html.dark .f-sb-avatar-circle {
      background: linear-gradient(135deg, #8B5CF6, #3B82F6);
      color: #fff;
      border-color: rgba(255,255,255,.08);
    }
    .f-sb-avatar-info {
      margin-left: 10px;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 120ms ease 60ms, transform 150ms ease 60ms;
      white-space: nowrap; overflow: hidden;
      min-width: 0;
    }
    .f-sidebar:hover .f-sb-avatar-info { opacity: 1; transform: translateX(0); }
    .f-sb-avatar-name {
      font-size: 13px; font-weight: 500;
      color: var(--text, #1C1917); line-height: 1.3;
      overflow: hidden; text-overflow: ellipsis;
    }
    html.dark .f-sb-avatar-name { color: var(--text, #F5F5F4); }
    .f-sb-avatar-sub {
      font-size: 11px; color: var(--text-faint, #A8A29E);
    }

    /* ── Ctx-header sticky ── */
    .f-ctx-header {
      position: sticky; top: 0; z-index: 400;
      height: 56px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem;
      background: var(--nav-bg, rgba(250,248,245,.88));
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-subtle, rgba(28,25,23,.07));
    }
    html.dark .f-ctx-header {
      background: var(--nav-bg, rgba(11,11,26,.82));
      border-color: rgba(255,255,255,.08);
    }

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
    html.dark .f-ctx-breadcrumb { color: var(--text-muted, #A1A1AA); }
    .f-ctx-breadcrumb b {
      color: var(--text, #1C1917); font-weight: 500;
    }
    html.dark .f-ctx-breadcrumb b { color: var(--text, #F5F5F4); }

    .f-ctx-right {
      display: flex; align-items: center; gap: 8px;
    }

    /* Theme toggle */
    .f-theme-toggle {
      position: relative;
      width: 44px; height: 24px;
      border-radius: 999px;
      background: #E7E5E4;
      border: 1px solid rgba(28,25,23,.08);
      cursor: pointer;
      transition: background .25s ease, border-color .25s ease;
      flex-shrink: 0;
    }
    html.dark .f-theme-toggle {
      background: rgba(255,255,255,.10);
      border-color: rgba(255,255,255,.12);
    }
    .f-tt-knob {
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #FFF;
      box-shadow: 0 1px 3px rgba(0,0,0,.18);
      transition: transform 200ms cubic-bezier(.4,0,.2,1);
    }
    html.dark .f-tt-knob {
      background: #1C1B33;
      transform: translateX(20px);
    }
    .f-tt-sun {
      position: absolute; left: 5px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted, #78716C); pointer-events: none;
      transition: opacity .25s;
    }
    .f-tt-moon {
      position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
      color: var(--text-faint, #A8A29E); pointer-events: none;
      opacity: .45;
      transition: opacity .25s;
    }
    html.dark .f-tt-sun { opacity: .35; }
    html.dark .f-tt-moon { opacity: 1; color: #C4B5FD; }

    /* Compat tokens pour nav-avatar.js */
    :root {
      --indigo: var(--accent-strong, #5B21B6);
      --violet: var(--accent-strong, #5B21B6);
      --indigo-dim: var(--accent-soft, rgba(196,181,253,.22));
      --indigo-glow: rgba(91,33,182,.15);
    }
    html.dark {
      --indigo: #A78BFA;
      --violet: #A78BFA;
      --indigo-dim: rgba(167,139,250,.14);
      --indigo-glow: rgba(167,139,250,.20);
    }

    /* Masquer l'ancienne nav si elle reste dans le DOM */
    body.f-has-sidebar > nav:not(.f-sidebar-nav),
    body.f-has-sidebar > header:not(.f-ctx-header) {
      display: none !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .f-sidebar { display: none; }
      body.f-has-sidebar { padding-left: 0 !important; }
    }

    /* Fond discret : filigrane "f" + voile de couleur (hors dashboard) */
    .f-bg-fx { position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;
      background:radial-gradient(72vw 58vh at 88% -6%, rgba(139,92,246,0.05), transparent 60%); }
    html.dark .f-bg-fx { background:radial-gradient(72vw 58vh at 88% -6%, rgba(139,92,246,0.12), transparent 60%); }
    .f-bg-fx::after { content:'f'; position:absolute; right:3vw; bottom:-8vh;
      font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-weight:400;
      font-size:60vh; line-height:1; color:rgba(139,147,184,0.05); }
    html.dark .f-bg-fx::after { color:rgba(143,140,212,0.075); }
  `;
  document.head.appendChild(style);

  // ── Sidebar HTML ──────────────────────────────────────────────
  const activeNav = getActiveNav();
  const sidebar = document.createElement('aside');
  sidebar.className = 'f-sidebar';
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Navigation principale');
  sidebar.innerHTML = `
    <a href="dashboard.html" class="f-sidebar-logo" aria-label="Fundamental">
      <div class="f-sb-mark">f</div>
      <span class="f-sb-wordmark">Fundamental</span>
    </a>
    <div class="f-sidebar-nav">
      <a href="dashboard.html" class="f-sidebar-item${activeNav==='dashboard'?' active':''}">
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </span>
        <span class="f-sb-label">Dashboard</span>
      </a>
      <a href="dashboard.html#explorer-section" class="f-sidebar-item" id="f-sidebar-explorer">
        <span class="f-sb-ico" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </span>
        <span class="f-sb-label">Explorer</span>
      </a>
    </div>
    <div class="f-sidebar-bottom">
      <div class="f-sb-avatar-row">
        <div class="f-sb-avatar-circle" id="f-sb-avatar-circle">?</div>
        <div class="f-sb-avatar-info">
          <div class="f-sb-avatar-name" id="f-sb-avatar-name">—</div>
          <div class="f-sb-avatar-sub">Bêta</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(sidebar);

  // ── Ctx-header ────────────────────────────────────────────────
  const { title, crumb } = getBreadcrumb();
  const ctxHeader = document.createElement('div');
  ctxHeader.className = 'f-ctx-header';
  ctxHeader.id = 'f-ctx-header';
  ctxHeader.innerHTML = `
    <div class="f-ctx-left">
      <span class="f-ctx-title">${title}</span>
      ${crumb ? `<span class="f-ctx-breadcrumb">${crumb}</span>` : ''}
    </div>
    <div class="f-ctx-right nav-right" id="nav-right-slot">
      <button class="f-theme-toggle" id="f-theme-toggle" type="button" aria-label="Basculer le thème">
        <svg class="f-tt-sun" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg class="f-tt-moon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <span class="f-tt-knob"></span>
      </button>
    </div>
  `;
  // Insérer le ctx-header comme PREMIER enfant du body (avant tout le reste)
  document.body.insertBefore(ctxHeader, document.body.firstChild);

  // Marquer le body
  document.body.classList.add('f-has-sidebar');

  // Fond discret (filigrane) — pas sur le dashboard (qui a déjà son aurora)
  if (!isDashboard && !document.querySelector('.f-bg-fx')) {
    var fx = document.createElement('div');
    fx.className = 'f-bg-fx';
    fx.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(fx, document.body.firstChild);
  }

  // ── Explorer smooth scroll (si déjà sur dashboard) ────────────
  if (isDashboard) {
    const explorerLink = document.getElementById('f-sidebar-explorer');
    if (explorerLink) {
      explorerLink.addEventListener('click', function(e) {
        var target = document.getElementById('explorer-section');
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // ── Theme toggle ──────────────────────────────────────────────
  const toggleBtn = document.getElementById('f-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('fundamental-theme', isDark ? 'dark' : 'light');
    });
  }

  // ── Avatar fill ───────────────────────────────────────────────
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
      if (nameEl)   nameEl.textContent = email.length > 22 ? email.slice(0, 22) + '\u2026' : email;
    } catch(e) {}
  }
  setTimeout(fillSidebarAvatar, 300);

})();
