// ═══════════════════════════════════════════════════════════════════
// FUNDAMENTALS — Shared data layer (briques metadata + profile utils)
// ═══════════════════════════════════════════════════════════════════

const BRIQUES_META = {
  budget_base: {
    id: 'budget_base', nom: 'Stabilise ton mois',
    tagline: 'Comprends où va ton argent et évite les mauvaises surprises.',
    duree: '10–15 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '📊',
    resume: 'La méthode en 3 étapes pour reprendre le contrôle de tes dépenses sans te prendre la tête.',
    chapitres: ['Cartographier ses entrées/sorties', 'Identifier les fuites', 'Créer son budget simple']
  },
  gestion_decouvert: {
    id: 'gestion_decouvert', nom: 'Sortir du rouge',
    tagline: 'Plan d\'action immédiat pour repasser dans le vert.',
    duree: '8–12 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🚨',
    resume: 'Un protocole d\'urgence pour stopper la spirale du découvert et retrouver un solde positif.',
    chapitres: ['Diagnostic découvert', 'Négocier avec sa banque', 'Les 30 jours pour sortir du rouge']
  },
  paiements_fractionnes: {
    id: 'paiements_fractionnes', nom: 'Le piège des minicrédits',
    tagline: 'Comprends et désamorce les paiements fractionnés.',
    duree: '8 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '💳',
    resume: 'Pourquoi payer "en 3x sans frais" te coûte plus cher — et comment t\'en libérer.',
    chapitres: ['Coût réel des paiements fractionnés', 'Prioriser les remboursements', 'Éviter la rechute']
  },
  fonds_urgence: {
    id: 'fonds_urgence', nom: 'Ton matelas de sécurité',
    tagline: 'Construis le fonds d\'urgence qui change tout.',
    duree: '10 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🛡️',
    resume: 'Même 50 € de côté changent la donne. Apprends à calculer ton seuil et à l\'atteindre.',
    chapitres: ['Pourquoi c\'est vital', 'Calculer son montant cible', 'Automatiser l\'épargne']
  },
  droits_aides: {
    id: 'droits_aides', nom: 'Tes droits et aides',
    tagline: 'Ne laisse pas d\'argent sur la table.',
    duree: '12 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🤝',
    resume: 'APL, RSA, aide alimentaire, aides locales — un tour d\'horizon des dispositifs disponibles selon ta situation.',
    chapitres: ['Cartographie des aides', 'Simuler ses droits', 'Faire ses demandes']
  },
  plan_desendettement: {
    id: 'plan_desendettement', nom: 'Gestion des dettes',
    tagline: 'Cartographie tes dettes, choisis ta stratégie, libère-toi.',
    duree: '15 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '📉',
    resume: 'Visualise tes dettes, mesure ton taux d\'endettement et choisis la meilleure stratégie pour t\'en libérer.',
    chapitres: ['Cartographier ses dettes', 'Choisir sa méthode', 'Engager son plan']
  },
  dispositifs_bdf: {
    id: 'dispositifs_bdf', nom: 'Dispositifs Banque de France',
    tagline: 'Connaître tes droits en cas de surendettement.',
    duree: '8 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🏛️',
    resume: 'Le dossier de surendettement et les aides d\'urgence — pas tabou, juste utile.',
    chapitres: ['Dossier de surendettement', 'Médiation bancaire', 'Procédure de rétablissement']
  },
  anti_arnaques: {
    id: 'anti_arnaques', nom: 'Cybersécurité financière',
    tagline: 'Reconnais et bloque les arnaques modernes.',
    duree: '10 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🔒',
    resume: 'Phishing, investissements miracles, usurpation d\'identité — les patterns pour ne jamais te faire avoir.',
    chapitres: ['Les arnaques les plus courantes', 'Les signaux d\'alerte', 'Que faire si ça arrive']
  },
  premiers_pas_bancaires: {
    id: 'premiers_pas_bancaires', nom: 'Premiers pas bancaires',
    tagline: 'Comprendre sa banque quand on débute.',
    duree: '10 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🎓',
    resume: 'Compte courant, CB, virement, découvert autorisé : les bases sans jargon.',
    chapitres: ['Anatomie d\'un compte bancaire', 'Choisir sa banque', 'Les bons réflexes dès le départ']
  },
  emmenagement: {
    id: 'emmenagement', nom: 'Préparer son emménagement',
    tagline: 'Budget, caution, assurances : le guide complet.',
    duree: '12 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '📦',
    resume: 'Tout ce qu\'il faut savoir avant de signer un bail — et comment ne pas se retrouver à court.',
    chapitres: ['Le vrai coût d\'un déménagement', 'Caution et garanties', 'Assurance habitation']
  },
  plan_multi_objectifs: {
    id: 'plan_multi_objectifs', nom: 'Tes objectifs en parallèle',
    tagline: 'Prioriser et financer plusieurs projets sans se disperser.',
    duree: '12 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '🎯',
    resume: 'Comment allouer ses ressources quand on a plusieurs envies — une méthode réaliste.',
    chapitres: ['Cartographier ses objectifs', 'Allouer ses ressources', 'Suivi et ajustements']
  },
  projet_immo: {
    id: 'projet_immo', nom: 'Décrypter l\'achat immo',
    tagline: 'De l\'apport au crédit, tout ce qu\'il faut savoir.',
    duree: '18 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '🏠',
    resume: 'Un parcours immobilier sans mauvaise surprise, de la recherche à la signature.',
    chapitres: ['Simuler sa capacité d\'emprunt', 'Comprendre les frais de notaire', 'Choisir son crédit']
  },
  achat_immobilier: {
    id: 'achat_immobilier', nom: 'Achat immobilier',
    tagline: 'Comprends le processus, estime ta capacité et prépare ton projet.',
    duree: '10 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '🏠',
    resume: 'En quelques minutes, estime ta capacité d\'achat, repère les frais et sais quoi faire ensuite.',
    chapitres: ['Le jargon utile', 'Capacité mensuelle', 'Simulateur d\'achat'],
    tags: ['logement', 'crédit', 'notaire'],
    recommended: false
  },
  immo_locatif: {
    id: 'immo_locatif', nom: 'Investissement locatif',
    tagline: 'Rendement, cashflow et fiscalité : évalue ton projet locatif.',
    duree: '12 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '🏘️',
    resume: 'Estime la rentabilité d\'un achat pour louer : loyer, charges, rendement net, cashflow et capacité d\'emprunt résiduelle.',
    chapitres: ['Capacité & budget', 'Marché & typologie', 'Rendement & cashflow'],
    tags: ['locatif', 'rendement', 'fiscalité'],
    recommended: false
  },
  treso_dirigeant: {
    id: 'treso_dirigeant', nom: 'Tréso du dirigeant',
    tagline: 'Gérer la frontière entre finances perso et pro.',
    duree: '12 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '💼',
    resume: 'Se payer correctement et protéger son épargne personnelle quand on est indépendant.',
    chapitres: ['Rémunération optimale', 'Séparer perso et pro', 'Se couvrir en cas de coup dur']
  },
  structuration_patrimoine: {
    id: 'structuration_patrimoine', nom: 'Structurer son patrimoine',
    tagline: 'Organiser et faire fructifier ce que tu as construit.',
    duree: '15 min', pack: 'Construction & projets', pack_color: '#60a5fa',
    icon: '🧱',
    resume: 'Immobilier, livrets, placements : comprendre comment les faire travailler ensemble.',
    chapitres: ['Bilan patrimonial', 'Équilibrer ses actifs', 'Optimiser la fiscalité globale']
  },
  investissement_long_terme: {
    id: 'investissement_long_terme', nom: 'Investir sur le long terme',
    tagline: 'Les grands principes pour faire travailler ton argent.',
    duree: '15 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '🌱',
    resume: 'Bourse, ETF, intérêts composés — pourquoi commencer tôt est la meilleure décision.',
    chapitres: ['Intérêts composés', 'Comprendre la bourse', 'Commencer avec 50 €/mois']
  },
  diversification_allocation: {
    id: 'diversification_allocation', nom: 'Diversification & allocation',
    tagline: 'Construire un portefeuille équilibré selon ton profil.',
    duree: '12 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '📐',
    resume: 'Ne pas mettre tous ses oeufs dans le même panier — et savoir lesquels choisir.',
    chapitres: ['Profil de risque', 'Répartition actifs/obligations', 'Rééquilibrer son portefeuille']
  },
  produits_complexes_vs_simples: {
    id: 'produits_complexes_vs_simples', nom: 'Trading vs ETF passif',
    tagline: 'Comprendre les risques des produits spéculatifs.',
    duree: '10 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '⚖️',
    resume: 'Crypto, CFD, options : pourquoi la plupart des investisseurs amateurs y perdent de l\'argent.',
    chapitres: ['Comprendre le levier', 'Statistiques de pertes', 'Alternatives plus sûres']
  },
  fiscalite_epargne: {
    id: 'fiscalite_epargne', nom: 'Fiscalité de l\'épargne',
    tagline: 'Optimiser la fiscalité de tes placements.',
    duree: '12 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '📑',
    resume: 'PFU, abattements, enveloppes fiscales : les règles pour garder plus de tes gains.',
    chapitres: ['PFU et barème', 'PEA et assurance-vie', 'Optimiser ses arbitrages']
  },
  retraite: {
    id: 'retraite', nom: 'Préparer sa retraite',
    tagline: 'Simuler et anticiper ses droits à la retraite dès maintenant.',
    duree: '15 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '🌅',
    resume: 'Comprendre son relevé de carrière et construire un complément de revenus adapté.',
    chapitres: ['Simuler ses droits', 'Comprendre le PER', 'Stratégie multi-supports']
  },
  transmission: {
    id: 'transmission', nom: 'Transmettre son patrimoine',
    tagline: 'Donation, succession : organiser sereinement la transmission.',
    duree: '15 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '🤲',
    resume: 'Les règles de succession en France et les leviers pour avantager ses proches légalement.',
    chapitres: ['Abattements sur donations', 'Assurance-vie et succession', 'Testament et SCI']
  },
  clarification_contrats: {
    id: 'clarification_contrats', nom: 'Décrypte tes contrats',
    tagline: 'Lire et comprendre ses contrats d\'assurance-vie et PER.',
    duree: '10 min', pack: 'Investissement & long terme', pack_color: '#a78bfa',
    icon: '🔍',
    resume: 'Frais, unités de compte, clause bénéficiaire : tout ce que tu n\'as jamais osé demander.',
    chapitres: ['Frais de gestion', 'Unités de compte vs fonds euros', 'Clause bénéficiaire']
  }
};

