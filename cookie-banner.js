// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Bandeau cookies / consentement (RGPD)
// Composant autonome (IIFE), à inclure sur toutes les pages.
// Le site n'utilise que des cookies/stockages essentiels (auth, thème)
// + Google Fonts (chargé depuis un CDN tiers → transfert d'IP).
// Ce bandeau informe et recueille le choix de l'utilisateur.
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var CONSENT_KEY = 'fund_cookie_consent'; // 'all' | 'essential'

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  // Ne rien afficher si un choix a déjà été fait
  if (getConsent()) return;

  function injectStyles() {
    if (document.getElementById('fund-cookie-styles')) return;
    var css =
      '#fund-cookie-banner{position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);' +
      'z-index:99998;width:calc(100% - 2rem);max-width:560px;' +
      'background:#1a1a2e;color:#F5F5F4;border:1px solid rgba(255,255,255,0.10);' +
      'border-radius:16px;padding:1.25rem 1.4rem;' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.45);' +
      'font-family:Inter,system-ui,-apple-system,sans-serif;' +
      'opacity:0;transform:translateX(-50%) translateY(12px);' +
      'transition:opacity .35s ease,transform .35s cubic-bezier(0.16,1,0.3,1);}' +
      '#fund-cookie-banner.fund-cookie-show{opacity:1;transform:translateX(-50%) translateY(0);}' +
      '#fund-cookie-banner .fc-title{font-size:.95rem;font-weight:700;margin:0 0 .4rem;display:flex;align-items:center;gap:.5rem;}' +
      '#fund-cookie-banner .fc-text{font-size:.82rem;line-height:1.55;color:#C7C7D1;margin:0 0 1rem;}' +
      '#fund-cookie-banner .fc-text a{color:#A78BFA;text-decoration:underline;}' +
      '#fund-cookie-banner .fc-actions{display:flex;gap:.6rem;flex-wrap:wrap;}' +
      '#fund-cookie-banner button{font-family:inherit;font-size:.82rem;font-weight:600;' +
      'padding:.55rem 1.1rem;border-radius:9px;cursor:pointer;border:1px solid transparent;' +
      'transition:opacity .15s,background .15s,border-color .15s;}' +
      '#fund-cookie-banner .fc-accept{background:linear-gradient(135deg,#8B5CF6,#3B82F6);color:#fff;flex:1;min-width:140px;}' +
      '#fund-cookie-banner .fc-accept:hover{opacity:.9;}' +
      '#fund-cookie-banner .fc-essential{background:transparent;color:#C7C7D1;border-color:rgba(255,255,255,0.18);}' +
      '#fund-cookie-banner .fc-essential:hover{border-color:rgba(255,255,255,0.35);color:#F5F5F4;}' +
      '@media(max-width:420px){#fund-cookie-banner .fc-actions{flex-direction:column;}' +
      '#fund-cookie-banner .fc-accept{flex:none;width:100%;}}';
    var style = document.createElement('style');
    style.id = 'fund-cookie-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function dismiss(banner) {
    banner.classList.remove('fund-cookie-show');
    setTimeout(function () { if (banner && banner.parentNode) banner.parentNode.removeChild(banner); }, 350);
  }

  function render() {
    injectStyles();

    var banner = document.createElement('div');
    banner.id = 'fund-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Bandeau de gestion des cookies');

    banner.innerHTML =
      '<p class="fc-title">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><circle cx="8.5" cy="10.5" r="1"/><circle cx="15.5" cy="13.5" r="1"/><circle cx="11" cy="15" r="1"/></svg>' +
        'On respecte tes données' +
      '</p>' +
      '<p class="fc-text">' +
        'Fundamental utilise uniquement des données techniques essentielles (connexion, préférence de thème) stockées sur ton appareil. ' +
        'Les polices d’écriture sont chargées via Google&nbsp;Fonts (un service tiers). ' +
        'Aucun cookie publicitaire ni traceur. ' +
        '<a href="confidentialite.html">En savoir plus</a>.' +
      '</p>' +
      '<div class="fc-actions">' +
        '<button type="button" class="fc-accept" id="fc-accept">J’accepte</button>' +
        '<button type="button" class="fc-essential" id="fc-essential">Essentiels uniquement</button>' +
      '</div>';

    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('fund-cookie-show'); });
    });

    document.getElementById('fc-accept').addEventListener('click', function () {
      setConsent('all'); dismiss(banner);
    });
    document.getElementById('fc-essential').addEventListener('click', function () {
      setConsent('essential'); dismiss(banner);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
