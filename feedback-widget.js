// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Feedback widget (mode bêta)
// Injecter via : <script src="feedback-widget.js"></script>
// S'adapte au thème clair/sombre (html.dark). Détecte la page courante.
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  const BETA_MODE = true; // Mettre à false pour désactiver globalement
  if (!BETA_MODE) return;

  const pageName = window.location.pathname.split('/').pop().replace('.html','') || 'index';

  // ── CSS (thème-aware via html.dark ; clair par défaut) ──
  const style = document.createElement('style');
  style.textContent = `
    #fb-fab {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9000;
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1rem 0.6rem 0.95rem; border-radius: 9999px;
      background: rgba(255,255,255,0.82); border: 1px solid rgba(28,25,23,0.12);
      -webkit-backdrop-filter: blur(14px) saturate(1.4); backdrop-filter: blur(14px) saturate(1.4);
      font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
      color: #6d28d9; cursor: pointer;
      box-shadow: 0 6px 24px rgba(80,70,160,0.16);
      transition: border-color 180ms, box-shadow 180ms, transform 160ms, background 220ms, color 220ms;
    }
    html.dark #fb-fab {
      background: rgba(17,19,32,0.82); border-color: #363a68; color: #a5b4fc;
      box-shadow: 0 6px 24px rgba(0,0,0,0.45);
    }
    #fb-fab:not(.fb-active) { animation: fbNudge 7s ease-in-out infinite; }
    #fb-fab:hover { animation: none; transform: translateY(-2px);
      border-color: rgba(129,140,248,0.7); box-shadow: 0 8px 30px rgba(129,140,248,0.28); }
    #fb-fab svg { flex-shrink: 0; }

    #fb-dot { position: absolute; top: -2px; right: -2px; width: 11px; height: 11px; border-radius: 50%;
      background: linear-gradient(135deg,#8b5cf6,#c084fc); box-shadow: 0 0 0 2px rgba(255,255,255,0.85); }
    html.dark #fb-dot { box-shadow: 0 0 0 2px rgba(17,19,32,0.9); }
    #fb-dot::after { content:''; position: absolute; inset: 0; border-radius: 50%;
      background: #a78bfa; animation: fbPing 1.9s cubic-bezier(0,0,0.2,1) infinite; }
    #fb-fab.fb-active #fb-dot { display: none; }

    @keyframes fbPing { 0% { transform: scale(1); opacity: 0.65; } 100% { transform: scale(2.6); opacity: 0; } }
    @keyframes fbNudge {
      0%, 84%, 100% { transform: translateY(0) rotate(0deg); }
      88% { transform: translateY(-3px) rotate(-4deg); }
      92% { transform: translateY(-3px) rotate(4deg); }
      96% { transform: translateY(0) rotate(0deg); }
    }
    @keyframes fbSpin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      #fb-fab { animation: none !important; }
      #fb-dot::after { animation: none !important; }
    }

    #fb-panel {
      position: fixed; bottom: 5rem; right: 1.5rem; z-index: 9001;
      width: 320px; max-width: calc(100vw - 2rem);
      background: #ffffff; border: 1px solid rgba(28,25,23,0.10); border-radius: 1.25rem;
      padding: 1.25rem; font-family: 'Inter', sans-serif;
      box-shadow: 0 16px 50px rgba(60,50,120,0.18);
      transform: translateY(10px) scale(0.97); opacity: 0; pointer-events: none;
      transition: transform 220ms cubic-bezier(0.16,1,0.3,1), opacity 200ms, background 220ms, border-color 220ms;
    }
    html.dark #fb-panel { background: #14162a; border-color: #252845; box-shadow: 0 16px 50px rgba(0,0,0,0.55); }
    #fb-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

    #fb-panel h4 { font-size: 0.92rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
    #fb-panel p  { font-size: 0.75rem; color: #78716c; margin-bottom: 1rem; }
    html.dark #fb-panel h4 { color: #fff; }
    html.dark #fb-panel p  { color: #8b90b8; }

    .fb-stars { display: flex; gap: 0.375rem; margin-bottom: 0.75rem; }
    .fb-star {
      width: 36px; height: 36px; border-radius: 0.5rem;
      background: #f4f2ef; border: 1px solid rgba(28,25,23,0.10);
      font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: border-color 140ms, background 140ms, transform 120ms cubic-bezier(0.34,1.56,0.64,1);
    }
    html.dark .fb-star { background: #171a2e; border-color: #252845; }
    .fb-star:hover, .fb-star.selected { border-color: rgba(129,140,248,0.6); background: rgba(139,92,246,0.14); transform: scale(1.12); }

    .fb-cats { display: flex; gap: 0.4rem; margin-bottom: 0.875rem; }
    .fb-cat {
      flex: 1; padding: 0.4rem 0.3rem; border-radius: 0.6rem; font-size: 0.72rem; font-weight: 600;
      background: #f4f2ef; border: 1px solid rgba(28,25,23,0.10); color: #57534e; cursor: pointer;
      font-family: 'Inter', sans-serif; transition: border-color 140ms, background 140ms, color 140ms;
    }
    html.dark .fb-cat { background: #171a2e; border-color: #252845; color: #a8adc9; }
    .fb-cat:hover { border-color: rgba(129,140,248,0.5); }
    .fb-cat.selected { border-color: rgba(139,92,246,0.7); background: rgba(139,92,246,0.15); color: #6d28d9; }
    html.dark .fb-cat.selected { color: #c4b5fd; }

    .fb-textarea {
      width: 100%; padding: 0.65rem 0.875rem; border-radius: 0.75rem;
      background: #f9f8f6; border: 1px solid rgba(28,25,23,0.10); color: #1a1a2e;
      font-family: 'Inter', sans-serif; font-size: 0.82rem; resize: vertical; min-height: 76px;
      outline: none; transition: border-color 140ms; margin-bottom: 0.875rem;
    }
    html.dark .fb-textarea { background: #171a2e; border-color: #252845; color: #e2e4f0; }
    .fb-textarea:focus { border-color: rgba(139,92,246,0.5); }
    .fb-textarea::placeholder { color: #a8a29e; }
    html.dark .fb-textarea::placeholder { color: #565a7e; }

    .fb-submit {
      width: 100%; padding: 0.7rem; border-radius: 9999px;
      background: linear-gradient(135deg, #6366f1, #c084fc);
      font-size: 0.85rem; font-weight: 700; color: #fff; border: none;
      cursor: pointer; font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 18px rgba(99,102,241,0.32);
      transition: box-shadow 180ms, transform 120ms; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    }
    .fb-submit:hover { box-shadow: 0 6px 28px rgba(99,102,241,0.48); transform: translateY(-1px); }
    .fb-submit:active { transform: scale(0.98); }
    .fb-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .fb-success { text-align: center; padding: 0.5rem 0; font-size: 0.82rem; font-weight: 600; color: #16a34a; display: none; }
    html.dark .fb-success { color: #4ade80; }
  `;
  document.head.appendChild(style);

  // ── FAB ──
  const fab = document.createElement('button');
  fab.id = 'fb-fab';
  fab.setAttribute('aria-label', 'Donner mon avis bêta');
  fab.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Bêta — Ton avis
    <span id="fb-dot" aria-hidden="true"></span>
  `;

  // ── Panel ──
  const panel = document.createElement('div');
  panel.id = 'fb-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Feedback bêta');
  panel.innerHTML = `
    <h4>Comment tu trouves cette page ?</h4>
    <p>Page : <strong style="color:#a855f7;">${pageName}</strong> — ton retour nous aide énormément.</p>
    <div class="fb-stars" role="group" aria-label="Note de 1 à 5">
      <button class="fb-star" data-val="1" aria-label="1 étoile">😕</button>
      <button class="fb-star" data-val="2" aria-label="2 étoiles">😐</button>
      <button class="fb-star" data-val="3" aria-label="3 étoiles">🙂</button>
      <button class="fb-star" data-val="4" aria-label="4 étoiles">😊</button>
      <button class="fb-star" data-val="5" aria-label="5 étoiles">🤩</button>
    </div>
    <div class="fb-cats" role="group" aria-label="Type de retour">
      <button class="fb-cat" data-cat="Bug">🐞 Bug</button>
      <button class="fb-cat" data-cat="Idée">💡 Idée</button>
      <button class="fb-cat" data-cat="Autre">💬 Autre</button>
    </div>
    <textarea class="fb-textarea" id="fb-text" placeholder="Un bug ? Une idée ? Quelque chose qui t'a bloqué ? (optionnel)"></textarea>
    <button class="fb-submit" id="fb-send">Envoyer</button>
    <div class="fb-success" id="fb-success">Merci, c'est noté ! 🙏</div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  let selectedRating = 0;
  let selectedCat = '';
  let panelOpen = false;

  function setOpen(open) {
    panelOpen = open;
    panel.classList.toggle('open', open);
    fab.classList.toggle('fb-active', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  fab.addEventListener('click', () => setOpen(!panelOpen));

  document.addEventListener('click', e => {
    if (panelOpen && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panelOpen) setOpen(false); });

  panel.querySelectorAll('.fb-star').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.val);
      panel.querySelectorAll('.fb-star').forEach((b, i) => b.classList.toggle('selected', i < selectedRating));
    });
  });

  panel.querySelectorAll('.fb-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCat = (selectedCat === btn.dataset.cat) ? '' : btn.dataset.cat;
      panel.querySelectorAll('.fb-cat').forEach(b => b.classList.toggle('selected', b.dataset.cat === selectedCat));
    });
  });

  document.getElementById('fb-send').addEventListener('click', async () => {
    const message = document.getElementById('fb-text').value.trim();
    if (!selectedRating && !selectedCat && !message) {
      document.getElementById('fb-text').focus();
      return;
    }
    const fullMessage = (selectedCat ? '[' + selectedCat + '] ' : '') + message;
    const btn = document.getElementById('fb-send');
    btn.disabled = true;
    btn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:fbSpin 0.7s linear infinite;"></div>';

    try {
      if (typeof submitFeedback === 'function') {
        await submitFeedback(pageName, selectedRating || null, fullMessage || null);
      }
    } catch(e) {}

    btn.style.display = 'none';
    document.getElementById('fb-success').style.display = 'block';
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        selectedRating = 0; selectedCat = '';
        panel.querySelectorAll('.fb-star').forEach(b => b.classList.remove('selected'));
        panel.querySelectorAll('.fb-cat').forEach(b => b.classList.remove('selected'));
        document.getElementById('fb-text').value = '';
        document.getElementById('fb-success').style.display = 'none';
        btn.style.display = ''; btn.disabled = false; btn.textContent = 'Envoyer';
      }, 400);
    }, 1800);
  });
})();