// ─── PROFILE → HUMAN SENTENCES ──────────────────────────────────
const AGE_LABELS = { '15_17':'15–17 ans','18_24':'18–24 ans','25_34':'25–34 ans','35_54':'35–54 ans','55_64':'55–64 ans','65_plus':'65 ans ou plus' };
const STATUS_LABELS = { college_lycee:'Collégien / lycéen', etudiant:'Étudiant', sal_ouvrier_employe:'Salarié', sal_prof_inter:'Salarié intermédiaire', cadre_prof_lib:'Cadre / profession libérale', indep_tpe:'Indépendant / TPE', chomeur_inactif:'En recherche d\'emploi', retraite:'Retraité', autre:'Autre' };
const REV_LABELS = { difficile_fin_mois:'Budget sous tension', juste_juste:'Budget juste-juste', a_l_aise:'Budget à l\'aise' };
const OBJ_LABELS = { sortir_decouvert:'Sortir du découvert', stabiliser_budget:'Stabiliser le budget', rembourser_dettes:'Rembourser les dettes', financer_projet_court_terme:'Financer un projet', acheter_logement:'Acheter un logement', preparer_retraite:'Préparer la retraite', investir_long_terme:'Investir intelligemment', mieux_comprendre_contrats:'Comprendre mes contrats', preparer_transmission:'Préparer la transmission', se_reperer:'M\'y retrouver' };
const URG_LABELS = { survie_mois:'Urgence immédiate', projet_prochain_mois:'Projet à moyen terme', long_terme:'Vision long terme' };

