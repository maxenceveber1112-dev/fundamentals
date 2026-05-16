-- ═══════════════════════════════════════════════════════════
-- FUNDAMENTALS — Schéma Supabase
-- À coller dans : Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════

-- 1. PROFILES ─────────────────────────────────────────────
-- Stocke les réponses du questionnaire d'onboarding
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  age_group     text,
  status_pro    text,
  revenu_sentiment text,
  stress_budget integer,
  logement_situation text,
  logement_projet    text,
  objectifs     text[],       -- array de clés ex: ['stabiliser_budget','acheter_logement']
  dettes_types  text[],
  retards_paiement text,
  produits_detenu  text[],
  confort_numerique text,
  fraude_experience text,
  urgence_principale text,
  briques_recommandees text[],
  montant_livrets     numeric,
  montant_assurance_vie numeric,
  epargne_liquide_total numeric,
  completed_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. USER_DASHBOARD ───────────────────────────────────────
-- Stocke la progression globale (briques + engagements + streak)
create table if not exists public.user_dashboard (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade unique,
  briques       jsonb default '[]'::jsonb,   -- [{id, statut, progression}]
  brique_active_id text,
  engagements   jsonb default '[]'::jsonb,
  streak        integer default 0,
  modules_completes integer default 0,
  derniere_activite timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 3. BRICK_DATA ───────────────────────────────────────────
-- Stocke les données collectées dans chaque brique (budget, matelas, etc.)
create table if not exists public.brick_data (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  brick_id      text not null,              -- ex: 'budget_base'
  data          jsonb default '{}'::jsonb,  -- données spécifiques à la brique
  completed     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(user_id, brick_id)
);

-- 4. FEEDBACKS ────────────────────────────────────────────
-- Feedback bêta testeurs (mode bêta)
create table if not exists public.feedbacks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  page          text not null,       -- ex: 'index', 'plan', 'brique-budget-base'
  rating        integer,             -- 1-5
  message       text,
  user_agent    text,
  created_at    timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.user_dashboard  enable row level security;
alter table public.brick_data      enable row level security;
alter table public.feedbacks       enable row level security;

-- Profiles : chaque utilisateur voit et modifie uniquement son profil
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- Dashboard : idem
create policy "dashboard_own" on public.user_dashboard
  for all using (auth.uid() = user_id);

-- Brick data : idem
create policy "brick_data_own" on public.brick_data
  for all using (auth.uid() = user_id);

-- Feedbacks : tout utilisateur peut insérer, seulement lire les siens
create policy "feedbacks_insert" on public.feedbacks
  for insert with check (true);
create policy "feedbacks_own_read" on public.feedbacks
  for select using (auth.uid() = user_id);

-- ── TRIGGERS updated_at ──────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger dashboard_updated_at
  before update on public.user_dashboard
  for each row execute function public.set_updated_at();

create trigger brick_data_updated_at
  before update on public.brick_data
  for each row execute function public.set_updated_at();

-- ── VUE ADMIN (feedbacks centralisés) ────────────────────
-- Accessible depuis le dashboard Supabase ou un futur admin panel
create or replace view public.feedbacks_admin as
  select
    f.id, f.page, f.rating, f.message, f.created_at,
    u.email as user_email
  from public.feedbacks f
  left join auth.users u on u.id = f.user_id
  order by f.created_at desc;
