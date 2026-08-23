// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Modale de connexion / création de compte
//
// Reprend le bloc de auth.html, mais par-dessus la page courante : on ne
// veut pas faire quitter à l'utilisateur un plan qu'il vient de découvrir.
// auth.html reste la page canonique — c'est le repli quand ce script n'est
// pas chargé, et l'entrée directe par l'URL.
//
// La logique d'authentification n'est pas dupliquée : tout passe par les
// fonctions de supabase.js (signInWithEmail, signUpWithEmail, ...). Seule
// la mise en forme vit ici, avec ses propres classes « am- » pour ne rien
// heurter dans les pages hôtes.
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  var STYLE_ID = 'am-styles';
  var overlay = null;
  var onglet = 'signup';
  var dernierFocus = null;

  // ─── Styles ────────────────────────────────────────────────────
  // Rien n'est codé en dur côté couleurs : on emprunte les variables de
  // la page, donc le thème clair/sombre suit sans effort.
  var CSS = [
    // L'entrée est portée par une animation CSS, jamais par une classe posée
    // en JS : un requestAnimationFrame qui ne se déclenche pas (onglet en
    // arrière-plan) laisserait la modale invisible alors qu'elle est ouverte.
    '.am-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;',
    'justify-content:center;padding:1.25rem;overflow-y:auto;',
    'background:rgba(8,8,18,.55);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);',
    'animation:amIn .22s ease both}',
    '@keyframes amIn{from{opacity:0}to{opacity:1}}',
    '.am-overlay.am-out{animation:amOut .2s ease both}',
    '@keyframes amOut{to{opacity:0}}',

    '.am-card{position:relative;width:100%;max-width:420px;margin:auto;',
    'background:var(--bg-elevated);border:1px solid var(--border-mid);',
    'border-radius:1.25rem;padding:2rem 1.9rem 1.6rem;box-shadow:0 24px 60px rgba(0,0,0,.35);',
    'animation:amCard .26s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes amCard{from{transform:translateY(10px) scale(.985)}to{transform:none}}',

    '.am-close{position:absolute;top:0.7rem;right:0.7rem;width:38px;height:38px;',
    'border:none;background:transparent;color:var(--text-faint);font-size:1.25rem;',
    'line-height:1;border-radius:50%;cursor:pointer}',
    '.am-close:hover{color:var(--text);background:var(--surface-2)}',

    '.am-t{font-size:22px;font-weight:600;letter-spacing:-.015em;color:var(--text)}',
    '.am-s{font-size:13.5px;color:var(--text-muted);margin-top:.2rem}',

    // Les modules du parcours, repris tels quels du plan que la personne
    // vient de voir : c'est le sien qui attend, pas une promesse générique.
    // Le bloc sert dans la modale (large) et dans la colonne d'auth.html
    // (etroite) : le texte passe sous les pastilles quand la place manque,
    // plutot que de se disloquer en lignes de deux mots.
    '.am-draft{position:relative;overflow:hidden;display:flex;align-items:center;',
    'flex-wrap:wrap;gap:.9rem;',
    'margin-top:1rem;padding:.9rem 1rem;border-radius:var(--r-md,.875rem);',
    'background:var(--accent-soft);',
    'border:1px solid color-mix(in srgb, var(--accent-strong) 24%, transparent)}',

    '.am-draft-f{position:absolute;right:-.6rem;bottom:-2.1rem;',
    'font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:9rem;line-height:1;',
    'color:color-mix(in srgb, var(--accent-strong) 40%, transparent);',
    'pointer-events:none;user-select:none}',

    '.am-draft-stack{position:relative;z-index:1;display:flex;flex-shrink:0}',
    '.am-draft-chip{width:33px;height:33px;border-radius:50%;display:flex;align-items:center;',
    'justify-content:center;font-size:15px;background:var(--bg-elevated);',
    'border:1.5px solid color-mix(in srgb, var(--accent-strong) 38%, transparent);',
    'margin-left:-7px;opacity:0;transform:translateY(6px) scale(.7);',
    'animation:amPop .42s cubic-bezier(.16,1,.3,1) forwards, amFloat 2.6s ease-in-out infinite}',
    '.am-draft-chip:first-child{margin-left:0}',
    '.am-draft-more{font-size:11px;font-weight:700;color:var(--accent-strong)}',
    '@keyframes amPop{to{opacity:1;transform:none}}',
    '@keyframes amFloat{0%,100%{translate:0 0;scale:1}50%{translate:0 -4.5px;scale:1.07}}',

    '.am-draft-txt{position:relative;z-index:1;flex:1 1 8rem;min-width:0;',
    'font-size:.79rem;line-height:1.5;color:var(--text-secondary)}',
    '.am-draft-txt b{color:var(--text);font-weight:600}',

    '.am-tabs{display:flex;gap:1.5rem;margin:1.25rem 0 .25rem;',
    'border-bottom:1px solid var(--border-subtle)}',
    '.am-tab{font-family:inherit;font-size:14px;font-weight:600;padding:.6rem 0;',
    'background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;',
    'color:var(--text-muted);cursor:pointer}',
    '.am-tab.am-act{color:var(--text);border-bottom-color:var(--accent-strong)}',

    '.am-msg{display:none;font-size:12.5px;line-height:1.5;padding:.7rem .85rem;',
    'border-radius:var(--r-md,.875rem);margin-top:1rem}',
    '.am-msg.am-show{display:block}',
    '.am-err{background:rgba(220,38,38,.10);border:1px solid rgba(220,38,38,.30);color:var(--red,#DC2626)}',
    '.am-ok{background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.30);color:var(--green,#16A34A)}',

    '.am-social{display:flex;flex-direction:column;gap:.6rem;margin-top:1.25rem}',
    '.am-btn-s{display:flex;align-items:center;justify-content:center;gap:.65rem;',
    'width:100%;padding:.8rem 1rem;border-radius:.9rem;font-family:inherit;font-size:14px;',
    'font-weight:600;cursor:pointer;border:1px solid var(--border-mid);',
    'background:var(--surface-2);color:var(--text);transition:filter .15s,border-color .15s}',
    '.am-btn-s:hover{border-color:var(--border-hover)}',
    '.am-apple{background:#000;color:#fff;border-color:#000}',
    '.am-apple:hover{filter:brightness(1.25)}',

    '.am-div{display:flex;align-items:center;gap:.75rem;margin:1.25rem 0 1rem;',
    'font-size:11.5px;color:var(--text-faint)}',
    '.am-div::before,.am-div::after{content:"";flex:1;height:1px;background:var(--border-subtle)}',

    '.am-f{display:flex;flex-direction:column;gap:.9rem}',
    '.am-g label{display:block;font-size:12px;font-weight:600;color:var(--text-secondary);',
    'margin-bottom:.4rem}',
    '.am-g input{width:100%;padding:.75rem .9rem;font-family:inherit;font-size:14px;',
    'color:var(--text);background:var(--input-bg,var(--surface-2));border-radius:.75rem;',
    'border:1px solid var(--border-mid);transition:border-color .15s}',
    '.am-g input:focus{outline:none;border-color:var(--accent-strong)}',
    '.am-g input::placeholder{color:var(--text-faint)}',

    '.am-go{display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;',
    'margin-top:.35rem;padding:.85rem 1rem;border:none;border-radius:var(--r-full,9999px);',
    'font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer;',
    'background:var(--accent-fill);color:#fff;transition:filter .15s,transform .15s}',
    '.am-go:hover{filter:brightness(1.06)}',
    '.am-go:disabled{opacity:.6;cursor:default}',

    '.am-foot{margin-top:1.1rem;font-size:12px;color:var(--text-faint);text-align:center;line-height:1.7}',
    '.am-foot a{color:var(--accent-strong);text-decoration:none;cursor:pointer}',
    '.am-foot a:hover{text-decoration:underline}',

    '@media (max-width:480px){.am-card{padding:1.6rem 1.25rem 1.35rem}',
    '.am-draft{gap:.7rem;padding:.8rem .85rem}.am-draft-chip{width:30px;height:30px;font-size:14px}}',
    '@media (prefers-reduced-motion:reduce){',
    '.am-overlay,.am-overlay.am-out,.am-card{animation:none}',
    '.am-draft-chip{animation:none;opacity:1;transform:none}}'
  ].join('');

  function poserStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ─── Le parcours en attente ────────────────────────────────────
  // Construit ici plutôt que dans chaque page : la modale et auth.html
  // montrent le même bloc, il ne doit pas diverger.
  var MAX_PASTILLES = 5;
  // Au-dela, ce n'est plus « le parcours que je viens de construire » : c'est
  // un residu, parfois celui de quelqu'un d'autre sur un navigateur partage.
  var FRAICHEUR_MS = 24 * 60 * 60 * 1000;

  function modulesEnAttente() {
    try {
      if (typeof readAnonDraft !== 'function' || typeof BRIQUES_META === 'undefined') return null;
      if (typeof anonDraftAge === 'function' && anonDraftAge() > FRAICHEUR_MS) return null;
      var d = readAnonDraft();
      var ids = d && d.fund_profil && d.fund_profil.briques_recommandees;
      if (!ids || !ids.length) return null;
      return ids.filter(function (id) { return BRIQUES_META[id]; });
    } catch (e) { return null; }
  }

  function blocParcoursGarde() {
    poserStyles();
    var ids = modulesEnAttente();
    if (!ids || !ids.length) return '';

    var visibles = ids.slice(0, MAX_PASTILLES);
    var reste = ids.length - visibles.length;
    var chips = visibles.map(function (id, i) {
      // Deux animations : l'entrée en cascade, puis la respiration décalée
      // d'une pastille à l'autre — l'ensemble ondule au lieu de pulser.
      return '<span class="am-draft-chip" style="animation-delay:' + (i * 70) + 'ms,'
           + (620 + i * 150) + 'ms">' + (BRIQUES_META[id].icon || '•') + '</span>';
    }).join('');
    if (reste > 0) {
      chips += '<span class="am-draft-chip am-draft-more" style="animation-delay:'
             + (visibles.length * 70) + 'ms,' + (620 + visibles.length * 150) + 'ms">+'
             + reste + '</span>';
    }

    return '<div class="am-draft">'
      + '<span class="am-draft-f" aria-hidden="true">f</span>'
      + '<span class="am-draft-stack" aria-hidden="true">' + chips + '</span>'
      + '<span class="am-draft-txt">Tes <b>' + ids.length + ' module'
      + (ids.length > 1 ? 's' : '') + '</b> patientent ici. '
      + 'Ils te suivent sur ton compte.</span>'
      + '</div>';
  }

  // ─── Messages ──────────────────────────────────────────────────
  function boite() { return overlay && overlay.querySelector('#am-msg'); }
  function effacerMsg() {
    var m = boite();
    if (m) { m.className = 'am-msg'; m.textContent = ''; }
  }
  function erreur(t) {
    var m = boite();
    if (m) { m.className = 'am-msg am-err am-show'; m.textContent = t; }
  }
  function succes(t) {
    var m = boite();
    if (m) { m.className = 'am-msg am-ok am-show'; m.textContent = t; }
  }

  // Reprend mot pour mot les traductions de auth.html : un même échec doit
  // se lire pareil, que l'on passe par la modale ou par la page.
  function libelleErreur(msg) {
    msg = String(msg || '');
    if (msg.indexOf('Invalid login credentials') !== -1) return 'E-mail ou mot de passe incorrect.';
    if (msg.indexOf('User already registered') !== -1) return 'Un compte existe déjà avec cet e-mail.';
    if (msg.indexOf('Email not confirmed') !== -1) return 'Confirme ton adresse e-mail avant de te connecter.';
    if (msg.indexOf('Password should be at least') !== -1) return 'Le mot de passe est trop court (8 caractères min.).';
    if (msg.indexOf('SDK manquant') !== -1) return 'Connexion indisponible pour le moment. Réessaie dans un instant.';
    return msg || 'Une erreur est survenue.';
  }

  // ─── Onglets ───────────────────────────────────────────────────
  function poserOnglet(mode) {
    onglet = mode;
    var estConnexion = mode === 'login';
    overlay.querySelector('#am-tab-login').classList.toggle('am-act', estConnexion);
    overlay.querySelector('#am-tab-signup').classList.toggle('am-act', !estConnexion);
    overlay.querySelector('#am-tab-login').setAttribute('aria-selected', String(estConnexion));
    overlay.querySelector('#am-tab-signup').setAttribute('aria-selected', String(!estConnexion));
    overlay.querySelector('#am-confirm-g').style.display = estConnexion ? 'none' : '';
    overlay.querySelector('#am-t').textContent = estConnexion ? 'Bienvenue' : 'Créer un compte';
    overlay.querySelector('#am-s').textContent = estConnexion
      ? 'Connecte-toi pour retrouver ton parcours.'
      : 'Rejoins Fundamental et garde ton parcours.';
    overlay.querySelector('#am-go-label').textContent = estConnexion ? 'Se connecter' : 'Créer mon compte';
    overlay.querySelector('#am-pass').setAttribute('autocomplete', estConnexion ? 'current-password' : 'new-password');
    overlay.querySelector('#am-alt-login').style.display = estConnexion ? 'none' : '';
    overlay.querySelector('#am-alt-signup').style.display = estConnexion ? '' : 'none';
    // « Il sera rattache a ce compte » ne vaut que pour un compte neuf : un
    // compte existant garde son propre parcours, le brouillon serait ecarte.
    var bd = overlay.querySelector('.am-draft');
    if (bd) bd.style.display = estConnexion ? 'none' : '';
    effacerMsg();
  }

  // ─── Envoi ─────────────────────────────────────────────────────
  function chargement(actif) {
    var b = overlay.querySelector('#am-go');
    b.disabled = actif;
    overlay.querySelector('#am-go-label').textContent = actif
      ? 'Un instant…'
      : (onglet === 'login' ? 'Se connecter' : 'Créer mon compte');
  }

  async function envoyer(ev) {
    ev.preventDefault();
    effacerMsg();
    var email = overlay.querySelector('#am-email').value.trim();
    var pass = overlay.querySelector('#am-pass').value;
    var conf = overlay.querySelector('#am-confirm').value;

    if (!email || !pass) { erreur('Remplis tous les champs.'); return; }
    if (pass.length < 8) { erreur('Le mot de passe doit faire au moins 8 caractères.'); return; }
    if (onglet === 'signup' && pass !== conf) { erreur('Les mots de passe ne correspondent pas.'); return; }

    chargement(true);
    try {
      if (onglet === 'login') {
        var r = await signInWithEmail(email, pass);
        if (r && r.error) { erreur(libelleErreur(r.error)); chargement(false); return; }
        await rattacherPuisEntrer();
      } else {
        var s = await signUpWithEmail(email, pass);
        if (s && s.error) { erreur(libelleErreur(s.error)); chargement(false); return; }
        // Supabase exige la confirmation par e-mail : aucune session n'est
        // ouverte ici. On le dit clairement plutôt que de laisser attendre.
        succes('Compte créé. Confirme ton adresse par e-mail, puis reviens te connecter : ton parcours t’attend.');
        chargement(false);
      }
    } catch (e) {
      erreur('Une erreur est survenue. Réessaie.');
      chargement(false);
    }
  }

  // Le parcours construit sans compte est rattaché avant toute redirection,
  // exactement comme le fait redirectAfterLogin() dans auth.html.
  async function rattacherPuisEntrer() {
    try {
      if (typeof migrateAnonDraft === 'function') {
        var r = await migrateAnonDraft();
        if (r && r.migre === true) {
          sessionStorage.setItem('fund_parcours_rattache', '1');
        } else if (r && r.raison === 'compte deja pourvu') {
          sessionStorage.setItem('fund_brouillon_conserve', '1');
        }
      }
    } catch (e) {}
    window.location.href = 'dashboard.html';
  }

  function google() {
    effacerMsg();
    if (typeof signInWithGoogle === 'function') signInWithGoogle();
    else erreur('Connexion Google indisponible pour le moment.');
  }

  async function apple() {
    effacerMsg();
    try {
      var sb = (typeof getClient === 'function') ? getClient() : null;
      if (!sb) { erreur('Connexion Apple indisponible pour le moment.'); return; }
      var res = await sb.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin + '/index.html' }
      });
      if (res && res.error) erreur('Connexion Apple non disponible pour l’instant.');
    } catch (e) { erreur('Connexion Apple non disponible pour l’instant.'); }
  }

  // ─── Ouverture / fermeture ─────────────────────────────────────
  function fermer() {
    if (!overlay) return;
    overlay.classList.add('am-out');
    document.removeEventListener('keydown', surTouche, true);
    var el = overlay;
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 210);
    overlay = null;
    document.body.style.overflow = '';
    if (dernierFocus && dernierFocus.focus) { try { dernierFocus.focus(); } catch (e) {} }
  }

  function surTouche(e) {
    if (e.key === 'Escape') { e.stopPropagation(); fermer(); return; }
    if (e.key !== 'Tab' || !overlay) return;
    // Le focus reste dans la modale tant qu'elle est ouverte
    var f = overlay.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var premier = f[0], dernier = f[f.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  }

  function ouvrir(opts) {
    opts = opts || {};
    if (overlay) return;
    poserStyles();
    dernierFocus = document.activeElement;

    overlay = document.createElement('div');
    overlay.className = 'am-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'am-t');

    var brouillon = blocParcoursGarde();

    overlay.innerHTML =
      '<div class="am-card">'
      + '<button class="am-close" type="button" id="am-close" aria-label="Fermer">×</button>'
      + '<p class="am-t" id="am-t">Créer un compte</p>'
      + '<p class="am-s" id="am-s">Rejoins Fundamental et garde ton parcours.</p>'
      + brouillon
      + '<div class="am-tabs" role="tablist">'
      +   '<button class="am-tab" id="am-tab-login" role="tab" aria-selected="false">Se connecter</button>'
      +   '<button class="am-tab am-act" id="am-tab-signup" role="tab" aria-selected="true">Créer un compte</button>'
      + '</div>'
      + '<div class="am-msg" id="am-msg" role="alert"></div>'
      + '<div class="am-social">'
      +   '<button class="am-btn-s" type="button" id="am-google">'
      +     '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">'
      +     '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>'
      +     '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>'
      +     '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>'
      +     '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>'
      +     '</svg>Continuer avec Google</button>'
      +   '<button class="am-btn-s am-apple" type="button" id="am-apple">'
      +     '<svg width="15" height="17" viewBox="0 0 814 1000" fill="white" aria-hidden="true">'
      +     '<path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.2-117.3C46.7 763.7 0 663.2 0 566.5c0-168.2 109.4-257.5 216.7-257.5 59.3 0 108.9 38.5 146.1 38.5 35.5 0 91.2-40.8 160.8-40.8 26 0 108.2 2.6 168.4 79.1zm-90.3-199.8c28.5-35.2 49.1-84.1 49.1-133.1 0-6.4-.6-12.9-1.9-18.1-46.8 1.9-101.9 31.2-134.8 71.3-26 29.9-51.3 79.5-51.3 128.9 0 7.1.6 14.2 1.3 16.5 3.2.6 8.4 1.3 13.5 1.3 42.2 0 92.2-28.5 124.1-66.8z"/>'
      +     '</svg>Continuer avec Apple</button>'
      + '</div>'
      + '<div class="am-div">ou avec un e-mail</div>'
      + '<form class="am-f" id="am-form" novalidate>'
      +   '<div class="am-g"><label for="am-email">Adresse e-mail</label>'
      +     '<input type="email" id="am-email" placeholder="prenom@exemple.fr" autocomplete="email" required></div>'
      +   '<div class="am-g"><label for="am-pass">Mot de passe</label>'
      +     '<input type="password" id="am-pass" placeholder="••••••••" autocomplete="new-password" minlength="8" required></div>'
      +   '<div class="am-g" id="am-confirm-g"><label for="am-confirm">Confirmer le mot de passe</label>'
      +     '<input type="password" id="am-confirm" placeholder="••••••••" autocomplete="new-password"></div>'
      +   '<button class="am-go" type="submit" id="am-go"><span id="am-go-label">Créer mon compte</span>'
      +     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" '
      +     'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>'
      + '</form>'
      + '<p class="am-foot">'
      +   '<span id="am-alt-login">Déjà un compte ? <a id="am-to-login">Se connecter</a></span>'
      +   '<span id="am-alt-signup" style="display:none">Pas encore de compte ? <a id="am-to-signup">Créer un compte</a></span>'
      +   '<br>En continuant, tu acceptes nos <a href="cgu.html">CGU</a> et notre '
      +   '<a href="confidentialite.html">politique de confidentialité</a>.'
      + '</p>'
      + '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Cliquer dans le vide referme et rend la main au plan
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) fermer(); });
    overlay.querySelector('#am-close').addEventListener('click', fermer);
    overlay.querySelector('#am-tab-login').addEventListener('click', function () { poserOnglet('login'); });
    overlay.querySelector('#am-tab-signup').addEventListener('click', function () { poserOnglet('signup'); });
    overlay.querySelector('#am-to-login').addEventListener('click', function () { poserOnglet('login'); });
    overlay.querySelector('#am-to-signup').addEventListener('click', function () { poserOnglet('signup'); });
    overlay.querySelector('#am-google').addEventListener('click', google);
    overlay.querySelector('#am-apple').addEventListener('click', apple);
    overlay.querySelector('#am-form').addEventListener('submit', envoyer);
    document.addEventListener('keydown', surTouche, true);

    poserOnglet(opts.mode === 'login' ? 'login' : 'signup');
    setTimeout(function () {
      if (!overlay) return;
      var champ = overlay.querySelector('#am-email');
      if (champ) { try { champ.focus({ preventScroll: true }); } catch (e) { champ.focus(); } }
    }, 0);
  }

  window.openAuthModal = ouvrir;
  window.closeAuthModal = fermer;
  window.blocParcoursGarde = blocParcoursGarde;   // auth.html montre le même bloc
})();