function profileToTags(profil) {
  const tags = [];
  if (profil.age_group) tags.push(AGE_LABELS[profil.age_group] || profil.age_group);
  if (profil.status_pro) tags.push(STATUS_LABELS[profil.status_pro] || profil.status_pro);
  if (profil.revenu_sentiment) tags.push(REV_LABELS[profil.revenu_sentiment] || profil.revenu_sentiment);
  if (profil.urgence_principale) tags.push(URG_LABELS[profil.urgence_principale] || profil.urgence_principale);
  return tags;
}

function profileToSentences(profil) {
  const s = [];
  // Revenu sentiment
  const revMap = {
    difficile_fin_mois: "Tu termines souvent le mois dans le rouge.",
    juste_juste: "Tu t'en sors, mais sans grande marge.",
    a_l_aise: "Ta situation financière est confortable."
  };
  if (profil.revenu_sentiment) s.push(revMap[profil.revenu_sentiment]);
  // Stress budget
  const stress = parseInt(profil.stress_budget) || 0;
  if (stress >= 4) s.push("L'argent est une source de stress importante pour toi en ce moment.");
  else if (stress >= 2) s.push("Tu ressens une pression modérée autour de ton budget.");
  // Dettes
  const dettes = (profil.dettes_types || []).filter(d => d !== 'aucun');
  const detteMap = {
    decouvert_regulier: "découvert régulier",
    paiement_fractionne_mini_credit: "paiements fractionnés",
    credit_conso: "crédit conso",
    credit_immo: "crédit immobilier",
    autre_credit: "autre crédit"
  };
  if (dettes.length > 0) s.push(`Tu as en cours : ${dettes.map(d => detteMap[d] || d).join(", ")}.`);
  else if ((profil.dettes_types || []).includes('aucun')) s.push("Aucun crédit ni découvert en cours — bonne base de départ.");
  // Objectif principal
  const objMap = {
    sortir_decouvert: "Ta priorité : sortir du découvert.",
    stabiliser_budget: "Ta priorité : stabiliser ton budget mensuel.",
    rembourser_dettes: "Ta priorité : rembourser tes dettes.",
    financer_projet_court_terme: "Tu veux financer un projet dans les prochains mois.",
    acheter_logement: "Tu prépares un achat immobilier.",
    preparer_retraite: "Tu anticipes ta retraite.",
    investir_long_terme: "Tu veux faire travailler ton argent sur le long terme.",
    mieux_comprendre_contrats: "Tu veux mieux comprendre tes contrats financiers.",
    se_reperer: "Tu veux simplement t'y retrouver dans tes finances."
  };
  const obj0 = (profil.objectifs || [])[0];
  if (obj0) s.push(objMap[obj0] || `Objectif : ${obj0}.`);
  // Épargne liquide (nouveaux champs T2)
  if (profil.epargne_liquide_total > 0) {
    s.push(`Tu as environ ${formatEuro(profil.epargne_liquide_total)} de côté sur livrets — on en tient compte pour ton plan.`);
  } else if ((profil.produits_detenu || []).includes('livrets_seuls')) {
    s.push("Tu as déjà des livrets — on verra s'ils couvrent ton matelas de sécurité.");
  }
  return s.filter(Boolean);
}

