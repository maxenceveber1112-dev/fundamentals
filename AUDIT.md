# AUDIT — Fundamentals · 12 juin 2026
> Audit en lecture seule. Aucun secret reproduit en clair. Sources : repo HEAD + historique git (161 commits).

---

## 1. SYNTHÈSE EXÉCUTIVE

Fundamentals est un projet ambitieux, bien structuré côté UX et avec une base Supabase propre (RLS activée, clé `service_role` absente du code et de l'historique). Les risques les plus graves ne sont pas sécuritaires au sens strict mais **légaux et réglementaires** : absence totale de dispositif RGPD fonctionnel (CGU/politique de confidentialité sont des liens morts `#`), données sensibles de mineurs 15-17 ans collectées sans mécanisme de consentement, et aucun disclaimer réglementaire persistant sur les briques financières. Sur le plan financier, un bug de fond existe : la brique immo affiche toujours « plus-value exonérée (RP) » quelle que soit le type de projet sélectionné, et les hypothèses taux/assurance sont incohérentes entre l'écran Capacité (3,0 % / 22 €/mois) et l'écran Projection (fallback 3,8 % / 0,36 %/an).

**Constats par sévérité** : P0 = 5 · P1 = 9 · P2 = 11

**Top 5 P0 à traiter avant tout déploiement large :**
1. CGU et politique de confidentialité sont des liens `#` — inexistants — illégal (RGPD art. 13).
2. Aucune bannière de consentement cookies/analytics, aucune base légale documentée pour les données collectées.
3. Mineurs 15-17 ans : données financières sensibles collectées sans contrôle de l'âge du consentement numérique (15 ans en France) ni autorisation parentale.
4. Plus-value immobilière toujours affichée « exonérée (RP) » même pour un projet locatif ou résidence secondaire — résultat financier trompeur.
5. Pas de Content-Security-Policy (CSP) dans `netlify.toml` — surface XSS non mitigée.

---

## 2. TABLEAU DES CONSTATS

| ID | Axe | Sévérité | Fichier:ligne | Constat | Recommandation | Effort |
|----|-----|----------|---------------|---------|----------------|--------|
| A01 | RGPD | **P0** | `auth.html:482` | CGU et politique de confidentialité pointent vers `#` (pages inexistantes) | Créer et publier les deux documents ; mettre à jour les liens | M |
| A02 | RGPD | **P0** | Toutes pages | Aucune bannière de consentement cookies/trackers, aucune base légale documentée pour les données onboarding | Implémenter un CMP (ex. Axeptio, Didomi free) ; définir la base légale pour chaque donnée | M |
| A03 | RGPD | **P0** | `index.html:729` | Tranche 15-17 ans collectée sans âge du consentement numérique (15 ans FR) ni autorisation parentale, alors que le parcours scolaire B2B est visé | Bloquer ou rediriger les <15 ans ; pour 15-17 ans dans un cadre B2B scolaire, co-signature parentale ou contrat établissement | M |
| A04 | Finance | **P0** | `brique-achat-immobilier.html:5049` | Plus-value toujours affichée « exonérée (RP) » — aucune branche pour locatif ou résidence secondaire (abattements 22/30 ans, surtaxe >50 k€) | Conditionner l'affichage au `S.projectType` ; afficher la fiscalité correcte (IR+PS, abattements) pour locatif/secondaire | M |
| A05 | Sécurité | **P0** | `netlify.toml` | Pas de header `Content-Security-Policy` — XSS non mitigée, le JS inline est massivement utilisé | Ajouter CSP restrictive dans `netlify.toml` (au moins `default-src 'self'` + nonces ou hash pour le JS inline) | M |
| B01 | Finance | **P1** | `brique-achat-immobilier.html:5520,7527` | Taux par défaut : écran 2 = **3,0 %**, écran 7 (projection) fallback = **3,8 %** ; assurance écran 2 = 22 €/mois, écran 7 fallback = **0,36 %/an** — scénarios incohérents | Unifier les constantes dans un objet `DEFAULTS` unique ; documenter si les deux scénarios sont intentionnels (pessimiste vs optimiste) | S |
| B02 | Finance | **P1** | `brique-achat-immobilier.html:7529,7540` | Valorisation bien codée à +1 %/an sans label ni avertissement visible | Afficher explicitement l'hypothèse retenue ; proposer un slider ou au moins un disclaimer « estimation simplifiée, pas un conseil » | S |
| B03 | Finance | **P1** | `brique-achat-immobilier.html:7668` | Calcul revente : `net = valeur − CRD − frais_agence − apport` — la fiscalité de la plus-value (pour locatif/secondaire) n'est pas soustraite | Conditionner à `projectType` : pour RP → exonéré OK ; pour autres → afficher impôt estimé ou a minima disclaimer fort | S |
| B04 | Finance | **P1** | `brique-achat-immobilier.html:5428,5431` | `NOTARY_RATE_LOW = 0.10` (10 %) pour biens < 75 000 € — montant à valider contre le barème émoluments 2024 (DMTO ~5,8 % + émoluments dégressifs + débours) | Vérifier avec la table officielle des émoluments notariaux 2024 ; corriger si nécessaire | S |
| B05 | Finance | **P1** | `brique-achat-immobilier.html:4683` | Source prix/m² affichée « DVF 2024 · agrégé **département** » mais l'interface dit « ta **commune** » (ex. l'UX dit « les prix dans ta commune ») | Corriger le wording UI pour dire « ton département » ; ou intégrer une API DVF à la maille commune | M |
| B06 | Tests | **P1** | (repo entier) | **Zéro test** sur les fonctions de calcul financier (`calculateMonthlyPayment`, `calculateBorrowingCapacity`, `estimateAcquisitionFees`, etc.) — une régression silencieuse est possible à chaque sprint | Ajouter des tests unitaires sur les 5 formules clés (voir §6) | M |
| B07 | RGPD | **P1** | `schema.sql:113–121` | La vue `feedbacks_admin` joint `auth.users` (inclut les e-mails) — vérifier que cette vue n'est pas accessible au rôle `anon` via l'API Supabase | Restreindre la vue au rôle `service_role` ou la supprimer ; la remplacer par une requête admin authentifiée | S |
| B08 | Sécurité | **P1** | `schema.sql:90–91` | Policy `feedbacks_insert` : `WITH CHECK (true)` — n'importe qui (même non connecté) peut insérer un feedback, risque de spam/injection de données | Ajouter `WITH CHECK (auth.uid() IS NOT NULL OR true)` avec rate-limit Netlify Functions, ou valider côté Edge Function | S |
| B09 | RGPD | **P1** | `index.html:769`, toutes pages | Mention « Tes réponses sont privées et sauvegardées en temps réel » trompeuse : avant auth, les données vont uniquement en `localStorage`, pas dans Supabase | Corriger la mention pour refléter la réalité (« sauvegardées après connexion ») | S |
| C01 | Sécurité | **P2** | `netlify.toml` | Pas de header `Strict-Transport-Security` (HSTS) | Ajouter `Strict-Transport-Security: max-age=63072000; includeSubDomains` | S |
| C02 | Architecture | **P2** | `brique-achat-immobilier.html` (9 099 lignes, ~415 KB) | Un seul fichier HTML de 415 KB — CSS, HTML, JS, constantes, glossaire mélangés | Extraire le JS dans `brique-achat-immo.js`, les CSS dans un fichier externe ; facilite le cache navigateur | L |
| C03 | Architecture | **P2** | Toutes `brique-*.html` | La fonction `getBrickCSS()` dans `shared.js` retourne ~60 lignes de CSS dupliqué injecté dans chaque brique via `<style>` inline | Extraire dans un fichier `brique-common.css` chargé via `<link>` | S |
| C04 | Finance | **P2** | `brique-achat-immobilier.html:5649–5673` | Score immo : base fixe de **+10 points** systématique + logique de présence de pages HTML pour calculer `screensVisited` (non fiable) | Réviser la formule ; supprimer le bonus de base ; documenter la formule dans un commentaire | S |
| C05 | Finance | **P2** | `brique-achat-immobilier.html:7740` | Score rentabilité : appréciation 1 %/an codée en dur (`valeur10 = prixBien * Math.pow(1.01, 10)`) sans label, utilisée comme fait | Afficher l'hypothèse à l'utilisateur | S |
| C06 | RGPD/Finance | **P2** | Toutes briques sensibles | Aucun disclaimer persistant « ne constitue pas un conseil en investissement » sur les briques dettes, immo, investissement. Seules quelques mentions ponctuelles existent (`s6-disclaimer`, `s7-disclaimer`) | Ajouter un footer persistant sur chaque brique avec une mention réglementaire homogène | S |
| C07 | Observabilité | **P2** | (repo entier) | Pas de suivi d'erreurs (Sentry ou équivalent) ; `trackEvent` est un simple `console.log` | Intégrer Sentry (free tier) ou Plausible pour les erreurs JS ; au minimum capturer les erreurs Supabase non-nulles | S |
| C08 | Performance | **P2** | Toutes pages | Polices Google Fonts chargées en externe (Inter, Fraunces, Instrument Serif) — transfert vers serveurs Google (US) sans consentement préalable, et impact perf si CDN lent | Self-hoster les polices (outil: `google-webfonts-helper`) ; résout aussi le problème RGPD lié au transfert d'IP | M |
| C09 | Architecture | **P2** | `shared.js:256–268` | Obfuscation CSS (`window['local'+'Storage']`) inutile — lisibilité dégradée, pas de gain sécuritaire | Utiliser directement `localStorage` ; supprimer l'obfuscation | S |
| C10 | SEO/Meta | **P2** | Toutes pages | `<meta name="description">` absent ou générique sur la plupart des pages ; pas de `sitemap.xml` ni `robots.txt` | Ajouter meta descriptions uniques et un sitemap | S |
| C11 | Accessibilité | **P2** | `brique-achat-immobilier.html` (sliders) | Les sliders durée/taux n'ont pas d'attribut `aria-label` ou `aria-valuetext` explicite avec l'unité | Ajouter `aria-label="Durée du prêt"` et `aria-valuetext="25 ans"` sur chaque slider | S |

