// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Supabase data layer
// Remplace l'ancien _STORE / localStorage / hash-encoding
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://avnxkfthqgeehcjuxoej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bnhrZnRocWdlZWhjanV4b2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjUyMTgsImV4cCI6MjA5MzY0MTIxOH0.q_Tdnum6_i88oVprOmxfIflCHnM_jz8iwCRNKV70sqE';

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
  clearAnonDraft();   // navigateur partagé : aucun résidu d'essai
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

async function submitFeedback(page, rating, message, meta) {
  const sb = getClient(); if (!sb) return;
  const user = await getCurrentUser();
  meta = meta || {};
  const { error } = await sb.from('feedbacks').insert({
    user_id: user?.id || null,
    page,
    rating,
    message,
    user_agent: navigator.userAgent,
    theme: meta.theme || null,
    device: meta.device || null,
    screen: meta.screen || null,
    path: meta.path || null,
    console_error: meta.consoleError || null
  });
  if (error) console.error('[Fund] submitFeedback error:', error.message);
  return { error: error?.message };
}

// ─── RESET ─────────────────────────────────────────────────────────
async function resetUserData() {
  const user = await getCurrentUser();
  if (!user) return;
  const sb = getClient();
  await sb.from('user_dashboard').delete().eq('user_id', user.id);
  await sb.from('brick_data').delete().eq('user_id', user.id);
  await sb.from('profiles').delete().eq('id', user.id);
  Object.keys(_MEM).forEach(function(k) { delete _MEM[k]; });
  // Nettoyer aussi les flags localStorage/sessionStorage liés au profil
  try { localStorage.removeItem('welcome_modal_seen'); } catch(e) {}
  try { sessionStorage.removeItem('_wm_shown'); sessionStorage.removeItem('_tour_shown'); } catch(e) {}
}

// ─── COMPAT : wrappers sync pour le code existant ──────────────────
// Ces fonctions permettent de migrer progressivement sans tout casser.
// Elles font un double write : Supabase (async) + mémoire (sync).

const _MEM = {};

// ─── BROUILLON ANONYME ─────────────────────────────────────────────
// Sans session, Supabase refuse d'écrire et _MEM est vidé à chaque
// navigation : le travail d'un visiteur non connecté serait perdu.
// On le persiste donc en local, sous des clés préfixées, strictement
// cloisonnées des données d'un compte.
//
// Avec session : comportement inchangé (mémoire + Supabase, aucune
// écriture locale). C'est ce cloisonnement qui garantit qu'un essai
// anonyme ne peut pas contaminer un compte, ni l'inverse.
const _AUTH_KEY   = 'fund_auth';    // storageKey du client Supabase (voir getClient)
const _ANON_PREFIX = 'fund_anon_';

// Indice synchrone de session : la présence du jeton Supabase en stockage
// local. Les fonctions ci-dessous sont synchrones et ne peuvent pas
// attendre getCurrentUser().
function _hasSession() {
  try { return !!localStorage.getItem(_AUTH_KEY); } catch (e) { return false; }
}

function saveToStorage(key, val) {
  _MEM[key] = val;
  if (_hasSession()) {
    // Async write to Supabase selon la clé
    if (key === 'fund_profil')     saveProfile(val).catch(() => {});
    if (key === 'fund_dashboard')  saveDashboard(val).catch(() => {});
  } else {
    try {
      localStorage.setItem(_ANON_PREFIX + key, JSON.stringify(val));
      // Horodatage : un parcours construit il y a trois semaines sur un
      // navigateur partage n'a pas a s'annoncer comme « en attente ».
      localStorage.setItem(_ANON_PREFIX + 'ts', String(Date.now()));
    } catch (e) {}
  }
}

// Age du brouillon anonyme, en millisecondes. Infinity s'il n'est pas
// horodate (brouillon anterieur a cette regle) ou absent.
function anonDraftAge() {
  try {
    var t = parseInt(localStorage.getItem(_ANON_PREFIX + 'ts'), 10);
    return t ? Date.now() - t : Infinity;
  } catch (e) { return Infinity; }
}

function loadFromStorage(key) {
  if (_MEM[key]) return _MEM[key];
  if (!_hasSession()) {
    try {
      const raw = localStorage.getItem(_ANON_PREFIX + key);
      if (raw) { const v = JSON.parse(raw); _MEM[key] = v; return v; }
    } catch (e) {}
  }
  return _MEM[key] || null;
}

// ─── MIGRATION DU BROUILLON VERS LE COMPTE ─────────────────────────
function readAnonDraft() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(_ANON_PREFIX) === 0) {
        try { out[k.slice(_ANON_PREFIX.length)] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      }
    }
  } catch (e) {}
  return out;
}

function hasAnonDraft() {
  const d = readAnonDraft();
  return !!(d.fund_profil || d.fund_dashboard);
}

function clearAnonDraft() {
  try {
    const aSupprimer = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(_ANON_PREFIX) === 0) aSupprimer.push(k);
    }
    aSupprimer.forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) {}
}

// Pousse le brouillon vers le compte — jamais l'inverse, et jamais
// par-dessus un compte qui a déjà un parcours.
async function migrateAnonDraft() {
  const user = await getCurrentUser();
  if (!user) return { migre: false, raison: 'pas de session' };
  const draft = readAnonDraft();
  if (!draft.fund_profil && !draft.fund_dashboard) return { migre: false, raison: 'aucun brouillon' };   // 'ts' seul ne compte pas

  const existant = await loadProfile();
  if (existant && existant.briques_recommandees && existant.briques_recommandees.length) {
    // Ce brouillon ne sera jamais rattachable : le compte a deja son
    // parcours. Le garder le ferait re-declencher a chaque page, sans
    // jamais servir — on le solde apres avoir prevenu l'utilisateur.
    clearAnonDraft();
    return { migre: false, raison: 'compte deja pourvu' };
  }

  if (draft.fund_profil) {
    _MEM['fund_profil'] = draft.fund_profil;
    await saveProfile(draft.fund_profil).catch(() => {});
  }
  if (draft.fund_dashboard) {
    _MEM['fund_dashboard'] = draft.fund_dashboard;
    await saveDashboard(draft.fund_dashboard).catch(() => {});
  }
  clearAnonDraft();
  return { migre: true };
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