// ─── STORAGE ────────────────────────────────────────────────────
// Double-write : mémoire (sync, immédiat) + Supabase (async, persistant).
// supabase.js DOIT être chargé avant shared.js dans chaque page HTML.

const STORAGE_KEYS = { profil:'fund_profil', plan:'fund_plan', dashboard:'fund_dashboard' };
const _STORE = {};

const _tabStore = (function() {
  const stores = [
    () => window['local'+'Storage'],
    () => window['session'+'Storage']
  ];
  for (const getStore of stores) {
    try {
      const k = '__fs_test__'; const s = getStore();
      s.setItem(k, '1'); s.removeItem(k);
      return s;
    } catch(e) {}
  }
  return null;
})();

function saveToStorage(key, val) {
  if (_tabStore) { try { _tabStore.setItem(key, JSON.stringify(val)); } catch(e) {} }
  _STORE[key] = val;
  if (key === 'fund_profil')    { if (typeof saveProfile   === 'function') saveProfile(val).catch(()=>{});   }
  if (key === 'fund_dashboard') { if (typeof saveDashboard === 'function') saveDashboard(val).catch(()=>{}); }
}

function loadFromStorage(key) {
  if (_tabStore) {
    try { const v = _tabStore.getItem(key); if (v) return JSON.parse(v); } catch(e) {}
  }
  return _STORE[key] || null;
}

