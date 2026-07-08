# AUDIT-LOCATIF.md — Brique « Investissement locatif » (vérification code)

> **Méthode** : audit **lecture seule** du code réel (`brique-immo-locatif.html`, `dashboard.html`, `shared.js`, `index.html`, `supabase.js`, `netlify.toml`), en recoupant chaque constat de la revue externe avec les `fichier:ligne`. Aucune modification, aucun commit, aucun push.
> **État du code audité** : commit `c216c37` (après fine-tuning locatif). Plusieurs constats de la revue externe (faite sur le rendu prod) sont **déjà corrigés** ; d'autres sont **bien réels** ; LOC-01 est **nuancé**.
> **Secrets** : aucune clé réimprimée. `service_role` = **0 occurrence** côté client (vérifié) ; seule la clé `anon` (publique par design) est présente.

---

## 1. Synthèse (10 lignes)

La brique est **fonctionnellement saine** (navigation, score, persistance OK, 0 erreur console) et son adaptation locatif est **réelle là où ça compte** (projet figé locatif, écran 6 always-on, score Rentabilité/Financement/Tension/Risque, comparatif « Locatif vs placement », rawData enrichie, carte dashboard). La revue externe vise juste sur les **biais de calcul de `recalcLocatif`** : le rendement est calculé sur un **loyer charges comprises** et un **dénominateur = prix seul** → rendement et cashflow **surévalués**. Les **libellés DVF** sont contradictoires (commune/département, moyen/médian). Des **résidus « résidence principale »** subsistent (PTZ, primo, « mensualité propriétaire »). En revanche : la **plus-value** est en fait **branchée sur le type de projet** (taxable pour le locatif) — le « exonéré (RP) » vu en prod est le **défaut HTML** affiché quand la projection ne se construit pas (pas de prix). L'incohérence de taux 3,0/3,8 est **quasi résolue** (résidu de fallback). Le RGPD mineurs (age-gate), la bannière cookies et les CGU/confidentialité **existent déjà**.

### Top priorités (re-priorisées après vérification code)
1. **LOC-02 + LOC-03 (P1)** — `recalcLocatif` : loyer charges comprises + dénominateur prix seul → rendement/cashflow gonflés. *Le vrai sujet d'exactitude.*
2. **LOC-05 (P1)** — jeux de charges **incohérents** entre l'écran rentabilité et le comparatif ; assurance **emprunteur** (coût de financement) mélangée aux charges d'exploitation.
3. **CROSS-02 (P1)** — libellés DVF contradictoires (maille + agrégat).
4. **LOC-01 (P1, ex-P0)** — logique plus-value **correcte** (taxable) mais **défaut HTML « exonéré (RP) »** affiché tant que la projection ne tourne pas ; fiscalité fine (surtaxe >50 k€, LMNP/LF2025) non gérée (disclaimer présent).
5. **LOC-06 (P2)** — résidus PTZ/primo (copy trompeuse en locatif ; pas d'injection d'aide automatique).

---

## 2. Tableau des constats (vérifiés)

