// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Nav Avatar Component
// Injecte un avatar pill dans .nav-right de chaque page protégée
// Usage : <script src="nav-avatar.js"></script> après supabase.js
// ═══════════════════════════════════════════════════════════════

(async function initNavAvatar() {
  const user = await getCurrentUser();
  let navRight = document.querySelector('.nav-right');

  // Si pas de .nav-right, on en crée un dans le header (quiz, etc.)
  if (!navRight) {
    const header = document.querySelector('header');
    if (!header) return; // pas de header du tout, on abandonne
    navRight = document.createElement('div');
    navRight.className = 'nav-right';
    navRight.style.cssText = 'display:flex;align-items:center;gap:0.75rem;margin-left:auto;';
    header.appendChild(navRight);
    // S'assurer que le header est en flex s'il ne l'est pas déjà
    const cs = window.getComputedStyle(header);
    if (cs.display !== 'flex' && cs.display !== 'inline-flex') {
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
    }
  }

  // ── Styles ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .nav-avatar-wrap {
      position: relative;
    }
    .nav-avatar-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.3rem 0.6rem 0.3rem 0.3rem;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      cursor: pointer;
      transition: border-color 180ms, background 180ms;
      font-family: inherit;
    }
    .nav-avatar-btn:hover {
      border-color: var(--border-hover);
      background: var(--surface-3);
    }
    .nav-avatar-circle {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg, var(--indigo), var(--purple));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 800; color: #fff;
      flex-shrink: 0; letter-spacing: 0;
      box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
    }
    .nav-avatar-email {
      font-size: 0.75rem; font-weight: 600;
      color: var(--text-muted);
      max-width: 120px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .nav-avatar-chevron {
      color: var(--text-faint);
      transition: transform 180ms;
      flex-shrink: 0;
    }
    .nav-avatar-btn[aria-expanded="true"] .nav-avatar-chevron {
      transform: rotate(180deg);
    }

    /* Dropdown */
    .nav-avatar-dropdown {
      position: absolute; top: calc(100% + 0.5rem); right: 0;
      min-width: 200px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1rem;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
      padding: 0.375rem;
      opacity: 0; pointer-events: none;
      transform: translateY(-6px) scale(0.97);
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
      padding: 0.625rem 0.75rem 0.5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.25rem;
    }
    .nav-dd-name {
      font-size: 0.82rem; font-weight: 700; color: var(--text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .nav-dd-role {
      font-size: 0.7rem; color: var(--text-faint); margin-top: 0.1rem;
    }
    .nav-dd-item {
      display: flex; align-items: center; gap: 0.625rem;
      padding: 0.55rem 0.75rem;
      border-radius: 0.625rem;
      font-size: 0.8rem; font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: background 140ms, color 140ms;
      text-decoration: none;
      border: none; background: none; font-family: inherit;
      width: 100%; text-align: left;
    }
    .nav-dd-item:hover {
      background: var(--surface-2);
      color: var(--text);
    }
    .nav-dd-item.danger:hover {
      background: rgba(248,113,113,0.08);
      color: var(--red);
    }
    .nav-dd-icon {
      width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; opacity: 0.7;
    }
    .nav-dd-sep {
      height: 1px; background: var(--border);
      margin: 0.25rem 0;
    }
  `;
  document.head.appendChild(style);

  // ── Build markup ─────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'nav-avatar-wrap';

  if (!user) {
    // Non connecté : simple lien login
    const link = document.createElement('a');
    link.href = 'auth.html';
    link.className = 'nav-link';
    link.textContent = 'Connexion';
    navRight.appendChild(link);
    return;
  }

  const email = user.email || '';
  const initials = email.slice(0, 2).toUpperCase();
  const displayEmail = email.length > 22 ? email.slice(0, 22) + '…' : email;

  // Récupère le profil pour afficher des infos contextuelles
  let profileLabel = 'Bêta testeur';
  try {
    const p = await loadProfile();
    if (p) {
      const statusMap = {
        etudiant: 'Étudiant', sal_ouvrier_employe: 'Salarié', sal_prof_inter: 'Salarié',
        cadre_prof_lib: 'Cadre / Prof. lib.', indep_tpe: 'Indépendant',
        chomeur_inactif: 'En recherche d\'emploi', retraite: 'Retraité',
        college_lycee: 'Lycéen / Collégien', autre: 'Autre situation'
      };
      const ageMap = {
        '15_17': '15–17 ans', '18_24': '18–24 ans', '25_34': '25–34 ans',
        '35_54': '35–54 ans', '55_64': '55–64 ans', '65_plus': '65 ans+'
      };
      const parts = [];
      if (p.status_pro && statusMap[p.status_pro]) parts.push(statusMap[p.status_pro]);
      if (p.age_group && ageMap[p.age_group]) parts.push(ageMap[p.age_group]);
      if (parts.length) profileLabel = parts.join(' · ');
    }
  } catch(e) {}

  wrap.innerHTML = `
    <button class="nav-avatar-btn" id="nav-avatar-btn" aria-haspopup="true" aria-expanded="false">
      <div class="nav-avatar-circle">${initials}</div>
      <span class="nav-avatar-email">${displayEmail}</span>
      <svg class="nav-avatar-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <div class="nav-avatar-dropdown" id="nav-avatar-dropdown" role="menu">
      <div class="nav-dd-header">
        <div class="nav-dd-name">${email}</div>
        <div class="nav-dd-role">${profileLabel}</div>
      </div>

      <a href="dashboard.html" class="nav-dd-item" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </span>
        Dashboard
      </a>

      <a href="plan.html" class="nav-dd-item" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </span>
        Mon plan
      </a>

      <a href="index.html" class="nav-dd-item" role="menuitem">
        <span class="nav-dd-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
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

  // ── Toggle logic ─────────────────────────────────────────────
  const btn = wrap.querySelector('#nav-avatar-btn');
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

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