// ─── MOCK DATA ──────────────────────────────────────────────────
function getMockProfile() {
  return {
    age_group: '25_34', status_pro: 'sal_ouvrier_employe',
    revenu_sentiment: 'juste_juste', stress_budget: 4,
    logement_situation: 'locataire', logement_projet: 'je_veux_acheter',
    objectifs: ['stabiliser_budget','acheter_logement'],
    dettes_types: ['decouvert_regulier','credit_conso'],
    retards_paiement: 'occasionnel', produits_detenu: ['livrets_seuls'],
    confort_numerique: 'moyen', fraude_experience: 'non',
    urgence_principale: 'projet_prochain_mois',
    briques_recommandees: ['budget_base','gestion_decouvert','fonds_urgence',
      'plan_desendettement','anti_arnaques','plan_multi_objectifs','achat_immobilier']
  };
}

function getMockDashboard() {
  return {
    briques: [
      { id:'budget_base', statut:'en_cours', progression:35 },
      { id:'gestion_decouvert', statut:'a_faire', progression:0 },
      { id:'fonds_urgence', statut:'a_faire', progression:0 },
      { id:'plan_desendettement', statut:'a_faire', progression:0 },
      { id:'anti_arnaques', statut:'terminee', progression:100 },
      { id:'plan_multi_objectifs', statut:'a_faire', progression:0 },
      { id:'achat_immobilier', statut:'a_faire', progression:0 }
    ],
    brique_active_id: 'budget_base',
    engagements: [
      { id:'e1', type:'fonds_urgence', label:"Mini fonds d'urgence", detail:'Objectif 300 €',
        montant_actuel:60, montant_cible:300, versement:'20 €/mois', brique_id:'fonds_urgence', atteint:false },
      { id:'e2', type:'decouvert', label:'Plafond découvert', detail:"Ne pas dépasser –100 € ce mois-ci",
        brique_id:'gestion_decouvert', atteint:false }
    ],
    streak: 3, modules_completes: 1, derniere_activite: new Date().toISOString()
  };
}

// ─── ANALYTICS ────────────────────────────────────────────────────
function trackEvent(eventName, data) { console.log('[FUND]', eventName, data || ''); }
function brickStarted(brickId)              { trackEvent('brick_started',      { brick: brickId, ts: Date.now() }); }
function screenViewed(brickId, screenIdx)   { trackEvent('screen_viewed',      { brick: brickId, screen: screenIdx }); }
function fieldCompleted(brickId, fieldName) { trackEvent('field_completed',    { brick: brickId, field: fieldName }); }
function fieldSkipped(brickId, fieldName)   { trackEvent('field_skipped',      { brick: brickId, field: fieldName }); }
function estimateUsed(brickId, fieldName)   { trackEvent('estimate_used',      { brick: brickId, field: fieldName }); }
function resultViewed(brickId)              { trackEvent('result_viewed',      { brick: brickId }); }
function commitmentCreated(brickId, eng)    { trackEvent('commitment_created', { brick: brickId, engagement: eng }); }
function brickCompleted(brickId)            { trackEvent('brick_completed',    { brick: brickId, ts: Date.now() }); }
function brickAbandoned(brickId, screenIdx) { trackEvent('brick_abandoned',    { brick: brickId, screen: screenIdx }); }
function helpClicked(brickId, context)      { trackEvent('help_clicked',       { brick: brickId, context }); }