| ID | Axe | Sév. | Fichier:ligne | Verdict | Constat / Reco | Effort |
|----|-----|------|---------------|---------|----------------|--------|
| LOC-02 | Calcul | P1 | `brique-immo-locatif.html:4729,6916,6921` | ❌ confirmé | Loyer « charges comprises » utilisé brut au numérateur → libeller/collecter **loyer hors charges récupérables** | S |
| LOC-03 | Calcul | P1 | `:6921` | ❌ confirmé | `rendNet = (loyer*12 − charges) / prixBien` → diviser par le **coût total** (prix+notaire+frais+travaux) | S |
| LOC-05 | Calcul | P1 | `:6920` vs `:8030-8040` | ⚠️ partiel | Charges nettes ≠ charges du comparatif ; **assurance emprunteur** (financement) incluse dans le rendement net ; « assurance habitation » (étape 4) à renommer **PNO** | M |
| LOC-04 | Calcul | P1 | `:5689` (`getApportMobilisable`), capacité sans loyer | ⚠️ confirmé | Capacité principale **ignore** les loyers ; seule la *capacité résiduelle* réintègre 70 %. Le prix max n'intègre pas les loyers pondérés → budget potentiellement sous-estimé | L |
| LOC-01 | Fiscalité | P1 | `:4988` (défaut), `:7588-7605` (logique), `:7432` (early-return) | ⚠️ nuancé | Logique **correcte** (locatif→taxable 19 %+17,2 %, abatt. 22/30 ans). MAIS défaut HTML `exonéré (RP)` persiste si projection non construite. Fiscalité fine (surtaxe, LMNP LF2025) non chiffrée (disclaimer OK) | S→L |
| CROSS-02 | Donnée | P1 | `:4633,4636,4644,4662,4719,5139,5140,5436,6815,7824` | ❌ confirmé | « ce département » / « cette commune » / « SUR TA COMMUNE » + « prix moyen » vs « médians » → **une maille + un agrégat** uniques | M |
| CROSS-01 | Cohérence | P2 | `:7434` (3.0 ✅), `:7998` (3.0 ✅), `:5654` (`||3.8` résiduel) | ✅ quasi résolu | Projection et comparatif en **3,0 %** ; reste un fallback `|| 3.8` dans `getMensReelle` (rarement atteint car `S.taux` défaut 3,0) → aligner à 3,0 | XS |
| LOC-06 | Logique/Copy | P2 | `:4100-4101,4394,5556-5558,7105` | ⚠️ confirmé | Primo/PTZ = résidus RP (PTZ ne finance pas le locatif). **Pas** d'injection auto d'aide (`aideFamille` = champ libre). Retirer la mention PTZ + le step primo de la timeline | S |
| LOC-11 | Copy | P2 | `:4582` | ❌ confirmé | « Mensualité **propriétaire** » + ton apport « ne vide pas ta sécurité » calibré RP → reformuler investisseur (levier) | S |
| LOC-DEAD | Qualité | P2 | `:6713-6725` | ❌ trouvé | Cluster **mort** `initInvestment/toggleInvestment/updateInvestment` référence `$('toggle-invest')` inexistant. `initInvestment` jamais appelé → pas de crash, mais à supprimer | XS |
| LOC-07 | UX | P2 | `:5207` | ✅ ok | « Lancer le parcours (bientôt) » a déjà `pointer-events:none` + `title` → non cliquable. RAS (cosmétique) | — |
| LOC-08 | UX | P2 | `:5211-5212,7873-7874` | ⚠️ mineur | `reco-next` `--` hydraté en S8 ; masquer tant que non calculé | XS |
| LOC-10 | UX | P2 | `:4859,6952` | ⚠️ mineur | Pill « ✓ Autofinancé » = valeur **par défaut** du HTML (dans la result-grid, masquée en empty-state) ; neutraliser le défaut | XS |
| LOC-12 | Logique | P2 | `:5641-5645` (notaire neuf/ancien ✅) | ⚠️ partiel | **Neuf/ancien pilote bien** le notaire (2,5 % vs 7 %). **Nue/meublée** = pédagogique seulement (fiscalité légère) → assumer ou brancher un calcul | M |
| ONB-02 | Copy | P2 | `index.html:881` | ⚠️ reclassé | `Sélectionne jusqu'à <span id=cnt-obj>0</span> / 3` : `0` = **compteur live** (0 sélectionné), pas un max=0. Phrasing confus → « 0 / 3 sélectionnés » | XS |
| ONB-01 | RGPD | — | `index.html` (age-gate), `cookie-banner.js`, `cgu.html`, `confidentialite.html` | ✅ traité | Age-gate 15-17 (consentement parental), bannière cookies, CGU + politique **présents** (travail antérieur). Reste : base légale/registre = tâche **juridique**, pas code | — |
| CROSS-03 | Conformité | P2 | `cgu.html`, disclaimers par écran | ⚠️ partiel | « Pas de conseil réglementé » présent en CGU + disclaimers ponctuels ; à rendre **persistant global** | S |
| SEC-01 | Sécurité | ✅ | `supabase.js` (clé `anon`), `netlify.toml` (CSP/HSTS) | ✅ ok | `service_role` **0 occurrence** client ; CSP+HSTS posés. RLS à confirmer côté Supabase (hors repo) | — |

Légende effort : XS (<15 min) · S (<1 h) · M (≈ ½ j) · L (≥ 1 j).

---

## 3. Exactitude financière — par formule

