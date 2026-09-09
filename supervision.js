// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Remontée des erreurs JavaScript
//
// Jusqu'ici une erreur n'était conservée que si l'utilisateur prenait la
// peine d'envoyer un feedback juste après (feedback-widget.js la joignait
// au message). Autrement dit : on n'apprenait une casse que de la bouche
// de quelqu'un qui avait pris le temps d'écrire. La plupart partent sans
// rien dire.
//
// Ce collecteur remonte l'erreur elle-même, et rien d'autre.
//
// Trois règles qu'il ne doit jamais enfreindre :
//   1. ne jamais casser la page — tout est enveloppé, il échoue en silence ;
//   2. ne jamais envoyer de donnée personnelle — pas d'identifiant, pas de
//      valeur de formulaire, et le chemin part sans sa chaîne de requête ;
//   3. ne jamais inonder la base — une signature n'est envoyée qu'une fois
//      par session, et cinq erreurs au maximum.
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var MAX_PAR_SESSION = 5;
  var vues = {};
  var envoyees = 0;

  /* Une erreur en boucle (un setInterval qui plante) enverrait des milliers
     de lignes identiques. On regroupe sur le message et l'emplacement. */
  function signature(msg, fichier, ligne) {
    return String(msg).slice(0, 120) + '|' + String(fichier || '').split('/').pop() + ':' + (ligne || '?');
  }

  /* La famille suffit à reproduire un bug ; l'user-agent complet est un
     identifiant d'appareil à lui seul. */
  function familleNavigateur() {
    var ua = navigator.userAgent || '';
    if (/Edg\//.test(ua)) return 'Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Chrome\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua)) return 'Safari';
    return 'autre';
  }

  /* Situer le déploiement sans numéro de version dédié : la pastille de
     cache d'un actif partagé change à chaque mise en ligne. */
  function versionServie() {
    try {
      var l = document.querySelector('link[href*="theme.css?v="]');
      if (l) return (l.getAttribute('href').split('?v=')[1] || '').slice(0, 40);
    } catch (e) {}
    return null;
  }

  function contexte() {
    var ecran = null;
    try {
      if (window.S && typeof window.S.currentScreen === 'number') ecran = String(window.S.currentScreen);
    } catch (e) {}
    return {
      // pathname SEUL : une chaîne de requête peut porter un identifiant.
      chemin: location.pathname,
      brique: (document.body && document.body.dataset) ? (document.body.dataset.brickName || null) : null,
      ecran: ecran,
      theme: document.documentElement.classList.contains('dark') ? 'sombre' : 'clair',
      appareil: (window.matchMedia && window.matchMedia('(max-width: 820px)').matches) ? 'mobile' : 'desktop',
      navigateur: familleNavigateur(),
      version: versionServie()
    };
  }

  function remonter(msg, fichier, ligne, colonne, pile) {
    try {
      if (envoyees >= MAX_PAR_SESSION) return;
      if (!msg) return;

      var sig = signature(msg, fichier, ligne);
      if (vues[sig]) return;
      vues[sig] = true;
      envoyees++;

      if (typeof logJsError !== 'function') return;   // supabase.js pas chargé
      var c = contexte();
      logJsError({
        signature: sig,
        message: String(msg).slice(0, 500),
        fichier: fichier ? String(fichier).split('/').pop().slice(0, 120) : null,
        ligne: ligne || null,
        colonne: colonne || null,
        pile: pile ? String(pile).slice(0, 1500) : null,
        chemin: c.chemin, brique: c.brique, ecran: c.ecran,
        theme: c.theme, appareil: c.appareil,
        navigateur: c.navigateur, version: c.version
      });
    } catch (e) {
      /* Un collecteur d'erreurs qui lève une erreur est pire que pas de
         collecteur du tout : on avale, toujours. */
    }
  }

  window.addEventListener('error', function (e) {
    // Une ressource qui ne charge pas declenche aussi 'error', sans message :
    // ce n'est pas une exception, on la laisse au suivi reseau.
    if (!e || !e.message) return;
    remonter(e.message, e.filename, e.lineno, e.colno, e.error && e.error.stack);
  }, true);

  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    var msg = (r && r.message) ? r.message : String(r);
    remonter('promesse rejetée : ' + msg, null, null, null, r && r.stack);
  });

  // Pour la page de supervision : savoir si le collecteur est bien en place.
  window.__supervision = { version: 1, envoyees: function () { return envoyees; } };
})();
