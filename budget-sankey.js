// ═══════════════════════════════════════════════════════════════
// FUNDAMENTALS — Moteur Sankey budget générique (hiérarchique)
// Consomme un modèle { income:[...], outflows:[...] } et rend un SVG.
// Chaque item peut avoir des children (1 niveau) -> Sankey multi-colonnes.
//   Revenus (sources[/sous-sources]) -> Budget -> Catégories[/sous-cat.]
// Utilisé par simulateur-budget.html (modes Guidé et Libre).
// API : renderBudgetSankey(model, isDark) -> { html, viewBox }
//       downloadBudgetSankeyPNG(svgEl, { isDark, title })
// ═══════════════════════════════════════════════════════════════
(function () {
  'use strict';

  function fmtK(v) { return v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' k€' : Math.round(v) + ' €'; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function r(v) { return Math.round(v * 10) / 10; }

  // Normalise un côté : calcule val (= somme des enfants si présents), filtre val>0
  function norm(items) {
    return (items || []).map(function (it) {
      var children = (it.children && it.children.length)
        ? it.children.map(function (c) { return { name: c.name || 'Sous-poste', val: +c.val || 0, color: c.color }; }).filter(function (c) { return c.val > 0; })
        : null;
      if (children && !children.length) children = null;
      var val = children ? children.reduce(function (s, c) { return s + c.val; }, 0) : (+it.val || 0);
      return { name: it.name || 'Poste', val: val, color: it.color, kind: it.kind, children: children };
    }).filter(function (it) { return it.val > 0; });
  }

  function renderBudgetSankey(model, isDark, opts) {
    opts = opts || {};
    var income = norm(model.income);
    var outflows = norm(model.outflows);
    var totalInc = income.reduce(function (s, i) { return s + i.val; }, 0);
    if (totalInc <= 0) return null;

    var normalOut = outflows.filter(function (o) { return o.kind !== 'epargne' && o.kind !== 'reste'; });
    var specialOut = outflows.filter(function (o) { return o.kind === 'epargne' || o.kind === 'reste'; });
    var orderedOut = normalOut.concat(specialOut);

    var incomeHasChildren = income.some(function (i) { return i.children; });
    var expenseHasChildren = normalOut.some(function (o) { return o.children; });

    var violetP = ['#7C3AED', '#8B5CF6', '#A78BFA', '#9333EA', '#A855F7', '#C084FC', '#6D28D9'];
    var indigoP = ['#6366F1', '#818CF8', '#4F46E5', '#4338CA', '#A5B4FC'];
    var greenP = ['#16A34A', '#4ADE80', '#22C55E'];
    var cBudget = '#8B93B8';
    var cEp = '#22C55E';
    var cReste = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.08)';
    var cResteDot = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.32)';
    var sep = isDark ? '#161824' : '#ffffff';
    var tc = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
    var pillBg = isDark ? 'rgba(28,28,46,0.97)' : '#ffffff';
    var pillBd = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)';
    var pillTx = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.80)';
    var lead = isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.22)';

    income.forEach(function (it, i) { if (!it.color) it.color = greenP[i % greenP.length]; if (it.children) it.children.forEach(function (c, j) { if (!c.color) c.color = greenP[(i + j) % greenP.length]; }); });
    normalOut.forEach(function (it, i) { var pal = (i % 2 === 0) ? violetP : indigoP; if (!it.color) it.color = pal[i % pal.length]; if (it.children) it.children.forEach(function (c, j) { if (!c.color) c.color = pal[(j + 1) % pal.length]; }); });
    specialOut.forEach(function (it) { if (it.kind === 'epargne') { it.color = cEp; it.dot = cEp; } else { it.color = cReste; it.dot = cResteDot; } });

    // ── Géométrie (paramétrable pour l'aération) ──
    var barW = opts.barW || 26;
    var catGap = (opts.catGap != null) ? opts.catGap : 0;   // espace entre catégories/sources
    var gapCol = opts.gapCol || 20;                          // espace avant épargne/reste
    var H_BASE = opts.H_BASE || 320;
    var innerGap = opts.innerGap || 150;                     // espace entre colonnes
    var bands = !!opts.bands;                                // bandes de fond colorées par catégorie
    var TOP_PAD = 34, BOT_PAD = 22, dy = TOP_PAD;
    var hasGap = specialOut.length > 0 && normalOut.length > 0;

    var LPz = 150, RPz = 150;
    var nIncomeCols = incomeHasChildren ? 2 : 1;
    var nExpenseCols = expenseHasChildren ? 2 : 1;
    var nMid = nIncomeCols + 1 + nExpenseCols;
    var W = LPz + nMid * barW + (nMid - 1) * innerGap + RPz;

    var xs = [], xcur = LPz;
    for (var ci = 0; ci < nMid; ci++) { xs.push(xcur); xcur += barW + innerGap; }
    var idx = 0;
    var xIncLeaf = incomeHasChildren ? xs[idx++] : null;
    var xIncGroup = xs[idx++];
    var xBudget = xs[idx++];
    var xExpGroup = xs[idx++];
    var xExpLeaf = expenseHasChildren ? xs[idx++] : null;

    function ribbon(xa, y0t, y0b, xb, y1t, y1b, fill, op) {
      var mx = (xa + xb) / 2;
      return '<path d="M' + r(xa) + ',' + r(y0t) + ' C' + r(mx) + ',' + r(y0t) + ' ' + r(mx) + ',' + r(y1t) + ' ' + r(xb) + ',' + r(y1t) +
        ' L' + r(xb) + ',' + r(y1b) + ' C' + r(mx) + ',' + r(y1b) + ' ' + r(mx) + ',' + r(y0b) + ' ' + r(xa) + ',' + r(y0b) + ' Z" fill="' + fill + '" opacity="' + op + '"/>';
    }
    function bar(x, y, h, color) {
      return '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + barW + '" height="' + r(Math.max(0, h)) + '" rx="3" fill="' + color + '" stroke="' + sep + '" stroke-width="0.75"/>';
    }
    function title(x, t) { return '<text x="' + r(x) + '" y="' + r(dy - 13) + '" text-anchor="middle" font-size="12" font-family="Inter,system-ui,sans-serif" font-weight="700" letter-spacing="0.05em" fill="' + tc + '">' + t + '</text>'; }
    function pillW(label) { return Math.round(label.length * 5.95 + 26); }
    function pill(x, ly, label, color) {
      var w = pillW(label);
      return '<rect x="' + r(x) + '" y="' + r(ly - 8.5) + '" width="' + w + '" height="17" rx="8.5" fill="' + pillBg + '" stroke="' + pillBd + '" stroke-width="1"/>' +
        '<circle cx="' + r(x + 10) + '" cy="' + r(ly) + '" r="3.2" fill="' + color + '"/>' +
        '<text x="' + r(x + 19) + '" y="' + r(ly + 3.6) + '" text-anchor="start" font-size="11" font-family="Inter,system-ui,sans-serif" font-weight="500" fill="' + pillTx + '">' + label + '</text>';
    }
    function labels(nodes, edgeX, anchorX, side, HH) {
      var minGap = 19, top = dy + 2, bot = dy + HH - 9;
      var a = nodes.map(function (z) { return { yc: z.yc, name: z.name, val: z.val, color: z.dot || z.color, ly: z.yc }; });
      a.sort(function (u, v) { return u.yc - v.yc; });
      for (var i = 1; i < a.length; i++) { if (a[i].ly - a[i - 1].ly < minGap) a[i].ly = a[i - 1].ly + minGap; }
      if (a.length && a[a.length - 1].ly > bot) { a[a.length - 1].ly = bot; for (var j = a.length - 2; j >= 0; j--) { if (a[j].ly > a[j + 1].ly - minGap) a[j].ly = a[j + 1].ly - minGap; } }
      if (a.length && a[0].ly < top) { a[0].ly = top; for (var k = 1; k < a.length; k++) { if (a[k].ly < a[k - 1].ly + minGap) a[k].ly = a[k - 1].ly + minGap; } }
      var right = side === 'right', out = '';
      a.forEach(function (z) {
        var label = esc(z.name) + ' : ' + fmtK(z.val);
        var w = pillW(label);
        var pillL = right ? anchorX : anchorX - w;
        var leadEnd = right ? pillL - 4 : pillL + w + 4;
        out += '<path d="M' + r(edgeX) + ',' + r(z.yc) + ' L' + r(leadEnd) + ',' + r(z.ly) + '" fill="none" stroke="' + lead + '" stroke-width="0.75"/>';
        out += pill(pillL, z.ly, label, z.color);
      });
      return out;
    }

    var html = '';

    // ── Positions avec espacement (catGap) ──
    var y = dy, incGroupPos = [];
    income.forEach(function (it, i) { if (i > 0) y += catGap; var h = it.val / totalInc * H_BASE; incGroupPos.push({ it: it, y0: y, y1: y + h }); y += h; });
    var incBottom = y;

    y = dy; var outGroupPos = [];
    normalOut.forEach(function (it, i) { if (i > 0) y += catGap; var h = it.val / totalInc * H_BASE; outGroupPos.push({ it: it, y0: y, y1: y + h }); y += h; });
    if (specialOut.length) { y += (hasGap ? gapCol : catGap); }
    specialOut.forEach(function (it, i) { if (i > 0) y += catGap; var h = it.val / totalInc * H_BASE; outGroupPos.push({ it: it, y0: y, y1: y + h }); y += h; });
    var outBottom = y;

    var H = Math.max(incBottom, outBottom, dy + H_BASE) - dy;

    // ── Bandes de fond par catégorie (option) ──
    if (bands && expenseHasChildren) {
      outGroupPos.forEach(function (g) {
        if (!g.it.children) return;
        var pad = catGap > 0 ? catGap / 2 - 1 : 3;
        html += '<rect x="' + r(xExpGroup - 8) + '" y="' + r(g.y0 - pad) + '" width="' + r((xExpLeaf + barW) - (xExpGroup - 8) + 8) + '" height="' + r((g.y1 - g.y0) + pad * 2) + '" rx="10" fill="' + g.it.color + '" opacity="0.06"/>';
      });
    }

    // ── Rubans income leaf -> group ──
    if (incomeHasChildren) {
      incGroupPos.forEach(function (g) {
        var cy = g.y0; var kids = g.it.children || [{ name: g.it.name, val: g.it.val, color: g.it.color }];
        kids.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); html += ribbon(xIncLeaf + barW, cy, cy + h, xIncGroup, cy, cy + h, c.color, 0.12); cy += h; });
      });
    }
    // ── Rubans income group -> budget (budget contigu) ──
    var bl = dy;
    incGroupPos.forEach(function (g) { var h = g.it.val / totalInc * H_BASE; html += ribbon(xIncGroup + barW, g.y0, g.y1, xBudget, bl, bl + h, g.it.color, 0.12); bl += h; });
    // ── Rubans budget -> outflow (budget contigu ; direct vers feuille si sans enfant) ──
    var br = dy;
    outGroupPos.forEach(function (g) { var h = g.it.val / totalInc * H_BASE; var tx = (expenseHasChildren && !g.it.children) ? xExpLeaf : xExpGroup; html += ribbon(xBudget + barW, br, br + h, tx, g.y0, g.y1, g.it.color, 0.12); br += h; });
    // ── Rubans outflow group -> leaf ──
    if (expenseHasChildren) {
      outGroupPos.forEach(function (g) {
        if (!g.it.children) return;
        var cy = g.y0;
        g.it.children.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); html += ribbon(xExpGroup + barW, cy, cy + h, xExpLeaf, cy, cy + h, c.color, 0.12); cy += h; });
      });
    }

    // ── Barres ──
    if (incomeHasChildren) {
      incGroupPos.forEach(function (g) { var cy = g.y0; var kids = g.it.children || [{ name: g.it.name, val: g.it.val, color: g.it.color }]; kids.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); html += bar(xIncLeaf, cy, h, c.color); cy += h; }); });
    }
    incGroupPos.forEach(function (g) { html += bar(xIncGroup, g.y0, g.y1 - g.y0, g.it.color); });
    html += '<rect x="' + r(xBudget) + '" y="' + r(dy) + '" width="' + barW + '" height="' + r(H_BASE) + '" rx="4" fill="' + cBudget + '"/>';
    if (expenseHasChildren) {
      outGroupPos.forEach(function (g) {
        if (g.it.children) {
          html += bar(xExpGroup, g.y0, g.y1 - g.y0, g.it.color);
          var cy = g.y0;
          g.it.children.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); html += bar(xExpLeaf, cy, h, c.color); cy += h; });
        } else {
          html += bar(xExpLeaf, g.y0, g.y1 - g.y0, g.it.color);
        }
      });
    } else {
      outGroupPos.forEach(function (g) { html += bar(xExpGroup, g.y0, g.y1 - g.y0, g.it.color); });
    }

    // ── Titres ──
    if (incomeHasChildren) html += title(xIncLeaf + barW / 2, 'DÉTAIL');
    html += title(xIncGroup + barW / 2, 'REVENUS');
    html += title(xBudget + barW / 2, 'BUDGET');
    html += title(xExpGroup + barW / 2, expenseHasChildren ? 'CATÉGORIES' : 'RÉPARTITION');
    if (expenseHasChildren) html += title(xExpLeaf + barW / 2, 'DÉTAIL');

    // ── Étiquettes ──
    var incLeafNodes = [];
    if (incomeHasChildren) {
      incGroupPos.forEach(function (g) { var cy = g.y0; var kids = g.it.children || [{ name: g.it.name, val: g.it.val, color: g.it.color }]; kids.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); incLeafNodes.push({ yc: cy + h / 2, name: c.name, val: c.val, color: c.color }); cy += h; }); });
      html += labels(incLeafNodes, xIncLeaf, xIncLeaf - 16, 'left', H);
    } else {
      incGroupPos.forEach(function (g) { incLeafNodes.push({ yc: (g.y0 + g.y1) / 2, name: g.it.name, val: g.it.val, color: g.it.color }); });
      html += labels(incLeafNodes, xIncGroup, xIncGroup - 16, 'left', H);
    }
    (function () { var label = 'Budget : ' + fmtK(totalInc); var w = pillW(label); html += pill(xBudget + barW / 2 - w / 2, dy + H_BASE / 2, label, cBudget); })();
    if (expenseHasChildren) {
      var catNodes = outGroupPos.filter(function (g) { return g.it.children; }).map(function (g) { return { yc: (g.y0 + g.y1) / 2, name: g.it.name, val: g.it.val, color: g.it.color }; });
      html += labels(catNodes, xExpGroup + barW, xExpGroup + barW + 16, 'right', H);
      var leafNodes = [];
      outGroupPos.forEach(function (g) {
        if (g.it.children) { var cy = g.y0; g.it.children.forEach(function (c) { var h = c.val / g.it.val * (g.y1 - g.y0); leafNodes.push({ yc: cy + h / 2, name: c.name, val: c.val, color: c.color }); cy += h; }); }
        else { leafNodes.push({ yc: (g.y0 + g.y1) / 2, name: g.it.name, val: g.it.val, color: g.it.dot || g.it.color }); }
      });
      html += labels(leafNodes, xExpLeaf + barW, xExpLeaf + barW + 16, 'right', H);
    } else {
      var expNodes = outGroupPos.map(function (g) { return { yc: (g.y0 + g.y1) / 2, name: g.it.name, val: g.it.val, color: g.it.dot || g.it.color }; });
      html += labels(expNodes, xExpGroup + barW, xExpGroup + barW + 16, 'right', H);
    }

    return { html: html, viewBox: '0 0 ' + W + ' ' + r(dy + H + BOT_PAD), W: W, H: r(dy + H + BOT_PAD) };
  }

  // ── Export PNG ──
  function downloadBudgetSankeyPNG(svgEl, opts) {
    opts = opts || {};
    if (!svgEl) return;
    var isDark = opts.isDark || document.documentElement.classList.contains('dark');
    var vb = (svgEl.getAttribute('viewBox') || '0 0 800 400').split(/\s+/).map(Number);
    var W = vb[2], H = vb[3];
    var bg = isDark ? '#12121f' : '#ffffff';
    var fg = isDark ? '#f5f5fa' : '#1a1a2e';
    var sub = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
    var pad = 30, headerH = 56, footerH = 36, scale = 2;
    var outW = W + pad * 2, outH = H + pad * 2 + headerH + footerH;
    var title = opts.title || 'Mon budget';
    var wrap = '<svg xmlns="http://www.w3.org/2000/svg" width="' + outW + '" height="' + outH + '" viewBox="0 0 ' + outW + ' ' + outH + '">' +
      '<rect width="' + outW + '" height="' + outH + '" fill="' + bg + '"/>' +
      '<text x="' + pad + '" y="' + (pad + 18) + '" font-family="Georgia,serif" font-style="italic" font-size="23" fill="' + fg + '">' + esc(title) + '</text>' +
      '<text x="' + (outW - pad) + '" y="' + (pad + 17) + '" text-anchor="end" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="' + sub + '">Fundamental</text>' +
      '<g transform="translate(' + pad + ',' + (pad + headerH) + ')">' + svgEl.innerHTML + '</g>' +
      '<text x="' + pad + '" y="' + (outH - pad + 2) + '" font-family="Inter,sans-serif" font-size="11" fill="' + sub + '">Simulateur de budget · fundamentals-beta.netlify.app</text>' +
      '</svg>';
    var url = URL.createObjectURL(new Blob([wrap], { type: 'image/svg+xml;charset=utf-8' }));
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement('canvas'); canvas.width = outW * scale; canvas.height = outH * scale;
      var ctx = canvas.getContext('2d'); ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (png) {
        if (!png) return;
        var a = document.createElement('a'); var dl = URL.createObjectURL(png);
        a.href = dl; a.download = 'mon-budget.png'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(dl); }, 1500);
      }, 'image/png');
    };
    img.onerror = function () { URL.revokeObjectURL(url); };
    img.src = url;
  }

  window.renderBudgetSankey = renderBudgetSankey;
  window.downloadBudgetSankeyPNG = downloadBudgetSankeyPNG;
})();