### Plus-value (LOC-01) — `:7588-7605`
- **Attendu (locatif)** : taxable 19 % IR + 17,2 % PS, abattements (exo IR 22 ans, PS 30 ans), surtaxe >50 k€, LMNP : réintégration amortissements (LF2025).
- **Codé** : `isLocatif = projectType==='investissement_locatif'` → `pvText = 'taxable · 19 % IR + 17,2 % PS · abattements dès 6 ans'` (≥22 ans : exo IR ; ≥30 : exo IR+PS).
- **Verdict** : ✅ **logique correcte** pour le seuil principal. ❌ **défaut HTML** `:4988 = exonéré (RP)` affiché si `s7BuildProjection` sort en `:7432` (pas d'emprunt). ⚠️ surtaxe + LMNP **non chiffrés** (couvert par disclaimer « à vérifier avec un CGP »).
- **Correctif** : (1) défaut HTML → neutre/taxable ; (2) appeler `s7UpdateRevente` à l'entrée S7 même sans prix ; (3) passe 2 : surtaxe + LMNP.

### Rendement (LOC-02, LOC-03) — `:6909-6922`
- **Attendu** : brut = loyer **hors charges** × 12 / prix ; net = (loyer net − taxe − PNO − gestion − entretien − vacance) / **coût total**.
- **Codé** : `loyer` = saisie « charges comprises » (`:4729`) ; `rendBrut = (loyer*12)/prixBien` ; `rendNet = ((loyer*12) − chargesAnnuelles)/prixBien`.
- **Verdict** : ❌ numérateur = loyer **CC** (gonfle) ; ❌ dénominateur = **prix seul** (gonfle le net). Vacance et PNO/gestion bien déduites côté net.
- **Correctif** : numérateur loyer **hors charges récupérables** ; dénominateur **coût total** (prix + `estimateAcquisitionFees` + frais + travaux).

### Cashflow (LOC-05) — `:6908-6912`
- **Codé** : `charges = mensualité + assuranceEmprunteur + PNO + chargesLoc + gestion + taxe/12` ; `cashFlow = loyerEffectif − charges`.
- **Verdict** : ✅ structure correcte. ⚠️ **incohérence** : le rendement **net** (`:6920`) inclut l'**assurance emprunteur** (un coût de **financement**, pas une charge d'exploitation) et **n'inclut pas** l'entretien, alors que le comparatif `s8BuildVsRent` utilise **1,5 %/an d'entretien** sans l'assurance emprunteur. Deux jeux de charges différents pour le même bien.
- **Correctif** : définir **un** jeu de charges d'exploitation (PNO, gestion, taxe, entretien, vacance) réutilisé partout ; sortir l'assurance emprunteur du **rendement** (la garder dans le **cashflow**, car c'est un flux).

### Capacité d'emprunt (LOC-04) — `:5689`, capacité résiduelle `:7010-7024`
- **Codé** : capacité = `calculateBorrowingCapacity(getMensualiteCible(), …)` **sans loyer** ; capacité **résiduelle** (séparée) réintègre `loyer*0,70`.
- **Verdict** : ⚠️ conforme à l'intention « 70 % à l'étape rentabilité », mais pour **financer ce bien**, les 70 % devraient qualifier **ce** prêt → budget potentiellement sous-estimé.
- **Correctif** : proposer une capacité « avec loyer pondéré » dès l'étape 2/4, ou expliciter que le prix max est **hors loyer**.

### Score /100 (item 10) — `:5594-5619` (`calculateRealEstateScore`) + `:7667-7727` (`s8CalcSubscores`)
- **Codé** : moyenne pondérée (rentabilité 35 %, financement 25 %, tension 20 %, risque 20 %) ; chaque sous-score borné `Math.min(100, …)` ; rentabilité branchée sur `S.rendementNet`/`S.cashFlow`.
- **Verdict** : ✅ **documenté, borné, défendable**. ⚠️ hérite des biais LOC-02/03 (la rentabilité surévaluée gonfle le score). Comportement extrême OK (valeurs nulles → bases, pas de NaN car `n()` partout).

---

## 4. Liaison data + flux

**Sources** : `init()` (`:8383+`) lit `fund_profil`, `fund_brick_budget_base`, `fund_brick_fonds_urgence` → préremplit revenus/charges/crédits/épargne. Réutilisation interne : `S.taxeFonciere` (étape 4) relue en étape 6 (`:6899`). Persistance : `saveToStorage('fund_brick_immo_locatif', rawData)` (mémoire `_STORE` + Supabase via `hydrateFromSupabase`). État = `localStorage`/mémoire **et** Supabase.

```
[Onboarding index.html] --profil--> Supabase(profiles) + _STORE(fund_profil)
        | computeBriques() --> briques_recommandees (immo_locatif si produit/objectif)
        v
[Dashboard] renderParcoursVie() --> carte "Investir dans le locatif"
            renderMesBriques()  --> carte "Investissement locatif" (si data)
        ^                                   |
        | rawData {project, financing,      | clic
        |  investment{rendement,cashflow,   v
        |  capResid,locationType}, scores}  [brique-immo-locatif]
        |                                     init(): prefill budget+épargne
        +------- saveToStorage('fund_brick_immo_locatif') <-- validerEtDashboard()
```

**Réponses aux DATA-xx**
- DATA-01 (override budget) : les saisies écrivent dans `S.*` local, pas dans `fund_brick_budget_base` → **isolé** (à confirmer côté Supabase pour l'écriture). ✅ probable.
- DATA-02 (prix max avec loyer) : ❌ non (cf. LOC-04).
- DATA-03 (double-comptage) : ⚠️ jeux de charges divergents (cf. LOC-05).
- DATA-04 (loyer hors charges) : ❌ non (cf. LOC-02).
- DATA-05 (neuf/ancien, nu/meublé) : ✅ neuf/ancien pilote le notaire ; ⚠️ nu/meublé décoratif (calcul).
- DATA-06 (persistance/échec réseau) : `saveToStorage` écrit en mémoire **puis** Supabase async ; **pas de gestion d'échec visible** côté UX → à durcir.
- DATA-07 (PDF) : généré **côté client** (`buildPDFContent` + `window.print()`), aucune donnée envoyée à un tiers. ✅
- DATA-08 (robustesse) : `n()` neutralise NaN ; `prixBien || 1` évite la division par zéro (`:6915`) ✅ ; badge « Autofinancé » par défaut à neutraliser (LOC-10).

---

## 5. Parcours utilisateur (réflexion)

- **Cohérence inter-briques (risque #1)** : `brique-achat-immobilier` et `brique-immo-locatif` **dupliquent** la logique de calcul (capacité, notaire, taxe, score). Un même utilisateur peut voir des **chiffres différents** selon la brique. CROSS-01 (taux) est quasi aligné, mais **structurellement** la dette demeure : il faut un **module de calcul + constantes partagé** (`immo-core.js`) importé par les deux briques. C'est la recommandation la plus importante.
- **Charge cognitive (8 étapes)** : décrochage probable aux étapes 4 (coût réel, dense) et 5 (commune/typologies). Le « montants approximatifs » est tenu (préremplissage + champs facultatifs). Piste : fusionner 3+4 (apport+coût) ou rendre l'étape 5 optionnelle.
- **Routage** : `computeBriques()` ne recommande `immo_locatif` que si l'utilisateur **détient déjà du locatif** ou a un **objectif d'investissement** → un profil **précaire/à découvert** n'est **pas** poussé prématurément vers le locatif. ✅ bonne protection. (La brique reste accessible en exploration.)
- **Next best action** : `recommendNextBrick()` renvoie budget/fonds d'urgence si bases non posées → cohérent. Si la brique n'est pas finie, le dashboard n'affiche pas la carte métriques (condition sur données) — pas de faux positif.
- **États vides / première fois** : beaucoup de `--` à froid ; compréhensible mais terne. Masquer les blocs non hydratés améliorerait la première impression.
- **Reprise/sauvegarde** : autosave par écran (`autosaveBrickProgress`) + hydratation Supabase → reprise possible ; vérifier le comportement hors-ligne.
- **Confiance/cadre** : ton non-culpabilisant tenu ; disclaimers présents ; à rendre **persistants**.
- **Mobile** : sliders + cards + tableau de diagnostic + comparatif 2 colonnes → à tester réellement < 380 px (le comparatif risque de serrer).

### 5 améliorations priorisées (impact / effort)
1. **Module immo partagé** (`immo-core.js`) — supprime la divergence de chiffres. *Impact ✦✦✦ / Effort L*
2. **Corriger rendement** (loyer hors charges + coût total) — exactitude. *✦✦✦ / S*
3. **Un seul jeu de charges** réutilisé écran 6 + comparatif. *✦✦ / M*
4. **Unifier libellés DVF** (maille + médiane partout). *✦✦ / M*
5. **Nettoyer résidus RP** (PTZ/primo/« propriétaire ») + défaut plus-value + code mort. *✦✦ / S*

---

## 6. Sécurité & conformité (secrets masqués)

- `service_role` : **0 occurrence** côté client. Seule la clé `anon` (publique par design) est dans `supabase.js`. ✅
- Headers : **CSP + HSTS** présents (`netlify.toml`). ✅
- RGPD : **age-gate 15-17** (consentement parental), **bannière cookies**, **CGU** + **politique de confidentialité** présents. ✅ Reste (hors code) : base légale documentée, durée de conservation, registre des traitements.
- RLS / policies Supabase : **non auditable dans ce repo** (côté projet Supabase) → à confirmer (cf. §7).
- « Pas de conseil réglementé » : présent (CGU) ; à rendre **persistant global**.

---

## 7. Ce que je n'ai pas pu vérifier (hors repo / hors lecture statique)

- **Supabase** : RLS/policies par table, schéma réel des écritures `brick_data`, comportement en **échec réseau** au save.
- **Historique git** : scan secrets (`gitleaks`/`trufflehog`) non lancé ici.
- **Accessibilité réelle** : contraste AA (pastel/crème), navigation clavier des sliders/cards, ARIA des tooltips, `reduced-motion`, responsive < 380 px.
- **Performance** : Lighthouse, poids JS/polices, cache headers.
- **Tests** : **aucun test** sur les fonctions de calcul → proposer une suite minimale (cas de référence par formule : rendement brut/net, cashflow, capacité, plus-value, score) avant de corriger LOC-02/03/05 (éviter les régressions).

---

> **Rappel** : audit en lecture seule, **rien n'a été modifié/commité/poussé**. Aucune règle fiscale n'a été inventée ; les points incertains (surtaxe, LMNP, dates HCSF/PTZ) sont marqués « à vérifier ».
