// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — ÉCRAN DE CHARGEMENT (contrôleur)
//
// À charger juste APRÈS le markup de l'écran, pas en bas du <body> :
// les minuteries doivent partir au plus tôt.
//
// Trois seuils :
//     200 ms   la marque apparaît. En dessous, l'utilisateur n'aura vu
//              qu'un fond uni : pas de logo qui clignote sur une
//              connexion rapide.
//   2 500 ms   un mot d'attente, parce qu'à ce stade le silence inquiète.
//   8 000 ms   l'échec. On rend la main. Sans cette porte, un appel
//              réseau qui ne répond jamais laisserait l'utilisateur
//              devant un écran figé, sans recours.
//
// Le voile est opaque : tout ce fichier est écrit pour qu'il ne puisse
// PAS rester collé. Quatre sorties indépendantes :
//   1. finChargement(), appelé par la page quand son contenu est prêt ;
//   2. la porte de secours à 8 s, avec ses deux boutons ;
//   3. une erreur JavaScript non rattrapée lève l'écran immédiatement —
//      une page à moitié rendue vaut mieux qu'un voile opaque ;
//   4. si ce fichier ne tourne jamais, une animation CSS de 12 s le
//      retire (voir chargement.css). C'est pour cela qu'on pose .ec-js
//      en tout premier : tant que le script est vivant, c'est lui qui
//      décide, pas le filet.
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  var ec = document.getElementById('ec-chargement');
  if (!ec) return;

  // Le script a la main : on désarme le filet CSS de 12 s.
  ec.classList.add('ec-js');

  var T_MARQUE   = 200;
  var T_PATIENCE = 2500;
  var T_ECHEC    = 8000;

  var mot = ec.querySelector('.ec-mot');
  var minuteries = [];
  var fini = false;

  function plusTard(ms, f) { minuteries.push(setTimeout(f, ms)); }

  plusTard(T_MARQUE, function () {
    ec.classList.add('ec-visible');
  });

  plusTard(T_PATIENCE, function () {
    if (!mot) return;
    mot.textContent = 'On récupère ta progression…';
    mot.classList.add('on');
  });

  plusTard(T_ECHEC, function () {
    ec.classList.add('ec-echec');
    if (!mot) return;
    mot.textContent = 'La connexion met plus de temps que prévu. '
                    + 'Tes données sont en sécurité : rien n’est perdu.';
    mot.classList.add('on');
  });

  var bReessayer = ec.querySelector('.ec-reessayer');
  var bForcer    = ec.querySelector('.ec-forcer');
  if (bReessayer) bReessayer.addEventListener('click', function () { location.reload(); });
  if (bForcer)    bForcer.addEventListener('click',    function () { terminer(); });

  // Une erreur non rattrapée quelque part dans la page signifie que
  // l'init n'ira probablement jamais au bout : mieux vaut montrer ce qui
  // a pu être rendu que garder le voile.
  window.addEventListener('error', function () { terminer(); });
  window.addEventListener('unhandledrejection', function () { terminer(); });

  function terminer() {
    if (fini) return;
    fini = true;
    minuteries.forEach(clearTimeout);
    ec.classList.add('ec-parti');
    ec.setAttribute('aria-busy', 'false');
    setTimeout(function () { ec.hidden = true; }, 380);
  }

  // Appelé par chaque page quand son contenu est en place.
  window.finChargement = terminer;

  // Branché sur la promesse de l'init de chaque page :
  //     (async function init() { … })().then(window.finChargementSi,
  //                                          window.finChargementSi);
  //
  // On accroche la PROMESSE plutôt que d'ajouter un appel à la fin du
  // corps de la fonction : une init peut sortir par un `return` anticipé
  // à mi-chemin, et cet appel-là ne serait jamais atteint — l'écran
  // resterait collé jusqu'à la porte de secours.
  //
  // Seule exception : une init qui renvoie `false` déclare qu'une
  // REDIRECTION est en cours (pas de session). On garde alors le voile,
  // qui couvre la navigation au lieu de laisser voir un instant la page
  // vide qu'on est justement en train de quitter.
  //
  // En cas de rejet, l'argument reçu est l'erreur — donc jamais `false` :
  // l'écran se lève, ce qui est le bon comportement.
  //
  // Les pages écrivent `window.finChargementSi` et non l'identifiant nu :
  // si ce fichier n'a pas pu être chargé, on obtient `undefined`, que
  // `.then()` ignore sans broncher, au lieu d'une ReferenceError.
  window.finChargementSi = function (resultat) {
    if (resultat !== false) terminer();
  };
})();