// ─── updateProfileFromBrick ────────────────────────────────────────
// Point d'entrée unique pour persister les données d'une brique.
//   profileFields : champs plats à écrire dans profiles (réutilisables par les autres briques)
//   rawData       : données brutes complètes de la brique (JSON libre)
//   screenIdx     : écran courant (pour la reprise)
//   completed     : true quand la brique est finie
async function updateProfileFromBrick(brickId, profileFields = {}, rawData = {}, screenIdx = 0, completed = false) {
  // 1. Fusion dans le profil local + Supabase profiles
  let profil = loadFromStorage('fund_profil') || {};
  Object.assign(profil, profileFields);
  saveToStorage('fund_profil', profil);

  // 2. Persist brick raw data (Supabase brick_data)
  if (typeof saveBrickData === 'function') {
    saveBrickData(brickId, rawData, completed).catch(() => {});
  }

  // 3. Update screen_courant pour la reprise
  if (typeof getClient === 'function' && typeof getCurrentUser === 'function') {
    try {
      const user = await getCurrentUser();
      if (user) {
        const sb = getClient();
        await sb.from('brick_data').upsert({
          user_id: user.id, brick_id: brickId,
          data: rawData, completed, screen_courant: screenIdx
        }, { onConflict: 'user_id,brick_id' });
      }
    } catch(e) { console.warn('[Fund] updateProfileFromBrick error', e); }
  }
}

// ─── loadBrickState ────────────────────────────────────────────────────
// Charge l'état sauvegardé d'une brique au démarrage.
// Retourne { data, screenCourant, completed } ou null.
async function loadBrickState(brickId) {
  if (typeof getClient !== 'function' || typeof getCurrentUser !== 'function') return null;
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    const sb = getClient();
    const { data, error } = await sb
      .from('brick_data')
      .select('data, screen_courant, completed, completed_at')
      .eq('user_id', user.id)
      .eq('brick_id', brickId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      data:          data.data || {},
      screenCourant: data.screen_courant || 0,
      completed:     data.completed || false,
      completedAt:   data.completed_at || null
    };
  } catch(e) { return null; }
}

// ─── autosaveBrickProgress ─────────────────────────────────────────────
// À appeler à chaque changement d'écran. Léger fire-and-forget.
// Empêche la perte de progression si l'utilisateur ferme l'onglet.
function autosaveBrickProgress(brickId, screenIdx, rawData) {
  saveToStorage('fund_brick_' + brickId, { screen: screenIdx, data: rawData, ts: Date.now() });
  if (typeof getClient === 'function' && typeof getCurrentUser === 'function') {
    getCurrentUser().then(user => {
      if (!user) return;
      const sb = getClient();
      sb.from('brick_data').upsert({
        user_id: user.id, brick_id: brickId,
        data: rawData, completed: false, screen_courant: screenIdx
      }, { onConflict: 'user_id,brick_id' }).catch(() => {});
    }).catch(() => {});
  }
}

// ─── completeBrickFull ──────────────────────────────────────────────────
// Remplace completeBrick pour les nouvelles implémentations.
// Fait tout en une passe : dashboard, profil, brick_data, insights.
//
//   profileFields : champs profil enrichis (voir migration_v2.sql)
//   rawData       : état final de la brique
//   engagements   : [{id, type, label, detail, montant_actuel, montant_cible, brique_id}]
//   insights      : [{id, type, titre, contenu}] (utiliser buildInsights())
async function completeBrickFull(brickId, { profileFields = {}, rawData = {}, engagements = [], insights = [] } = {}) {
  let dash = loadFromStorage('fund_dashboard') || getMockDashboard();
  const b = dash.briques.find(br => br.id === brickId);
  if (b) { b.statut = 'terminee'; b.progression = 100; }
  dash.modules_completes = (dash.modules_completes || 0) + 1;

  const next = dash.briques.find(br => br.statut === 'a_faire');
  if (next) { next.statut = 'en_cours'; dash.brique_active_id = next.id; }

  if (engagements.length > 0) {
    dash.engagements = dash.engagements || [];
    engagements.forEach(e => {
      if (!dash.engagements.find(x => x.id === e.id)) dash.engagements.push(e);
    });
  }
  if (insights.length > 0) {
    dash.insights = dash.insights || [];
    insights.forEach(ins => {
      if (!dash.insights.find(x => x.id === ins.id))
        dash.insights.push({ ...ins, brique_source: brickId, ts: Date.now() });
    });
  }

  dash.derniere_activite = new Date().toISOString();
  saveToStorage('fund_dashboard', dash);

  await updateProfileFromBrick(brickId, profileFields, rawData, 999, true);

  brickCompleted(brickId);
  if (engagements.length > 0) engagements.forEach(e => commitmentCreated(brickId, e));

  return dash;
}

