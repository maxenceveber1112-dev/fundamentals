// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Nav Avatar Component v2
// - Email masqué partout sauf dashboard
// - Bouton "← Dashboard" design affiché dans les briques
// - Logo pointe vers dashboard.html (géré dans le HTML de chaque page)
// ═══════════════════════════════════════════════════════════════

(async function initNavAvatar() {
  // ── Détection du contexte de la page ──────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isDashboard = page === 'dashboard.html';
  const isBrique    = page.startsWith('brique-');
  const isPlan      = page === 'plan.html';
  const isSimulateur = page.indexOf('simulateur-') === 0;

  // ── Trouver ou créer le slot nav-right ────────────────────────
  let navRight = document.querySelector('.nav-right, #nav-right-slot');
  if (!navRight) {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return;
    navRight = document.createElement('div');
    navRight.className = 'nav-right';
    navRight.id = 'nav-right-slot';
    navRight.style.cssText = 'display:flex;align-items:center;gap:0.75rem;margin-left:auto;';
    nav.appendChild(navRight);
    const cs = window.getComputedStyle(nav);
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') {
      nav.style.display = 'flex';
      nav.style.alignItems = 'center';
      nav.style.justifyContent = 'space-between';
    }
  }

  // ── Styles ────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Bouton retour dashboard (briques) */
    .nav-back-dashboard {
      display: inline-flex; align-items: center; gap: 0.45rem;
      padding: 0.35rem 0.8rem 0.35rem 0.6rem;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      color: var(--text-muted);
      font-size: 0.78rem; font-weight: 600;
      font-family: inherit;
      text-decoration: none;
      cursor: pointer;
      transition: border-color 160ms, background 160ms, color 160ms, box-shadow 160ms;
      letter-spacing: -0.01em;
    }
    .nav-back-dashboard:hover {
      border-color: var(--indigo);
      background: var(--indigo-dim);
      color: var(--violet);
      box-shadow: 0 0 0 3px var(--indigo-glow);
    }
    .nav-back-dashboard svg {
      opacity: 0.7;
      transition: transform 160ms, opacity 160ms;
    }
    .nav-back-dashboard:hover svg {
      opacity: 1;
      transform: translateX(-2px);
    }

    /* Avatar pill */
    .nav-avatar-wrap { position: relative; }

    .nav-avatar-btn {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.28rem 0.55rem 0.28rem 0.28rem;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      cursor: pointer;
      transition: border-color 160ms, background 160ms, box-shadow 160ms;
      font-family: inherit;
    }
    .nav-avatar-btn:hover {
      border-color: var(--border-hover);
      background: var(--surface-3);
      box-shadow: 0 0 0 3px var(--indigo-glow);
    }
    .nav-avatar-btn[aria-expanded="true"] {
      border-color: var(--indigo);
      box-shadow: 0 0 0 3px var(--indigo-glow);
    }

    .nav-avatar-circle {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg, var(--indigo) 0%, var(--purple) 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.68rem; font-weight: 800; color: #fff;
      flex-shrink: 0; letter-spacing: 0;
      box-shadow: 0 0 0 2px rgba(99,102,241,0.3), 0 2px 6px rgba(99,102,241,0.25);
    }

    /* Email : visible seulement sur dashboard */
    .nav-avatar-email {
      font-size: 0.74rem; font-weight: 600;
      color: var(--text-muted);
      max-width: 130px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .nav-avatar-email.hidden { display: none; }

    .nav-avatar-chevron {
      color: var(--text-faint);
      transition: transform 160ms;
      flex-shrink: 0;
    }
    .nav-avatar-btn[aria-expanded="true"] .nav-avatar-chevron {
      transform: rotate(180deg);
    }

    /* Dropdown */
    .nav-avatar-dropdown {
      position: absolute; top: calc(100% + 0.5rem); right: 0;
      min-width: 210px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);
      padding: 0.375rem;
      opacity: 0; pointer-events: none;
      transform: translateY(-8px) scale(0.96);
      transform-origin: top right;
      transition: opacity 180ms cubic-bezier(0.16,1,0.3,1),
                  transform 180ms cubic-bezier(0.16,1,0.3,1);
      z-index: 300;
    }
    .nav-avatar-dropdown.open {
      opacity: 1; pointer-events: all;
      transform: translateY(0) scale(1);
    }

    .nav-dd-header {
      padding: 0.65rem 0.75rem 0.55rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.25rem;
    }
    .nav-dd-email {
      font-size: 0.75rem; font-weight: 600; color: var(--text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .nav-dd-role {
      font-size: 0.68rem; color: var(--text-faint); margin-top: 0.15rem;
      font-weight: 500;
    }

    .nav-dd-item {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.6rem;
      font-size: 0.8rem; font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: background 130ms, color 130ms;
      text-decoration: none;
      border: none; background: none; font-family: inherit;
      width: 100%; text-align: left;
    }
    .nav-dd-item:hover {
      background: var(--surface-2);
      color: var(--text);
    }
    .nav-dd-item.active {
      color: var(--violet);
      background: var(--indigo-dim);
    }
    .nav-dd-item.danger:hover {
      background: rgba(248,113,113,0.08);
      color: var(--red);
    }
    .nav-dd-icon {
      width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; opacity: 0.65;
    }
    .nav-dd-item:hover .nav-dd-icon,
    .nav-dd-item.active .nav-dd-icon { opacity: 1; }

    .nav-dd-sep {
      height: 1px; background: var(--border);
      margin: 0.3rem 0.375rem;
    }
  `;
  document.head.appendChild(style);

  // ── User ──────────────────────────────────────────────────────
  const user = await getCurrentUser();

  if (!user) {
    const link = document.createElement('a');
    link.href = 'auth.html';
    link.textContent = 'Connexion';
    link.style.cssText = 'font-size:0.78rem;color:var(--text-muted);text-decoration:none;padding:0.35rem 0.75rem;border-radius:9999px;border:1px solid var(--border);';
    navRight.appendChild(link);
    return;
  }

  const email = user.email || '';
  const initials = (email.slice(0, 2) || 'U').toUpperCase();
  const displayEmail = email.length > 24 ? email.slice(0, 24) + '…' : email;

  // Profil label (rôle)
  let profileLabel = 'Bêta testeur';
  try {
    const p = await loadProfile();
    if (p) {
      const statusMap = {
        etudiant: 'Étudiant', sal_ouvrier_employe: 'Salarié', sal_prof_inter: 'Salarié',
        cadre_prof_lib: 'Cadre / Prof. lib.', indep_tpe: 'Indépendant',
        chomeur_inactif: 'En recherche', retraite: 'Retraité',
        college_lycee: 'Lycéen', autre: 'Autre'
      };
      const ageMap = {
        '15_17':'15–17 ans','18_24':'18–24 ans','25_34':'25–34 ans',
        '35_54':'35–54 ans','55_64':'55–64 ans','65_plus':'65 ans+'
      };
      const parts = [];
      if (p.status_pro && statusMap[p.status_pro]) parts.push(statusMap[p.status_pro]);
      if (p.age_group && ageMap[p.age_group]) parts.push(ageMap[p.age_group]);
      if (parts.length) profileLabel = parts.join(' · ');
    }
  } catch(e) {}

  // ── Bouton retour dashboard (briques + plan + simulateur) ─────
  if (isBrique || isPlan || isSimulateur) {
    const backBtn = document.createElement('a');
    backBtn.href = 'dashboard.html';
    backBtn.className = 'nav-back-dashboard';
    backBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
      Dashboard
    `;
    navRight.appendChild(backBtn);
  }

  // ── Avatar pill ───────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'nav-avatar-wrap';

  wrap.innerHTML = `
    <button class="nav-avatar-btn" id="nav-avatar-btn" aria-haspopup="true" aria-expanded="false" aria-label="Menu profil">
      <div class="nav-avatar-circle">${initials}</div>
      <span class="nav-avatar-email${isDashboard ? '' : ' hidden'}">${displayEmail}</span>
      <svg class="nav-avatar-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <div class="nav-avatar-dropdown" id="nav-avatar-dropdown" role="menu">
      <div class="nav-dd-header">
        <div class="nav-dd-email">${displayEmail}</div>
        <div class="nav-dd-role">${profileLabel}</div>
      </div>

      <a href="dashboard.html" class="nav-dd-item${isDashboard ? ' active' : ''}" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        </span>
        Dashboard
      </a>


      <a href="profil.html" class="nav-dd-item" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </span>
        Profil &amp; Objectifs
      </a>

      <a href="javascript:void(0)" class="nav-dd-item" id="nav-restart-brique" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </span>
        Reprendre depuis le début
      </a>

      <a href="javascript:void(0)" class="nav-dd-item" id="nav-refaire-btn" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </span>
        Refaire le questionnaire
      </a>

      <div class="nav-dd-sep"></div>

      <button class="nav-dd-item danger" onclick="signOut()" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </span>
        Se déconnecter
      </button>
    </div>
  `;

  navRight.appendChild(wrap);

  // ── Toggle ────────────────────────────────────────────────────
  const btn      = wrap.querySelector('#nav-avatar-btn');
  const dropdown = wrap.querySelector('#nav-avatar-dropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    dropdown.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  dropdown.addEventListener('click', (e) => e.stopPropagation());

  // Reprendre depuis le début : naviguer vers la 1ère brique du parcours
  const restartBtn = wrap.querySelector('#nav-restart-brique');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      dropdown.classList.remove('open');
      // Lire la 1ère brique depuis le storage
      var dashData = typeof loadFromStorage === 'function' ? loadFromStorage('fund_dashboard') : null;
      var briques = dashData && Array.isArray(dashData.briques) ? dashData.briques : [];
      var first = briques[0];
      if (first && typeof BRICK_FILES !== 'undefined' && BRICK_FILES[first.id]) {
        window.location.href = BRICK_FILES[first.id];
      } else {
        window.location.href = 'dashboard.html';
      }
    });
  }

  // Refaire le questionnaire : reset complet + redirect onboarding
  const refaireBtn = wrap.querySelector('#nav-refaire-btn');
  if (refaireBtn) {
    refaireBtn.addEventListener('click', async () => {
      dropdown.classList.remove('open');
      refaireBtn.style.opacity = '0.5';
      refaireBtn.style.pointerEvents = 'none';
      try {
        if (typeof resetUserData === 'function') await resetUserData();
      } catch(e) { console.warn('[nav] resetUserData failed:', e); }
      window.location.href = 'index.html';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
