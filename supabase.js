// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Supabase data layer
// Remplace l'ancien _STORE / localStorage / hash-encoding
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://avnxkfthqgeehcjuxoej.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KezOvtizhFonaPI1lexlJQ_xs2WhiYO';

// SDK Supabase v2 (chargé via CDN dans chaque page HTML)
// window.supabase doit être disponible avant ce script
let _sb = null;

function getClient() {
  if (_sb) return _sb;
  if (!window.supabase) {
    console.error('[Fund] Supabase SDK non chargé');
    return null;
  }
  _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'fund_auth'
    }
  });
  return _sb;
}

// ─── AUTH ──────────────────────────────────────────────────────────

async function getSession() {
  const sb = getClient(); if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data?.session || null;
}

async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

async function signInWithEmail(email, password) {
  const sb = getClient(); if (!sb) return { error: 'SDK manquant' };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { user: data?.user, session: data?.session, error: error?.message };
}

async function signUpWithEmail(email, password) {
  const sb = getClient(); if (!sb) return { error: 'SDK manquant' };
  const { data, error } = await sb.auth.signUp({ email, password });
  return { user: data?.user, error: error?.message };
}

async function signInWithGoogle() {
  const sb = getClient(); if (!sb) return;
  await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/index.html' }
  });
}

async function signOut() {
  const sb = getClient(); if (!sb) return;
  await sb.auth.signOut();
  window.location.href = 'auth.html';
}

// Redirige vers auth.html si non connecté (à appeler en haut de chaque page protégée)
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'auth.html?next=' + encodeURIComponent(window.location.pathname + window.location.search);
    return null;
  }
  return user;
}

// ─── PROFIL ────────────────────────────────────────────────────────

async function saveProfile(profileData) {
  const user = await getCurrentUser(); if (!user) return { error: 'Non connecté' };
  const sb = getClient();
  const { error } = await sb.from('profiles').upsert({
    id: user.id,
    ...profileData
  });
  if (error) console.error('[Fund] saveProfile error:', error.message, '| code:', error.code, '| details:', error.details, '| hint:', error.hint);
  return { error: error?.message };
}

async function loadProfile() {
  const user = await getCurrentUser(); if (!user) return null;
  const sb = getClient();
  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).single();
  if (error && error.code !== 'PGRST116') console.error('[Fund] loadProfile error:', error.message);
  return data || null;
}

// ─── DASHBOARD ─────────────────────────────────────────────────────

async function saveDashboard(dashData) {
  const user = await getCurrentUser(); if (!user) return { error: 'Non connecté' };
  const sb = getClient();
  const { error } = await sb.from('user_dashboard').upsert({
    user_id: user.id,
    ...dashData,
    derniere_activite: new Date().toISOString()
  }, { onConflict: 'user_id' });
  if (error) console.error('[Fund] saveDashboard error:', error.message);
  return { error: error?.message };
}

async function loadDashboard() {
  const user = await getCurrentUser(); if (!user) return null;
  const sb = getClient();
  const { data, error } = await sb.from('user_dashboard').select('*').eq('user_id', user.id).single();
  if (error && error.code !== 'PGRST116') console.error('[Fund] loadDashboard error:', error.message);
  return data || null;
}

// ─── BRICK DATA ────────────────────────────────────────────────────

async function saveBrickData(brickId, brickData, completed = false) {
  const user = await getCurrentUser(); if (!user) return { error: 'Non connecté' };
  const sb = getClient();
  const { error } = await sb.from('brick_data').upsert({
    user_id: user.id,
    brick_id: brickId,
    data: brickData,
    completed
  }, { onConflict: 'user_id,brick_id' });
  if (error) console.error('[Fund] saveBrickData error:', error.message);
  return { error: error?.message };
}

async function loadBrickData(brickId) {
  const user = await getCurrentUser(); if (!user) return null;
  const sb = getClient();
  const { data, error } = await sb.from('brick_data').select('*').eq('user_id', user.id).eq('brick_id', brickId).single();
  if (error && error.code !== 'PGRST116') console.error('[Fund] loadBrickData error:', error.message);
  return data?.data || null;
}

// ─── FEEDBACK ──────────────────────────────────────────────────────

async function submitFeedback(page, rating, message) {
  const sb = getClient(); if (!sb) return;
  const user = await getCurrentUser();
  const { error } = await sb.from('feedbacks').insert({
    user_id: user?.id || null,
    page,
    rating,
    message,
    user_agent: navigator.userAgent
  });
  if (error) console.error('[Fund] submitFeedback error:', error.message);
  return { error: error?.message };
}

// ─── COMPAT : wrappers sync pour le code existant ──────────────────
// Ces fonctions permettent de migrer progressivement sans tout casser.
// Elles font un double write : Supabase (async) + mémoire (sync).

const _MEM = {};

function saveToStorage(key, val) {
  _MEM[key] = val;
  // Async write to Supabase selon la clé
  if (key === 'fund_profil')     saveProfile(val).catch(() => {});
  if (key === 'fund_dashboard')  saveDashboard(val).catch(() => {});
}

function loadFromStorage(key) {
  return _MEM[key] || null;
}

// Charge les données depuis Supabase au démarrage de la page et remplit _MEM
async function hydrateFromSupabase() {
  const user = await getCurrentUser();
  const [profil, dash] = await Promise.all([loadProfile(), loadDashboard()]);
  if (profil) _MEM['fund_profil'] = profil;
  if (dash)   _MEM['fund_dashboard'] = dash;

  // Charger toutes les brick_data depuis Supabase
  if (user) {
    const sb = getClient();
    const { data: bricks } = await sb.from('brick_data')
      .select('brick_id, data, completed, screen_courant')
      .eq('user_id', user.id);
    if (bricks) {
      bricks.forEach(b => {
        _MEM['fund_brick_' + b.brick_id] = {
          screen: b.screen_courant || 0,
          data: b.data || {},
          completed: b.completed,
          ts: Date.now()
        };
      });
    }
  }
  return { profil, dash };
}