// Rétro-compatibilité — completeBrick reste utilisable
function completeBrick(brickId, engagements) {
  let dash = loadFromStorage('fund_dashboard') || getMockDashboard();
  const b = dash.briques.find(br => br.id === brickId);
  if (b) { b.statut = 'terminee'; b.progression = 100; }
  dash.modules_completes = (dash.modules_completes || 0) + 1;
  const next = dash.briques.find(br => br.statut === 'a_faire');
  if (next) { next.statut = 'en_cours'; dash.brique_active_id = next.id; }
  if (engagements && engagements.length > 0) {
    dash.engagements = dash.engagements || [];
    engagements.forEach(e => dash.engagements.push(e));
  }
  dash.derniere_activite = new Date().toISOString();
  saveToStorage('fund_dashboard', dash);
  brickCompleted(brickId);
  return dash;
}

function updateBrickProgress(brickId, progression) {
  let dash = loadFromStorage('fund_dashboard') || getMockDashboard();
  const b = dash.briques.find(br => br.id === brickId);
  if (b) { b.progression = progression; b.statut = 'en_cours'; }
  dash.brique_active_id = brickId;
  dash.derniere_activite = new Date().toISOString();
  saveToStorage('fund_dashboard', dash);
}

// ─── INSIGHTS BUILDER ─────────────────────────────────────────────────
// Génère les insights à débloquer à la fin d'une brique.
// Usage : buildInsights(brickId, profil, rawData) → tableau pour completeBrickFull
function buildInsights(brickId, profil, data) {
  const ins = [];
  if (brickId === 'budget_base') {
    const ral = data.reste_a_vivre || 0;
    if (ral < 0) {
      ins.push({ id: 'ins_budget_negatif', type: 'alerte',
        titre: 'Budget en déficit',
        contenu: `Ton reste-à-vivre est négatif (${formatEuro(ral)}). Regarde la brique “Sortir du rouge” pour identifier les leviers.` });
    } else if (ral < 200) {
      ins.push({ id: 'ins_budget_serre', type: 'conseil',
        titre: 'Marge très serrée',
        contenu: `Il te reste ${formatEuro(ral)} en fin de mois. Pense à constituer un petit coussin avant tout investissement.` });
    } else {
      ins.push({ id: 'ins_budget_ok', type: 'info',
        titre: 'Marge disponible',
        contenu: `Tu as ${formatEuro(ral)} de marge mensuelle. C'est une base solide pour construire ton coussin d'urgence.` });
    }
  }
  if (brickId === 'gestion_decouvert') {
    const cout = data.decouvert_cout_mensuel || 0;
    if (cout > 0) {
      ins.push({ id: 'ins_decouvert_cout', type: 'chiffre',
        titre: 'Coût réel du découvert',
        contenu: `Le découvert te coûte environ ${formatEuro(cout)}/mois, soit ${formatEuro(cout * 12)}/an en frais bancaires.` });
    }
  }
  if (brickId === 'paiements_fractionnes') {
    const liberation = data.bnpl_date_liberation;
    const mensualite = data.bnpl_mensualite_total || 0;
    if (liberation && mensualite > 0) {
      ins.push({ id: 'ins_bnpl_liberation', type: 'projection',
        titre: 'Date de libération BNPL',
        contenu: `À partir du ${liberation}, tu récupères ${formatEuro(mensualite)}/mois de marge — si tu n'ajoutes pas de nouveaux paiements.` });
    }
  }
  if (brickId === 'fonds_urgence') {
    const objectif = data.fonds_urgence_objectif || 0;
    const date = data.fonds_urgence_date_estimee;
    if (objectif > 0) {
      ins.push({ id: 'ins_urgence_objectif', type: 'objectif',
        titre: 'Coussin de sécurité en cours',
        contenu: 'Objectif ' + formatEuro(objectif) + (date ? ' — estimé atteint le ' + date : '') + '.' });
    }
  }
  return ins;
}

