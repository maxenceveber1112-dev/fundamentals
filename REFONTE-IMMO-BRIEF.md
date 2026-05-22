# Refonte brique immo — Brief de référence

> Décisions actées avec le user le 21/05/2026.
> Source de vérité unique pour tous les commits de la refonte.

## Vision globale

**Ambition** : refonte totale UI + UX + data. Pas d'AB testing, on tape direct dans `main` après validation visuelle de chaque mockup.

**Workflow** : mockup local → validation user → intégration dans `brique-achat-immobilier.html` → push `main` → Netlify auto.

**Principes** :
- Aligné DA brique fonds d'urgence (tokens, couleurs, typographies)
- 3 familles couleurs max (drop teal/cyan + ambre des cards actuelles)
- Light mode 100% fonctionnel (vs cosmétique actuel — 205 hardcodings dark à migrer)

---

## Parcours final — 8 screens (linéaire pédagogique)

| Screen | Rôle | Notes |
|---|---|---|
| **S0** | Intro + cross-brique check | Bandeau si fonds d'urgence non validé OU budget vide |
| **S1** | Type projet (RP / Locatif / Secondaire) | **Pas de géo ici** — décision actée |
| **S2** | Capacité d'emprunt — enveloppe abstraite | 3 maisons-boucliers DTI Prudent/Réaliste/Ambitieux |
| **S3** | Apport disponible | 3 maisons-boucliers compact dans header |
| **S4** | Vrais coûts (notaire, agence, garantie, travaux) | 3 maisons-boucliers compact dans header |
| **S5** | **NOUVEAU — Confrontation au réel** | Inputs commune + typologie → maisons se réincarnent |
| **S6** | Locatif (conditionnel sur S1=locatif) ou Stratégie d'achat (RP/secondaire) | Toggle dead-end actuel à refondre |
| **S7** | Les étapes (10 étapes / 4 phases) | Refonte timeline horizontale |
| **S8** | Diagnostic final + PDF | Hero diagnostic avec maisons-boucliers en grand |

---

## Maisons-boucliers — Vision A linéaire en 3 temps

### Temps 1 — Enveloppe pure (S2 → S4)
3 maisons identiques en typologie, différentes en montant :
- **Prudent** (vert émeraude) — DTI 30%, marge confort
- **Réaliste** (violet, mis en avant, badge RECOMMANDÉ) — DTI 33%, cible HCSF
- **Ambitieux** (orange ambre) — DTI 40%, plafond HCSF

Affichage : prix d'achat max + DTI + mensualité + barre confort.

### Temps 2 — Réincarnation (S5)
Les **mêmes** 3 maisons se transforment en 3 typologies/surfaces dans la zone choisie :
- Maison 1 = ce que l'enveloppe Prudent permet d'acheter dans la zone (ex: T2 38m² Nancy)
- Maison 2 = ce que l'enveloppe Réaliste permet (ex: T2 45m² Nancy)
- Maison 3 = ce que l'enveloppe Ambitieux permet (ex: T3 55m² Nancy)

Verdict honnête : "Ton enveloppe permet [X]" ou "Pour ce que tu vises, il te manque [Y k€]".

### Inputs S5 — confrontation
- **Commune** (autocomplétion `api-adresse.data.gouv.fr` — gratuit gouvernement)
- **Typologie souhaitée** (Studio/T1/T2/T3/T4+/Maison — 6 chips visuelles)
- ~~Surface minimale~~ : abandonné, on calcule la surface possible à partir de l'enveloppe + prix m²

### Source données DVF
**Décision tech à trancher** : tester `api.cquest.org/dvf` vs `app.dvf.etalab.gouv.fr` sur 2-3 communes (Lunéville, Nancy, Paris) lors du commit dédié. Critères : stabilité + couverture + temps de réponse. Décision en temps voulu.

Fallback : saisie manuelle "prix au m² cible" si pas de données.

---

## Sidebar v2 — Hybride

**Décision actée** : arbre de décision en haut + mini-dashboard live en bas.

