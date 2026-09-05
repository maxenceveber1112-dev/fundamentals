// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Sidebar V3
// Approche non-destructive : sidebar fixed + padding-left sur body
// Pages : dashboard.html, plan.html, brique-*.html
// ═══════════════════════════════════════════════════════════════

(function initSidebar() {
  // ── Config par page ───────────────────────────────────────────
  // Netlify sert aussi les URL propres (/dashboard, sans extension). Toutes
  // les comparaisons ci-dessous attendent le nom complet : on renormalise
  // une fois ici plutot que de les reecrire une par une.
  const _fichier = (window.location.pathname.split('/').pop() || 'dashboard');
  const page = _fichier.indexOf('.') === -1 ? _fichier + '.html' : _fichier;
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
    return { title: 'Fundamentals', crumb: '' };
  }

  function getActiveNav() {
    if (isDashboard) return 'dashboard';
    if (isBrique) return 'dashboard';
    if (isSimulateur) return 'explorer';
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

    /* Invitation (mode anonyme) */
    .f-sb-invite { padding: 10px 14px 4px; }
    .f-sb-invite-txt { font-size: 11.5px; line-height: 1.45;
      color: var(--text-muted, #78716C); white-space: normal; }
    html.dark .f-sb-invite-txt { color: var(--text-muted, #A1A1AA); }
    .f-sb-invite-cta { display: inline-block; margin-top: 7px; font-size: 12px;
      font-weight: 600; color: var(--accent-strong, #5B21B6); text-decoration: none;
      white-space: nowrap; }
    html.dark .f-sb-invite-cta { color: #A78BFA; }
    .f-sb-invite-cta:hover { text-decoration: underline; }
    /* Replie (rail 64px) : on n'affiche qu'une icone discrete */
    .f-sb-invite-mini { display: flex; align-items: center; justify-content: center;
      height: 40px; color: var(--text-muted, #78716C); }
    .f-sidebar:hover .f-sb-invite-mini { display: none; }
    .f-sb-invite { display: none; }
    .f-sidebar:hover .f-sb-invite { display: block; }
    @media (max-width: 768px) {
      .f-sb-invite { display: block !important; }
      .f-sb-invite-mini { display: none !important; }
    }

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
    /* Ce composant declarait ici --indigo, --violet, --indigo-dim et
       --indigo-glow, que theme.css possede deja. Un script de barre
       laterale n'a pas a redefinir des jetons globaux : injecte a
       l'execution, il l'emportait silencieusement sur la feuille de
       theme, et le seul moyen de s'en apercevoir etait de lire les
       valeurs calculees sur la page rendue.
       Mesure avant suppression : le bloc ne prenait effet que sur les
       deux simulateurs, qui ne lisent aucun de ces quatre jetons. */

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

    /* ── Bouton menu (mobile uniquement) ── */
    .f-nav-toggle { display: none; align-items: center; justify-content: center;
      width: 34px; height: 34px; margin-right: 4px; flex: 0 0 auto;
      border: 1px solid var(--border-subtle, rgba(28,25,23,.10)); border-radius: 10px;
      background: var(--surface-2, #fff); color: var(--text, #1C1917); cursor: pointer; padding: 0; }
    html.dark .f-nav-toggle { background: rgba(255,255,255,.06); color: var(--text, #F5F5F4);
      border-color: rgba(255,255,255,.12); }
    .f-nav-backdrop { position: fixed; inset: 0; z-index: 499; background: rgba(12,12,24,.44);
      opacity: 0; pointer-events: none; transition: opacity 200ms ease; }
    body.f-nav-open .f-nav-backdrop { opacity: 1; pointer-events: auto; }

    /* Item "Reprendre" (affiché seulement si une brique est en cours) */
    .f-sb-resume .f-sb-ico { color: var(--accent-strong, #5B21B6); }
    html.dark .f-sb-resume .f-sb-ico { color: #A78BFA; }
    .f-sb-resume-sub { display: block; font-size: 11px; font-weight: 400; opacity: .62;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }

    /* ── Tiroir de navigation sur mobile (même contenu que le rail) ── */
    @media (max-width: 768px) {
      .f-nav-toggle { display: inline-flex; }
      .f-sidebar { display: flex; width: 264px; transform: translateX(-100%);
        transition: transform 220ms cubic-bezier(.4,0,.2,1); box-shadow: none; }
      .f-sidebar:hover { width: 264px; }
      body.f-nav-open .f-sidebar { transform: translateX(0); box-shadow: 0 12px 40px rgba(0,0,0,.28); }
      /* labels toujours visibles dans le tiroir */
      .f-sidebar .f-sb-wordmark, .f-sidebar .f-sb-label,
      .f-sidebar .f-sb-avatar-info { opacity: 1 !important; transform: none !important; }
      body.f-nav-locked { overflow: hidden; }
    }

    /* Mobile : en-tête compact, sans débordement ni retour à la ligne */
    @media (max-width: 640px) {
      .f-ctx-header { padding: 0 1rem; gap: 10px; }
      .f-ctx-left { min-width: 0; flex: 1 1 auto; overflow: hidden; }
      .f-ctx-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .f-ctx-breadcrumb { display: none; }
      .f-ctx-right { flex: 0 0 auto; }
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
  sidebar.id = 'f-sidebar-nav-panel';
  sidebar.innerHTML = `
    <a href="dashboard.html" class="f-sidebar-logo" aria-label="Fundamentals">
      <div class="f-sb-mark">f</div>
      <span class="f-sb-wordmark">Fundamentals</span>
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
      <a href="dashboard.html#explorer-section" class="f-sidebar-item${activeNav==='explorer'?' active':''}" id="f-sidebar-explorer">
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
      <button class="f-nav-toggle" id="f-nav-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="f-sidebar-nav-panel">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
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

  // Fond discret (filigrane) — sur toutes les pages, dashboard compris
  if (!document.querySelector('.f-bg-fx')) {
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

  // ── Mode anonyme ──────────────────────────────────────────────
  // Sans session : on masque tout ce qui est inaccessible et on n'expose
  // que les outils publics, plus une invitation a se connecter.
  var PUBLIC_PAGES = ['simulateur-budget.html', 'simulateur-emprunt.html'];

  // Indice synchrone de session (jeton Supabase en stockage local) :
  // evite un clignotement du menu avant la reponse asynchrone.
  function hasCachedSession() {
    try {
      // storageKey du client Supabase (voir getClient dans supabase.js)
      return !!localStorage.getItem('fund_auth');
    } catch (e) {}
    return false;
  }

  function svgIco(d) {
    return '<span class="f-sb-ico" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></span>';
  }

  // Sauvegarde du rendu connecté, pour pouvoir revenir en arrière si la
  // détection synchrone s'est trompée (jeton stocké autrement, session
  // restaurée tardivement...). Sans cela, un utilisateur connecté resterait
  // bloqué sur le menu anonyme.
  var snapAuth = null;

  function applyAnonymousMode() {
    if (document.body.classList.contains('f-anon')) return;
    if (!snapAuth) {
      var n0 = sidebar.querySelector('.f-sidebar-nav');
      var b0 = sidebar.querySelector('.f-sidebar-bottom');
      var l0 = sidebar.querySelector('.f-sidebar-logo');
      snapAuth = {
        nav: n0 ? n0.innerHTML : null,
        bottom: b0 ? b0.innerHTML : null,
        logo: l0 ? l0.getAttribute('href') : null
      };
    }
    document.body.classList.add('f-anon');

    var nav = sidebar.querySelector('.f-sidebar-nav');
    if (nav) {
      nav.innerHTML = '';
      var outils = [
        { href: 'simulateur-budget.html', label: 'Simulateur de budget',
          ico: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 16h5M8 8h8"/>' },
        { href: 'simulateur-emprunt.html', label: "Simulateur d'emprunt",
          ico: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M10 21v-6h4v6"/>' }
      ];
      outils.forEach(function (o) {
        var a = document.createElement('a');
        a.href = o.href;
        a.className = 'f-sidebar-item' + (page === o.href ? ' active' : '');
        a.innerHTML = svgIco(o.ico) + '<span class="f-sb-label">' + o.label + '</span>';
        nav.appendChild(a);
      });
    }

    // Le logo ne doit pas renvoyer vers une page protegee
    // (a l'etape 3, il pointera vers l'accueil public).
    var logo = sidebar.querySelector('.f-sidebar-logo');
    if (logo) logo.setAttribute('href', 'simulateur-budget.html');

    // Bas de menu : l'identite cede la place a l'invitation
    var bottom = sidebar.querySelector('.f-sidebar-bottom');
    if (bottom) {
      bottom.innerHTML =
        '<div class="f-sb-invite-mini" aria-hidden="true">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' +
        '</div>' +
        '<div class="f-sb-invite">' +
          '<p class="f-sb-invite-txt">Connecte-toi ou cr\u00e9e un compte pour retrouver ton parcours et conserver ta progression.</p>' +
          '<a class="f-sb-invite-cta" href="auth.html?signup=1">Cr\u00e9er mon compte \u2192</a>' +
        '</div>';
    }
  }

  function applyAuthMode(connecte) {
    if (!connecte) { applyAnonymousMode(); return; }
    document.body.classList.remove('f-anon');
    if (!snapAuth) return;                 // rien n'avait été remplacé
    var nav = sidebar.querySelector('.f-sidebar-nav');
    var bottom = sidebar.querySelector('.f-sidebar-bottom');
    var logo = sidebar.querySelector('.f-sidebar-logo');
    if (nav && snapAuth.nav !== null) nav.innerHTML = snapAuth.nav;
    if (bottom && snapAuth.bottom !== null) bottom.innerHTML = snapAuth.bottom;
    if (logo && snapAuth.logo) logo.setAttribute('href', snapAuth.logo);
    snapAuth = null;
    fillSidebarAvatar();                   // ré-alimente initiales + e-mail
    injectResume();                        // et la reprise éventuelle
  }

  // 1er rendu d'apres l'indice local, puis confirmation asynchrone
  if (!hasCachedSession()) applyAnonymousMode();
  (async function () {
    try {
      if (typeof getCurrentUser !== 'function') return;
      var u = await getCurrentUser();
      applyAuthMode(!!u);
    } catch (e) {}
  })();

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


  // ── Tiroir de navigation (mobile) ───────────────────────────
  var backdrop = document.createElement('div');
  backdrop.className = 'f-nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  function setNav(open) {
    document.body.classList.toggle('f-nav-open', open);
    document.body.classList.toggle('f-nav-locked', open);
    var t = document.getElementById('f-nav-toggle');
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  var navToggleBtn = document.getElementById('f-nav-toggle');
  if (navToggleBtn) navToggleBtn.addEventListener('click', function () {
    setNav(!document.body.classList.contains('f-nav-open'));
  });
  backdrop.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('f-nav-open')) setNav(false);
  });
  sidebar.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) setNav(false);
  });
  // Un retour au desktop ne doit jamais laisser l'etat verrouille
  if (window.matchMedia) {
    var mq = window.matchMedia('(min-width: 769px)');
    var onWide = function (ev) { if (ev.matches) setNav(false); };
    if (mq.addEventListener) mq.addEventListener('change', onWide);
    else if (mq.addListener) mq.addListener(onWide);
  }

  // ── "Reprendre" : uniquement s'il y a une brique en cours ailleurs ──
  function injectResume() {
    try {
      if (document.getElementById('f-sb-resume')) return;
      if (document.body.classList.contains('f-anon')) return;
      if (typeof BRICK_FILES === 'undefined') return;
      var dash = null;
      try { if (typeof loadFromStorage === 'function') dash = loadFromStorage('fund_dashboard'); } catch (e) {}
      if (!dash) {   // secours : lecture directe si le store partagé est indisponible
        try {
          var raw = (window.localStorage && localStorage.getItem('fund_dashboard'))
                 || (window.sessionStorage && sessionStorage.getItem('fund_dashboard'));
          if (raw) dash = JSON.parse(raw);
        } catch (e) {}
      }
      if (!dash || !dash.briques || !dash.briques.length) return;
      var cur = dash.briques.filter(function (b) { return b.statut === 'en_cours'; })[0];
      if (!cur) return;
      var file = BRICK_FILES[cur.id];
      if (!file || file === page) return;   // deja sur place : aucun ajout
      var meta = (typeof BRIQUES_META !== 'undefined' && BRIQUES_META[cur.id]) || null;
      var nom = (meta && meta.nom) || 'Ma brique en cours';
      var navEl = sidebar.querySelector('.f-sidebar-nav');
      if (!navEl) return;
      var a = document.createElement('a');
      a.id = 'f-sb-resume';
      a.href = file;
      a.className = 'f-sidebar-item f-sb-resume';
      a.title = 'Reprendre : ' + nom;
      a.innerHTML = '<span class="f-sb-ico" aria-hidden="true">'
        + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
        + '</span><span class="f-sb-label">Reprendre'
        + '<span class="f-sb-resume-sub">' + nom.replace(/</g, '&lt;') + '</span></span>';
      navEl.insertBefore(a, navEl.firstChild);
    } catch (e) { /* silencieux : aucune degradation si indisponible */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectResume);
  else injectResume();
  setTimeout(injectResume, 800);   // apres hydratation eventuelle

})();
