# Fundamental

Plateforme d'éducation financière personnalisée.

## Stack
- **Frontend** : HTML/CSS/JS vanilla (pas de framework)
- **Backend** : [Supabase](https://supabase.com) (Auth + PostgreSQL + RLS)
- **Déploiement** : Netlify (depuis ce repo GitHub)

## Setup

### 1. Supabase
Applique le fichier `schema.sql` dans l'éditeur SQL de Supabase :
- Supabase Dashboard → SQL Editor → New query → coller le contenu → Run

### 2. Variables
Les clés Supabase sont dans `supabase.js`. En production, les déplacer dans des variables d'environnement Netlify.

### 3. Auth Google (optionnel)
Supabase → Authentication → Providers → Google → activer + ajouter les credentials OAuth.

## Structure
```
index.html          → Questionnaire d'onboarding (5 étapes)
plan.html           → Plan personnalisé
dashboard.html      → Dashboard progression
auth.html           → Login / Signup
shared.js           → Metadata briques, utilitaires profil, helpers
supabase.js         → Couche data (auth + CRUD Supabase)
feedback-widget.js  → Widget feedback bêta (FAB bas-droite)
brique-*.html       → Modules de formation
schema.sql          → Schéma PostgreSQL à appliquer dans Supabase
netlify.toml        → Config déploiement Netlify
```