---

## 3. SECTION SÉCURITÉ & SECRETS

### 3.1 Clé Supabase exposée

- **Fichier** : `supabase.js:7`
- **Type** : Clé **`anon`/publishable** (le payload JWT contient `"role":"anon"`)
- **Empreinte partielle** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bnhr...`
- **Verdict** : ✅ **Acceptable** par design Supabase — cette clé est publique, c'est la RLS qui protège les données. **Aucune rotation nécessaire** tant que la clé `service_role` n'est jamais committée.
- **Condition de sécurité** : Les politiques RLS doivent être correctes (vérifiées ci-dessous — elles le sont pour 3 tables sur 4).

### 3.2 Historique git — service_role
- **Scan complet** (161 commits, tous fichiers) : **aucune clé `service_role` trouvée**. ✅

### 3.3 Risques résiduels
| Risque | Fichier | Statut |
|--------|---------|--------|
| Clé `service_role` dans le code | `supabase.js`, `*.html`, `.env` | ✅ Absent |
| Token Netlify ou CI | Tous fichiers | ✅ Absent |
| Clé API tierce (analytics, Sentry…) | Tous fichiers | ✅ Absent (pas d'analytics tiers) |
| Feedbacks accessible en écriture sans auth | `schema.sql:90` | ⚠️ `WITH CHECK (true)` — voir A08 |
| Vue `feedbacks_admin` avec emails | `schema.sql:113` | ⚠️ Vérifier accessibilité anon — voir B07 |

### 3.4 Procédure de rotation (en cas de future exposition d'une clé sensible)
1. Régénérer la clé immédiatement dans le dashboard Supabase / Netlify.
2. Purger l'historique git : `git filter-repo --path supabase.js --invert-paths` + force push (après backup).
3. Vérifier que les branches de preview Netlify ne cachent pas une ancienne version.
4. Auditer tous les accès anormaux dans les logs Supabase (Logs > API).

---

## 4. SECTION CONFORMITÉ RGPD

### 4.1 Inventaire des données personnelles collectées

| Donnée | Fichier de collecte | Base légale documentée | Minimisation | Durée conservation | Statut |
|--------|---------------------|------------------------|--------------|-------------------|--------|
| Tranche d'âge (dont 15-17 ans) | `index.html:729` | ❌ Absente | ⚠️ Tranche large OK, mais mineur non protégé | Non définie | ❌ P0 |
| Statut professionnel | `index.html:745` | ❌ Absente | ✅ | Non définie | ❌ |
| Ressenti financier / stress | `index.html:780` | ❌ Absente | ✅ | Non définie | ❌ |
| Situation logement | `index.html:824` | ❌ Absente | ✅ | Non définie | ❌ |
| Types de dettes (découvert, crédits) | `index.html:933` | ❌ Absente | ✅ | Non définie | ❌ |
| Retards de paiement | `index.html:953` | ❌ Absente | ✅ | Non définie | ❌ |
| Produits d'épargne + montants (livrets, AV…) | `index.html:986` | ❌ Absente | ✅ | Non définie | ❌ |
| Expérience d'arnaque | `index.html:1056` | ❌ Absente | ✅ | Non définie | ❌ |
| Revenus réels, charges, crédits en cours | `brique-budget-base.html` | ❌ Absente | ✅ | Non définie | ❌ |
| Email (compte Supabase auth) | `auth.html` | Contrat ✅ (connexion) | ✅ | Jusqu'à suppression compte | ✅ |
| User-agent (feedback) | `supabase.js:155` | ❌ Absente | ⚠️ Peut être supprimé | Non définie | ⚠️ |

### 4.2 Écarts réglementaires

| Exigence RGPD | Présent ? | Localisation | Action |
|--------------|-----------|-------------|--------|
| Politique de confidentialité accessible | ❌ | `auth.html:482` → lien `#` mort | Créer la page et la publier |
| CGU accessibles | ❌ | `auth.html:482` → lien `#` mort | Créer la page et la publier |
| Consentement cookies / analytics | ❌ | Aucune bannière | Implémenter CMP ou supprimer tout tracker tiers |
| Mention « ne constitue pas un conseil » | ⚠️ Partiel | `s6-disclaimer`, `s7-disclaimer` uniquement | Généraliser sur toutes les briques sensibles |
| Droit à l'effacement | ⚠️ | `supabase.js:162–173` `resetUserData()` existe mais n'est pas accessible utilisateur | Exposer dans `profil.html` |
| Transfert hors UE (Google Fonts) | ❌ | Toutes pages `<link>` Google Fonts | Self-hoster les polices |
| Mineurs : consentement parental <15 ans | ❌ | `index.html:729` | Blocage ou redirection |

