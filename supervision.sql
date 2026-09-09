-- ═══════════════════════════════════════════════════════════════════
-- FUNDAMENTALS — Table des erreurs JavaScript
--
-- À exécuter UNE FOIS dans l'éditeur SQL de Supabase.
-- Tant qu'elle n'existe pas, supervision.js échoue en silence : la
-- plateforme fonctionne normalement, elle ne remonte simplement rien.
--
-- Ce qui est stocké est volontairement anonyme : aucun identifiant
-- d'utilisateur, aucune valeur de formulaire, et le chemin est enregistré
-- SANS sa chaîne de requête ni son ancre. Une erreur décrit du code, pas
-- une personne.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.js_errors (
  id          bigserial primary key,
  cree_le     timestamptz not null default now(),

  -- La signature regroupe les occurrences d'un même défaut : c'est sur
  -- elle qu'on compte, pas sur les lignes.
  signature   text not null,

  message     text not null,
  fichier     text,
  ligne       int,
  colonne     int,
  pile        text,

  -- Contexte technique, sans rien de personnel.
  chemin      text,          -- pathname seul
  brique      text,          -- data-brick-name si la page en déclare une
  ecran       text,          -- index d'écran dans la brique
  theme       text,          -- clair | sombre
  appareil    text,          -- mobile | desktop
  navigateur  text,          -- famille seule, pas l'user-agent complet
  version     text           -- version d'actif servie, pour situer le déploiement
);

create index if not exists js_errors_signature_idx on public.js_errors (signature);
create index if not exists js_errors_cree_le_idx   on public.js_errors (cree_le desc);

-- ─── Politiques d'accès ────────────────────────────────────────────
alter table public.js_errors enable row level security;

-- N'importe quel visiteur peut SIGNALER une erreur : c'est le principe même
-- d'un collecteur côté navigateur, et la clé anon est publique de toute
-- façon. En revanche personne ne peut relire ni modifier quoi que ce soit
-- avec cette clé — la lecture passe par la clé de service, côté Supabase.
drop policy if exists "js_errors_insert_anon" on public.js_errors;
create policy "js_errors_insert_anon"
  on public.js_errors for insert
  to anon, authenticated
  with check (true);

-- Aucune politique de SELECT : la table est donc illisible depuis le
-- navigateur. On la consulte dans l'éditeur Supabase, ou via la page
-- supervision.html en y collant une clé de service (jamais déployée).

-- ─── Purge ─────────────────────────────────────────────────────────
-- À lancer de temps en temps, ou via un cron Supabase :
--   delete from public.js_errors where cree_le < now() - interval '90 days';
