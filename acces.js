// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — LIEN D'ÉVITEMENT
//
// Chaque page porte une barre latérale. Sans ce lien, une personne qui
// navigue au clavier doit la traverser entièrement, à chaque page, avant
// d'atteindre le contenu. C'est le critère WCAG 2.4.1 (« contourner des
// blocs »), de niveau A.
//
// POURQUOI UN SCRIPT PLUTÔT QU'UNE ANCRE ÉCRITE EN DUR.
// Huit pages ont un <main>, onze n'en ont pas — leur contenu vit dans un
// conteneur au nom différent selon la page. Écrire une ancre à la main
// dans dix-neuf fichiers aurait voulu dire toucher à la structure de
// chacun, pour un gain identique et un risque bien plus grand. Ici, le
// script cherche le contenu principal et lui pose l'ancre ; la structure
// des pages n'est pas modifiée.
//
// SI LE SCRIPT NE TOURNE PAS, le lien n'est simplement pas inséré : rien
// n'est cassé, on retrouve l'état d'avant.
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  function contenuPrincipal() {
    // Par ordre de fiabilité décroissante.
    var candidats = [
      'main',
      '[role="main"]',
      '.page-wrap',          // pages légales
      '.brick-container',    // briques
      '.onb-body',           // onboarding
      '.sim-wrap', '.sb-wrap'
    ];
    for (var i = 0; i < candidats.length; i++) {
      var el = document.querySelector(candidats[i]);
      if (el) return el;
    }
    return null;
  }

  function poser() {
    var cible = contenuPrincipal();
    if (!cible) return;

    if (!cible.id) cible.id = 'contenu-principal';
    // tabindex="-1" : sans lui, le focus ne se déplace pas réellement sur
    // un conteneur non focalisable, et le lecteur d'écran continue de
    // lire la navigation.
    if (!cible.hasAttribute('tabindex')) cible.setAttribute('tabindex', '-1');

    var style = document.createElement('style');
    style.textContent =
      '.f-skip{position:absolute;left:0.5rem;top:0.5rem;z-index:2147483001;' +
      'transform:translateY(-160%);transition:transform .16s ease;' +
      'background:var(--accent-strong,#5B21B6);color:var(--bg,#fff);' +
      'font:600 0.875rem/1 var(--font-body,Inter,system-ui,sans-serif);' +
      'padding:0.7rem 1.05rem;border-radius:0.6rem;text-decoration:none;' +
      'box-shadow:0 6px 20px rgba(20,20,30,.22)}' +
      /* Il n'apparaît qu'au focus clavier : invisible à la souris, donc
         aucun changement pour le parcours voyant habituel. */
      '.f-skip:focus{transform:translateY(0);outline:2px solid var(--text,#1C1917);outline-offset:2px}' +
      '@media (prefers-reduced-motion: reduce){.f-skip{transition:none}}' +
      '#' + cible.id + ':focus{outline:none}';
    document.head.appendChild(style);

    var lien = document.createElement('a');
    lien.className = 'f-skip';
    lien.href = '#' + cible.id;
    lien.textContent = 'Aller au contenu';
    lien.addEventListener('click', function (e) {
      e.preventDefault();
      cible.focus();
      cible.scrollIntoView({ block: 'start' });
    });
    document.body.insertBefore(lien, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poser);
  } else {
    poser();
  }
})();