// ─── BRICK FILES + NAVIGATION ────────────────────────────────────────────
const BRICK_FILES = {
  budget_base:          'brique-budget-base.html',
  fonds_urgence:        'brique-fonds-urgence.html',
  achat_immobilier:     'brique-achat-immobilier.html',
  immo_locatif:         'brique-immo-locatif.html',
  plan_desendettement:  'brique-plan-desendettement.html'
};

function getNextBrick(currentBrickId) {
  let dash = loadFromStorage('fund_dashboard') || getMockDashboard();
  const currentIdx = dash.briques.findIndex(br => br.id === currentBrickId);
  const next = dash.briques.find((br, i) => i > currentIdx && br.statut !== 'terminee');
  if (!next) return null;
  const meta = BRIQUES_META[next.id];
  if (!meta) return null;
  return Object.assign({}, meta, { file: BRICK_FILES[next.id] || null });
}

// ─── FORMAT ────────────────────────────────────────────────────
function formatEuro(val) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(val);
}

// ─── PROFILE UTILS ────────────────────────────────────────────────
function getBudgetIntroVariant(profil) {
  const age = profil.age_group;
  const status = profil.status_pro;
  if (age === '18_24' || status === 'etudiant') return { intro: 'On va rendre ton mois plus respirable.', levier: 'Sorties, abonnements, reste-à-vivre.' };
  if (age === '25_34') return { intro: 'On va voir ce que ton quotidien te coûte vraiment.', levier: 'Logement, transport, crédits, marge.' };
  if (age === '35_54') return { intro: "On va remettre ton mois à plat pour récupérer de l'air.", levier: 'Charges fixes, crédits, pression du mois.' };
  return { intro: 'On va clarifier ton flux mensuel pour dégager une marge utile.', levier: 'Automatisation, objectifs, allocation de marge.' };
}

function getSpendingPaliers(age) {
  if (age === '15_17' || age === '18_24') return [15, 40, 80, 150];
  if (age === '25_34') return [30, 70, 140, 250];
  return [40, 90, 180, 350];
}

function getBrickCSS() {
  return `
    :root {
      --bg:#0b0d17;--surface:#111320;--surface-2:#171a2e;--surface-3:#1d2038;
      --border:#252845;--border-hover:#363a68;
      --text:#e2e4f0;--text-muted:#8b90b8;--text-faint:#444868;
      --violet:#818cf8;--purple:#c084fc;--indigo:#6366f1;
      --indigo-dim:rgba(99,102,241,0.14);--indigo-glow:rgba(99,102,241,0.22);
      --violet-glow:rgba(129,140,248,0.10);
      --green:#4ade80;--green-dim:rgba(74,222,128,0.10);--green-border:rgba(74,222,128,0.3);
      --orange:#fb923c;--orange-dim:rgba(251,146,60,0.12);--orange-border:rgba(251,146,60,0.3);
      --red:#f87171;--blue:#60a5fa;--purple-soft:#a78bfa;
      --r-sm:0.5rem;--r-md:0.875rem;--r-lg:1.25rem;--r-xl:1.75rem;--r-full:9999px;
      --ease-spring:cubic-bezier(0.34,1.56,0.64,1);--ease-out:cubic-bezier(0.16,1,0.3,1);--t:180ms;
    }
  `;
}

// ─── BACKGROUND CANVAS ──────────────────────────────────────────────
function initBgCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  window.addEventListener('resize', resize); resize();
  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W; this.y = H+10;
      this.vy = -(Math.random()*0.35+0.12);
      this.vx = (Math.random()-0.5)*0.25;
      this.r  = Math.random()*1.6+0.3;
      this.a  = Math.random()*0.45+0.08;
    }
    tick() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset();
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(139,92,246,${this.a})`; ctx.fill();
    }
  }
  for (let i=0; i<40; i++) { const p=new P(); p.y=Math.random()*H; particles.push(p); }
  const loop = () => { ctx.clearRect(0,0,W,H); particles.forEach(p=>p.tick()); requestAnimationFrame(loop); };
  loop();
}