### Zone haut — Arbre de décision (60% hauteur)
6 nœuds verticaux, position actuelle highlighted, nœuds passés en ✓ :
1. Projet (S1)
2. Capacité (S2)
3. Apport (S3)
4. Coûts (S4)
5. Confrontation (S5)
6. Étapes & Diagnostic (S6-S7-S8)

### Zone bas — Mini-dashboard live (40% hauteur)
3 chiffres-clés qui se MAJ en temps réel :
- Capacité mensuelle max (€/mois)
- Prix bien max (k€)
- Apport disponible (k€)

Note importante : les 3 maisons-boucliers restent dans le **screen principal**, PAS dans la sidebar.

---

## Cross-brique avec fonds d'urgence

**Décision actée** : hydratation passive + notification non bloquante.

### S0 — Détection au lancement
- Lit `localStorage.fund_profil` et `localStorage.fund_emergency_validated`
- Si fonds d'urgence validé → bandeau positif : *"Précaution validée : 9 000 € sécurisés ✓"*
- Si fonds d'urgence OU budget non rempli → bandeau warning non-bloquant : *"On recommande de valider ton fonds d'urgence avant"* + CTA discret

### S2 — Hydratation auto
- Pré-remplit revenus / charges depuis `fund_profil`
- Fix bug actuel : S2 affiche 0€ alors que le profil contient les données

### Stockage cross-brique
- `localStorage.fund_immo_state` mis à jour à chaque transition

---

## Plan des commits

| # | Nom | Contenu | Statut |
|---|---|---|---|
| **1** | Fondations DA + Sidebar v2 | 205 hardcodings → tokens, light mode, sidebar arbre+dashboard, ShieldStack header | EN COURS |
| **2** | Cross-brique + bugs P0 | S0 détection fonds d'urgence, S2 hydratation, renumérotation screens | À venir |
| **3** | Refonte S0 + S1 + S2 | Hero épuré, project-type-cards harmonisées, capacité avec 3 maisons-boucliers (Variante A — pleine taille) | À venir |
| **4** | Refonte S3 + S4 | Apport slider, coûts en 4 cards thématiques, 3 maisons en header compact (Variante B) | À venir |
| **5** | NOUVEAU S5 + refonte S6 | Inputs commune + typologie + intégration DVF + réincarnation maisons. Refonte S6 (locatif enrichi ou stratégie selon S1) | À venir |
| **6** | Refonte S7 + S8 + polish | Timeline horizontale, diagnostic hero avec maisons-boucliers grand (Variante C), PDF redesigné, fix label intersect fonds d'urgence | À venir |

---

## Décisions tranchées en cours de session

| # | Question | Décision |
|---|---|---|
| 1 | Ambition | Refonte totale UI + UX + data |
| 2 | S5/S6 | Garder S5 (étape locatif conditionnelle, à enrichir). Pas de fusion. |
| 3 | Sidebar | Arbre haut + dashboard bas |
| 4 | Cross-brique | Hydratation passive + notification |
| 5 | Workflow | Mockup → validation → intégration directe `main` (pas de branche) |
| 6 | Ordre parcours | Capacité d'abord (S2), confrontation réelle au S5 (Vision A linéaire) |
| 7 | Maisons-boucliers | 3 niveaux DTI puis réincarnation au S5 (PAS d'hybride A→C) |
| 8 | Géo | Tardive — déclaration au S5, pas au S1 |
| 9 | Inputs S5 | Commune (api-adresse.data.gouv.fr) + Typologie. Pas de surface min. |
| 10 | DVF | Décision tech au moment du commit 5 (test 2 endpoints) |

---

## Fichiers de référence

- **Brique immo prod** : `/home/user/workspace/fundamentals/brique-achat-immobilier.html` (6133 lignes)
- **Brique fonds d'urgence (référence DA)** : `/home/user/workspace/fundamentals/brique-fonds-urgence.html`
- **Mockup maisons-boucliers (validé conceptuellement)** : `/home/user/workspace/mockup-boucliers-logements/index.html`
- **Repo** : https://github.com/maxenceveber1112-dev/fundamentals
- **Prod** : https://fundamentals-beta.netlify.app/brique-achat-immobilier.html