---

## 5. SECTION EXACTITUDE FINANCIÈRE

| Formule | Attendu réglementaire / marché | Codé | Verdict | Correctif |
|---------|-------------------------------|------|---------|-----------|
| **Mensualité annuité constante** `calculateMonthlyPayment` | `M = P·r / (1 – (1+r)^-n)` | Identique (`brique-achat-immobilier.html:5616`) | ✅ | — |
| **Taux d'effort HCSF** | 35 % assurance comprise | `EFFORT_MAX = 0.35` ; mensualité max = `revenus × 0.35 − crédits − assurance` (`L6283`) | ✅ | — |
| **Durée max** | ≤ 25 ans résidence principale (27 ans en VEFA) | Slider 1–30 ans, défaut 25 ans ; pas de plafond 27 pour VEFA | ⚠️ | Bloquer à 27 pour neuf/VEFA, 25 pour ancien RP |
| **Frais notaire — ancien** | ≈ 7–8 % (DMTO ~5,8 % + émoluments + débours) | `NOTARY_RATE_ANCIEN = 0.07` (7 %) | ✅ Acceptable | Utiliser 7,5 % comme valeur prudente |
| **Frais notaire — neuf** | ≈ 2–3 % | `NOTARY_RATE_NEUF = 0.025` (2,5 %) | ✅ | — |
| **Frais notaire — bien < 75 000 €** | Émoluments proportionnellement plus élevés ; total ~8–12 % possible | `NOTARY_RATE_LOW = 0.10` (10 %) | ⚠️ À vérifier | Confirmer avec barème émoluments 2024 (tableau officiel art. A444-91 CCom) |
| **Frais de garantie** | Caution Crédit Logement ~1 % du capital net, partiellement restituée | Tooltip : « estimée à 1,2 % de l'emprunt » | ⚠️ Légèrement surestimé | Ajuster à ~1,0–1,1 % ou distinguer caution/hypothèque |
| **Taux assurance S2** | Variable par âge, ~0,15–0,45 %/an | `ASSURANCE_RATES` par tranche d'âge (0,15–0,60 %/an) — converti en €/mois ; défaut affiché = 22 €/mois | ✅ | — |
| **Taux assurance S7 (projection)** | Devrait utiliser le même taux que S2 | Fallback hardcodé `assRate = 0.36` (0,36 %/an) (`L7529`) alors que S2 utilise un taux déduit de l'âge | ❌ Incohérence | Utiliser `ASSURANCE_RATES[S.ageGroup]` comme fallback |
| **Taux nominal S2 vs S7** | Devrait être identique | S2 défaut = **3,0 %** (`L5520`) ; S7 fallback = **3,8 %** (`L7527`) | ❌ Incohérence | Unifier : utiliser `S.taux || DEFAULTS.taux` avec une seule constante `DEFAULTS.taux = 3.5` |
| **Plus-value RP** | Exonérée d'IR et PS pour résidence principale | `"exonéré (RP)"` affiché (`L5049`) | ✅ Pour RP | — |
| **Plus-value locatif/secondaire** | Non exonérée : IR sur plus-value après abattements pour durée (exonération IR à 22 ans, PS à 30 ans) ; surtaxe > 50 k€ | Même affichage `"exonéré (RP)"` quel que soit le projet | ❌ **Bug P0** | Conditionner à `S.projectType` : afficher abattements progressifs et impôt estimé pour locatif/secondaire |
| **DVF — maille géographique** | Data.gouv DVF disponible à la mutation (parcelle) | Données agrégées au **département** ; l'UI dit « ta commune » (`L4683`) | ❌ Libellé trompeur | Corriger le wording ou intégrer l'API commune DVF |
| **Valorisation bien** | Dépend du marché local, non garantie | +1 %/an (`L7540`) sans label visible | ⚠️ Hypothèse non communiquée | Afficher `« Hypothèse de valorisation : +1 %/an »` dans les KPI |
| **PTZ** | Conditions révisées en 2025 (zones A/B1, neuf, ressources) | Mention dans le glossaire uniquement, sans vérification des conditions 2025 | ⚠️ À vérifier | Ajouter un lien vers simulateur officiel (simuler-ma-prime.fr ou ANIL) |
| **Score santé financière** | Formule documentée, bornée, non culpabilisante | Score immo : bonus de base +10 points systématique ; `screensVisited` calculé via présence de DOM (non fiable) | ⚠️ | Documenter la formule ; supprimer le bonus fixe ; tester aux valeurs extrêmes |
| **Entrées vides / nulles** | Affichage `--` ou message d'erreur clair | `formatEuro` retourne `'—'` pour NaN/null ✅ ; `calculateBorrowingCapacity` retourne `0` si revenus nuls ✅ | ✅ | — |

