// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Logique de thème unifiée (toggle + migration + système)
// Convention : mode clair par défaut, <html class="dark"> pour le sombre.
// Clé localStorage canonique : 'fundamental-theme' = 'light' | 'dark'.
// L'APPLICATION initiale de la classe est faite par un bootstrap inline
// (anti-FOUC) en haut du <head>. Ce fichier gère le toggle et le système.
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var KEY = 'fundamental-theme';

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  // Applique un thème ('light' | 'dark') et le mémorise.
  function setTheme(theme) {
    var dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
    // Met à jour les éventuels boutons de bascule
    document.querySelectorAll('[data-theme-toggle], #theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(dark));
    });
  }

  // Bascule clair <-> sombre (exposé globalement pour les pages qui le veulent)
  function toggleTheme() {
    setTheme(isDark() ? 'light' : 'dark');
  }
  window.toggleTheme = toggleTheme;
  window.setTheme = setTheme;

  // NB : on NE câble PAS automatiquement les boutons — chaque page conserve
  // son propre handler de bascule (pour éviter un double-toggle). Les handlers
  // doivent simplement utiliser la convention canonique (.dark + clé ci-dessus)
  // ou appeler window.toggleTheme().

  // Suit le thème système tant qu'aucun choix manuel n'a été mémorisé
  function watchSystem() {
    if (!window.matchMedia) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var handler = function (e) {
      var stored = null;
      try { stored = localStorage.getItem(KEY); } catch (err) {}
      if (stored === 'light' || stored === 'dark') return; // choix manuel : on n'écrase pas
      document.documentElement.classList.toggle('dark', e.matches);
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchSystem);
  } else {
    watchSystem();
  }
})();
