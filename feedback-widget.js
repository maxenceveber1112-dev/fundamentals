// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Feedback widget (mode bêta)
// Injecter via : <script src="feedback-widget.js"></script>
// Détecte automatiquement le nom de la page courante
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  const BETA_MODE = true; // Mettre à false pour désactiver globalement

  if (!BETA_MODE) return;

  // Détecte le nom de page depuis l'URL
  const pageName = window.location.pathname.split('/').pop().replace('.html','') || 'index';

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #fb-fab {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9000;
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 1rem; border-radius: 9999px;
      background: rgba(17,19,32,0.95); border: 1px solid #363a68;
      backdrop-filter: blur(12px);
      font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
      color: #818cf8; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: border-color 180ms, box-shadow 180ms, transform 120ms;
    }
    #fb-fab:hover { border-color: #818cf8; box-shadow: 0 4px 24px rgba(129,140,248,0.25); transform: translateY(-1px); }
    #fb-fab svg { flex-shrink: 0; }

    #fb-panel {
      position: fixed; bottom: 5rem; right: 1.5rem; z-index: 9001;
      width: 320px; max-width: calc(100vw - 2rem);
      background: #111320; border: 1px solid #252845; border-radius: 1.25rem;
      padding: 1.25rem; font-family: 'Inter', sans-serif;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      transform: translateY(10px) scale(0.97); opacity: 0; pointer-events: none;
      transition: transform 220ms cubic-bezier(0.16,1,0.3,1), opacity 200ms;
    }
    #fb-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

    #fb-panel h4 { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
    #fb-panel p  { font-size: 0.75rem; color: #8b90b8; margin-bottom: 1rem; }

    .fb-stars { display: flex; gap: 0.375rem; margin-bottom: 0.875rem; }
    .fb-star {
      width: 36px; height: 36px; border-radius: 0.5rem;
      background: #171a2e; border: 1px solid #252845;
      font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: border-color 140ms, background 140ms, transform 120ms cubic-bezier(0.34,1.56,0.64,1);
    }
    .fb-star:hover, .fb-star.selected { border-color: rgba(129,140,248,0.5); background: rgba(99,102,241,0.15); transform: scale(1.12); }

    .fb-textarea {
      width: 100%; padding: 0.65rem 0.875rem; border-radius: 0.75rem;
      background: #171a2e; border: 1px solid #252845; color: #e2e4f0;
      font-family: 'Inter', sans-serif; font-size: 0.82rem; resize: vertical; min-height: 80px;
      outline: none; transition: border-color 140ms;
      margin-bottom: 0.875rem;
    }
    .fb-textarea:focus { border-color: rgba(99,102,241,0.4); }
    .fb-textarea::placeholder { color: #444868; }

    .fb-submit {
      width: 100%; padding: 0.7rem; border-radius: 9999px;
      background: linear-gradient(135deg, #6366f1, #c084fc);
      font-size: 0.85rem; font-weight: 700; color: #fff; border: none;
      cursor: pointer; font-family: 'Inter', sans-serif;
      box-shadow: 0 0 18px rgba(99,102,241,0.3);
      transition: box-shadow 180ms; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    }
    .fb-submit:hover { box-shadow: 0 0 28px rgba(99,102,241,0.45); }
    .fb-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .fb-success {
      text-align: center; padding: 0.5rem 0;
      font-size: 0.82rem; font-weight: 600; color: #4ade80;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const fab = document.createElement('button');
  fab.id = 'fb-fab';
  fab.setAttribute('aria-label', 'Donner mon avis bêta');
  fab.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Bêta — Ton avis
  `;

  const panel = document.createElement('div');
  panel.id = 'fb-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Feedback bêta');
  panel.innerHTML = `
    <h4>Comment tu trouves cette page ?</h4>
    <p>Page : <strong style="color:#c084fc;">${pageName}</strong> — Ton retour nous aide énormément.</p>
    <div class="fb-stars" role="group" aria-label="Note de 1 à 5">
      <button class="fb-star" data-val="1" aria-label="1 étoile">😕</button>
      <button class="fb-star" data-val="2" aria-label="2 étoiles">😐</button>
      <button class="fb-star" data-val="3" aria-label="3 étoiles">🙂</button>
      <button class="fb-star" data-val="4" aria-label="4 étoiles">😊</button>
      <button class="fb-star" data-val="5" aria-label="5 étoiles">🤩</button>
    </div>
    <textarea class="fb-textarea" id="fb-text" placeholder="Un bug ? Une idée ? Quelque chose qui t'a bloqué ? (optionnel)"></textarea>
    <button class="fb-submit" id="fb-send">Envoyer</button>
    <div class="fb-success" id="fb-success">Merci, c'est noté ! 🙏</div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  let selectedRating = 0;
  let panelOpen = false;

  fab.addEventListener('click', () => {
    panelOpen = !panelOpen;
    panel.classList.toggle('open', panelOpen);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (panelOpen && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
      panelOpen = false;
      panel.classList.remove('open');
    }
  });

  // Star selection
  panel.querySelectorAll('.fb-star').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.val);
      panel.querySelectorAll('.fb-star').forEach((b, i) => {
        b.classList.toggle('selected', i < selectedRating);
      });
    });
  });

  // Submit
  document.getElementById('fb-send').addEventListener('click', async () => {
    const message = document.getElementById('fb-text').value.trim();
    if (!selectedRating && !message) {
      document.getElementById('fb-text').focus();
      return;
    }
    const btn = document.getElementById('fb-send');
    btn.disabled = true;
    btn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;"></div>';

    try {
      if (typeof submitFeedback === 'function') {
        await submitFeedback(pageName, selectedRating || null, message || null);
      }
    } catch(e) {}

    btn.style.display = 'none';
    document.getElementById('fb-success').style.display = 'block';
    setTimeout(() => {
      panelOpen = false;
      panel.classList.remove('open');
      // Reset
      setTimeout(() => {
        selectedRating = 0;
        panel.querySelectorAll('.fb-star').forEach(b => b.classList.remove('selected'));
        document.getElementById('fb-text').value = '';
        document.getElementById('fb-success').style.display = 'none';
        btn.style.display = '';
        btn.disabled = false;
        btn.textContent = 'Envoyer';
      }, 400);
    }, 1800);
  });
})();