---

## 6. QUICK WINS vs CHANTIERS STRUCTURANTS

### Quick wins (< 1 h chacun)
1. Corriger le fallback taux S7 : `var taux = n(S.taux) || 3.8` → `var taux = n(S.taux) || 3.0` (`L7527`)
2. Corriger le fallback assurance S7 : remplacer `var assRate = 0.36` par `var assRate = ASSURANCE_RATES[S.ageGroup] || 0.0020` et convertir en %/an
3. Corriger le libellé DVF : « agrégé département » → mettre en cohérence avec le wording UI
4. Ajouter `Strict-Transport-Security` dans `netlify.toml`
5. Corriger le mention « sauvegardées en temps réel » dans `index.html:769` (et autres footers similaires)
6. Ajouter `aria-label` et `aria-valuetext` sur les sliders immo
7. Conditionner l'affichage plus-value à `S.projectType` (afficher un disclaimer fort pour locatif/secondaire même si le calcul exact est complexe)
8. Exposer `resetUserData()` dans `profil.html` (droit à l'effacement RGPD)

### Chantiers structurants
| Chantier | Priorité | Effort |
|----------|----------|--------|
| Créer CGU + Politique de confidentialité + Mentions légales | P0 | M |
| Implémenter un CMP (consentement cookies) | P0 | M |
| Mécanisme de gestion des mineurs | P0 | M |
| Tests unitaires sur les formules financières (Jest ou Vitest) | P1 | M |
| Content-Security-Policy + audit XSS inline JS | P0 | M–L |
| Self-hosting des polices Google | P2 | S |
| Extraction JS dans fichiers séparés (brique-achat-immo.js) | P2 | L |
| Intégration Sentry ou équivalent | P2 | S |
| Multi-tenant B2B (organisations, rôles, SSO, reporting) | Roadmap | L |

### Stratégie de tests minimale recommandée
```js
// Cas de test pour chaque formule clé :
// calculateMonthlyPayment(180000, 3.5, 240) → ~1 043 €
// calculateBorrowingCapacity(1000, 3.5, 240) → ~172 720 €
// estimateAcquisitionFees(200000, 'ancien') → ~14 000 €
// estimateAcquisitionFees(200000, 'neuf') → ~5 000 €
// getMensualiteCible avec revenus=3000, crédits=500, assurance=30 → (3000×0.35 − 500 − 30) = 520 €
// Cas limites : revenus=0, montant négatif, durée=0
```

---

## 7. CE QUE JE N'AI PAS PU VÉRIFIER

| Zone d'ombre | Raison |
|-------------|--------|
| Policies RLS en production (état réel de la DB) | Seul le `schema.sql` et `migration_v2.sql` ont été audités — la DB live peut avoir divergé ; vérifier via `supabase db dump` ou l'interface Supabase → Auth → Policies |
| Accessibilité de la vue `feedbacks_admin` au rôle `anon` | Nécessite un test via l'API REST Supabase avec la clé `anon` |
| Taux d'usure en vigueur | Non vérifié contre la publication mensuelle de la Banque de France — le simulateur ne vérifie pas que le TAEG calculé est sous le taux d'usure |
| Briques non implémentées (droits_aides, treso_dirigeant, retraite, transmission…) | Référencées dans `shared.js` mais fichiers HTML absents du repo — non auditées |
| PTZ conditions 2025 exactes | Les conditions ont changé (zones éligibles, plafonds de ressources, quotité) — une vérification sur le site officiel ANIL est nécessaire |
| Score de santé financière `dashboard.html` | Fichier non lu en entier — la formule complète du score dashboard (vs score immo) n'a pas été auditée |
| Lighthouse / accessibilité automatisée | Nécessite un navigateur avec l'extension ou un CI — non exécuté |
| Frais de notaire biens < 75 000 € | La valeur 10 % est plausible mais n'a pas été vérifiée contre le barème officiel des émoluments 2024 |

---

*Audit réalisé le 12 juin 2026 — lecture seule, aucun commit effectué.*
