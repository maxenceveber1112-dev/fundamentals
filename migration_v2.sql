-- ═══════════════════════════════════════════════════════════════════
-- FUNDAMENTALS — Migration v2 : enrichissement profil + brick_data
-- À coller dans : Supabase → SQL Editor → New query → Run
-- Idempotente : utilise ADD COLUMN IF NOT EXISTS partout
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- 1. PROFILES — nouveaux champs collectés via les briques
-- ───────────────────────────────────────────────────────────────────
-- Ces champs viennent enrichir le profil au fil du parcours.
-- Convention : préfixe par domaine pour éviter toute collision.

-- ── Données financières réelles (budget_base) ──
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS revenus_nets_mensuel    numeric,       -- revenu réel saisi dans la brique
  ADD COLUMN IF NOT EXISTS aides_mensuelles        numeric,       -- aides, allocations, soutien famille
  ADD COLUMN IF NOT EXISTS charges_fixes_total     numeric,       -- total charges fixes mensuelles
  ADD COLUMN IF NOT EXISTS depenses_variables_total numeric,      -- total dépenses variables mensuelles
  ADD COLUMN IF NOT EXISTS reste_a_vivre           numeric,       -- revenus - charges - dépenses variables
  ADD COLUMN IF NOT EXISTS engagement_budget       jsonb,         -- {type, label, montant, duree}
  ADD COLUMN IF NOT EXISTS abonnements_mensuel     numeric,       -- sous-total abonnements
  ADD COLUMN IF NOT EXISTS credits_mensuel         numeric;       -- sous-total crédits en cours

-- ── Découvert (gestion_decouvert) ──
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS decouvert_jours_mois    integer,       -- nb jours/mois dans le rouge
  ADD COLUMN IF NOT EXISTS decouvert_montant_max   numeric,       -- montant max du découvert
  ADD COLUMN IF NOT EXISTS decouvert_frais_type    text,          -- 'jamais'|'parfois'|'souvent'|'presque_toujours'
  ADD COLUMN IF NOT EXISTS decouvert_cout_mensuel  numeric,       -- coût estimé agios/frais par mois
  ADD COLUMN IF NOT EXISTS decouvert_plan_choisi   text,          -- 'rapide'|'progressif'
  ADD COLUMN IF NOT EXISTS decouvert_engagement_jours integer,    -- objectif nb jours max dans le rouge
  ADD COLUMN IF NOT EXISTS decouvert_alerte_seuil  numeric;       -- seuil d'alerte bancaire configuré

-- ── Paiements fractionnés (paiements_fractionnes) ──
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bnpl_mensualite_total   numeric,       -- charge mensuelle totale BNPL
  ADD COLUMN IF NOT EXISTS bnpl_engagement_count   integer,       -- nb de paiements en cours
  ADD COLUMN IF NOT EXISTS bnpl_date_liberation    date,          -- date estimée de fin du dernier paiement
  ADD COLUMN IF NOT EXISTS bnpl_strategie_choisie  text,          -- 'stop_nouveau'|'solder_prioritaire'|'noter_dashboard'
  ADD COLUMN IF NOT EXISTS bnpl_taux_effort        numeric,       -- % du revenu mensuel en BNPL

-- ── Fonds d'urgence (fonds_urgence) ──
  ADD COLUMN IF NOT EXISTS charges_vitales_total   numeric,       -- loyer + nourrit. + transport + santé + autres essentiels
  ADD COLUMN IF NOT EXISTS fonds_urgence_objectif  numeric,       -- montant cible du coussin
  ADD COLUMN IF NOT EXISTS fonds_urgence_actuel    numeric,       -- montant déjà épargné (renseigné si connu)
  ADD COLUMN IF NOT EXISTS fonds_urgence_rythme_mensuel numeric,  -- versement mensuel prévu
  ADD COLUMN IF NOT EXISTS fonds_urgence_source    text,          -- 'marge_budget'|'abonnement_revu'|'virement_auto'|'fin_mois'
  ADD COLUMN IF NOT EXISTS fonds_urgence_date_estimee date,       -- date estimée d'atteinte de l'objectif

-- ── Banque (premiers_pas_bancaires) ──
  ADD COLUMN IF NOT EXISTS banque_type             text,          -- 'neobanque'|'traditionnelle'|'postal'|'inconnu'
  ADD COLUMN IF NOT EXISTS notifications_activees  boolean,       -- a activé les notifs de paiement
  ADD COLUMN IF NOT EXISTS abonnements_verifies    boolean;       -- a vérifié ses abonnements actifs

-- ───────────────────────────────────────────────────────────────────
-- 2. BRICK_DATA — ajout d'un champ screen_courant pour la reprise
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE public.brick_data
  ADD COLUMN IF NOT EXISTS screen_courant   integer default 0,    -- dernier écran atteint (reprise)
  ADD COLUMN IF NOT EXISTS started_at       timestamptz,          -- 1ère ouverture
  ADD COLUMN IF NOT EXISTS completed_at     timestamptz;          -- date de complétion

-- Mise à jour automatique completed_at quand completed passe à true
CREATE OR REPLACE FUNCTION public.set_brick_completed_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
    NEW.completed_at = NOW();
  END IF;
  IF NEW.started_at IS NULL THEN
    NEW.started_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS brick_data_completed_at ON public.brick_data;
CREATE TRIGGER brick_data_completed_at
  BEFORE INSERT OR UPDATE ON public.brick_data
  FOR EACH ROW EXECUTE FUNCTION public.set_brick_completed_at();

-- ───────────────────────────────────────────────────────────────────
-- 3. USER_DASHBOARD — champ insights pour les recommandations futures
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE public.user_dashboard
  ADD COLUMN IF NOT EXISTS insights       jsonb default '[]'::jsonb,   -- [{id, type, titre, contenu, brique_source}]
  ADD COLUMN IF NOT EXISTS simulateurs    jsonb default '[]'::jsonb,   -- [{id, type, params}] — simulateurs débloqués
  ADD COLUMN IF NOT EXISTS score_sante    integer;                     -- score global 0–100 calculé côté serveur

-- ───────────────────────────────────────────────────────────────────
-- 4. INDEX pour les requêtes fréquentes
-- ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS brick_data_user_brick ON public.brick_data(user_id, brick_id);
CREATE INDEX IF NOT EXISTS brick_data_completed   ON public.brick_data(user_id, completed);

-- ───────────────────────────────────────────────────────────────────
-- 5. VUE : profil enrichi (onboarding + briques) — pratique pour admin
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.profil_complet AS
  SELECT
    p.*,
    u.email,
    d.briques            AS dashboard_briques,
    d.modules_completes,
    d.score_sante,
    d.derniere_activite
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN public.user_dashboard d ON d.user_id = p.id;

-- ═══════════════════════════════════════════════════════════════════
-- FIN DE LA MIGRATION v2
-- ═══════════════════════════════════════════════════════════════════
