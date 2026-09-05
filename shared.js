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
    tagline: 'Comprendre ce que ta banque fait pour toi.',
    duree: '10 min', pack: 'Survie & stabilité', pack_color: '#f87171',
    icon: '🎓',
    resume: 'Tu comprends ce que fournit une banque, tu identifies ce dont tu as besoin, et tu sais à quoi t’attendre.',
    chapitres: ['Ce que ta banque te fournit', 'Ce dont tu as besoin, toi', 'Vivre avec sa banque']
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


// ─── DOMAINE DU SITE ───────────────────────────────────
// Un seul endroit à changer le jour où le domaine bouge.
//
// N'est utilisé QUE pour les mentions de marque dans les documents que
// l'utilisateur exporte : filigrane des PNG, pied du bilan imprimable.
// Tout ce qui est FONCTIONNEL — redirections d'authentification, retours
// OAuth — passe par `window.location.origin`, qui déduit le domaine à
// l'exécution et n'a donc jamais besoin d'être mis à jour. Ne remplacez
// jamais l'un par l'autre.
const SITE_DOMAINE = 'fundamentals-education.com';

// ─── ICÔNES DES BRIQUES ─────────────────────────────────────────
// Icônes au trait, une par brique. Elles remplacent les emoji du champ
// `icon` de BRIQUES_META, qui ne suivent pas le thème et ne se colorent
// pas — mais `icon` RESTE : c'est le repli, et le glyphe fantôme des
// blocs de recommandation s'en sert toujours (à dessein).
//
// Chaque entrée est [silhouette, accent]. Les deux sont aujourd'hui
// rendues de la même encre ; la séparation reste pour pouvoir y revenir.
const BRIQUES_ICONES = {
  budget_base:                   ['<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/>',
                                   '<rect x="17" y="4" width="3" height="14"/>'],
  gestion_decouvert:             ['<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
                                   '<path d="M12 9v4"/><path d="M12 17h.01"/>'],
  paiements_fractionnes:         ['<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
                                   '<path d="M7 15h3"/>'],
  fonds_urgence:                 ['<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
                                   '<path d="m9 11.5 2 2 4-4"/>'],
  droits_aides:                  ['<circle cx="9" cy="7" r="3.2"/><path d="M3 20v-1.2A4.8 4.8 0 0 1 7.8 14h2.4a4.8 4.8 0 0 1 4.8 4.8V20"/>',
                                   '<path d="M17.5 11.5v5M15 14h5"/>'],
  plan_desendettement:           ['<path d="M3 4.5l6.5 7.5 4-3.5 7 7.5"/>',
                                   '<path d="M15.5 16h5v-5"/>'],
  dispositifs_bdf:               ['<path d="M3 21h18"/><path d="M12 3 3 8.5h18L12 3Z"/>',
                                   '<path d="M6.5 11v7M10.2 11v7M13.8 11v7M17.5 11v7"/>'],
  anti_arnaques:                 ['<rect x="4" y="10" width="16" height="11" rx="2"/>',
                                   '<path d="M8 10V7a4 4 0 0 1 8 0v3"/>'],
  premiers_pas_bancaires:        ['<path d="M22 9 12 4 2 9l10 5 10-5Z"/>',
                                   '<path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>'],
  emmenagement:                  ['<path d="M3 8h18v12H3z"/><path d="M3 8 5 4h14l2 4"/>',
                                   '<path d="M10 12h4"/>'],
  plan_multi_objectifs:          ['<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>',
                                   '<circle cx="12" cy="12" r="1.6"/>'],
  projet_immo:                   ['<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
                                   '<path d="M10 20v-6h4v6"/>'],
  achat_immobilier:              ['<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
                                   '<path d="M10 20v-6h4v6"/>'],
  immo_locatif:                  ['<path d="M2 20h20"/><path d="M4 20V9l6-4v15"/><path d="M14 20V11l6-3v12"/>',
                                   '<path d="M7 12h.01M7 16h.01"/>'],
  treso_dirigeant:               ['<rect x="2" y="7" width="20" height="13" rx="2"/>',
                                   '<path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'],
  structuration_patrimoine:      ['<rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
                                   '<rect x="8.5" y="4" width="7" height="7"/>'],
  investissement_long_terme:     ['<path d="M12 21c0-5-2-8-6-9 1 5 3 8 6 9Z"/><path d="M12 21v-6"/>',
                                   '<path d="M12 21c0-6 3-9 8-10-1 6-4 9-8 10Z"/>'],
  diversification_allocation:    ['<circle cx="12" cy="12" r="9"/>',
                                   '<path d="M12 3v9l6 4"/>'],
  produits_complexes_vs_simples: ['<path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14h6L5 7Z"/>',
                                   '<path d="M19 7l-3 7h6l-3-7Z"/>'],
  fiscalite_epargne:             ['<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
                                   '<path d="M9 13h6M9 17h4"/>'],
  retraite:                      ['<path d="M2 18h20"/><path d="M12 2v2M4.9 6.9l1.4 1.4M19.1 6.9l-1.4 1.4"/>',
                                   '<path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>'],
  transmission:                  ['<circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="6.5" r="2.5"/><path d="M8 16.2A9 9 0 0 1 16.2 8"/>',
                                   '<path d="m12.4 7.2 3.9.6.6 3.9"/>'],
  clarification_contrats:        ['<circle cx="11" cy="11" r="7"/>',
                                   '<path d="m20 20-3.5-3.5"/>'],
};

/* Renvoie le SVG de l'icône d'une brique, ou null si elle n'en a pas —
   à l'appelant de retomber sur `meta.icon`. Aucune classe propre à une
   page : c'est l'appelant qui l'habille.
     taille  côté du carré, en px (défaut 25)
     trait   épaisseur du trait (défaut 1.85) */
function iconeBriqueSVG(id, opts) {
  const parts = BRIQUES_ICONES[id];
  if (!parts) return null;
  const o = opts || {};
  const px = o.taille || 25;
  const w  = o.trait  || 1.85;
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24"'
       + ' fill="none" stroke="currentColor" stroke-width="' + w + '"'
       + ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
       + parts[0] + parts[1] + '</svg>';
}

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
  dash.briques = dash.briques || [];
  const b = dash.briques.find(br => br.id === brickId);
  if (b) { b.statut = 'terminee'; b.progression = 100; }
  // Les briques sont accessibles librement, mais le plan calcule a
  // l'onboarding n'en contient qu'une partie. Sans cela, terminer une brique
  // hors plan n'inscrivait rien nulle part.
  else if (BRIQUES_META[brickId]) {
    dash.briques.push({ id: brickId, statut: 'terminee', progression: 100, hors_plan: true });
  }
  dash.modules_completes = (dash.modules_completes || 0) + 1;

  const next = dash.briques.find(br => br.statut === 'a_faire');
  if (next) { next.statut = 'en_cours'; dash.brique_active_id = next.id; }

  if (engagements.length > 0) {
    dash.engagements = dash.engagements || [];
    engagements.forEach(e => {
      // Remplacer, pas ignorer : refaire la brique doit mettre a jour le
      // montant et le libelle, pas conserver ceux du premier passage.
      const i = dash.engagements.findIndex(x => x.id === e.id);
      if (i >= 0) dash.engagements[i] = e; else dash.engagements.push(e);
    });
  }

  // Une brique qui se termine REMPLACE ce qu'elle avait compris.
  // Avant, on n'ajoutait que si l'id était absent et on ne retirait jamais
  // rien : les trois branches du budget ayant trois ids distincts, un passage
  // à 800 € de marge laissait « Marge disponible » à côté du « Marge très
  // serrée » du passage suivant. Deux enseignements contradictoires, même
  // brique, affichés ensemble — et un chiffre modifié sous un id identique
  // n'était jamais rafraîchi.
  dash.insights = (dash.insights || []).filter(x => x.brique_source !== brickId);
  insights.forEach(ins => {
    dash.insights.push({ ...ins, brique_source: brickId, ts: Date.now() });
  });

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
    // On raisonne sur la marge AVANT épargne. reste_a_vivre retranche
    // l'épargne : s'en servir revenait à dire « marge très serrée, pense à
    // constituer un coussin » à quelqu'un qui met déjà 1 750 € de côté.
    const marge   = data.marge_avant_epargne
                 ?? ((data.revenus || 0) + (data.aides || 0) - (data.total_besoins || 0) - (data.total_envies || 0));
    const epargne = data.epargne || 0;
    const revenus = (data.revenus || 0) + (data.aides || 0);
    const taux    = revenus > 0 ? Math.round(epargne / revenus * 100) : 0;

    if (marge < 0) {
      ins.push({ id: 'ins_budget_negatif', type: 'alerte',
        titre: 'Budget en déficit',
        contenu: `Tes dépenses dépassent tes revenus de ${formatEuro(Math.abs(marge))} par mois. Regarde la brique “Sortir du rouge” pour identifier les leviers.` });
    } else if (epargne > 0 && taux >= 15) {
      // Gros épargnant : lui parler de coussin n'a aucun sens.
      ins.push({ id: 'ins_budget_epargnant', type: 'objectif',
        titre: 'Tu épargnes beaucoup',
        contenu: `Tu mets ${formatEuro(epargne)} de côté chaque mois, soit ${taux} % de tes revenus. Une fois ton coussin d'urgence couvert, la question devient où placer ce flux.` });
    } else if (marge < 200) {
      ins.push({ id: 'ins_budget_serre', type: 'conseil',
        titre: 'Marge très serrée',
        contenu: `Une fois tes dépenses payées, il te reste ${formatEuro(marge)} par mois. Pense à constituer un petit coussin avant tout investissement.` });
    } else {
      ins.push({ id: 'ins_budget_ok', type: 'info',
        titre: 'Marge disponible',
        contenu: `Une fois tes dépenses payées, il te reste ${formatEuro(marge)} par mois. C'est une base solide pour construire ton coussin d'urgence.` });
    }
  }
  if (brickId === 'premiers_pas_bancaires') {
    const carte   = data.carte_recommandee || null;
    const besoins = data.besoins_identifies || [];
    const notions = (data.notions_lues || []).length;
    if (carte) {
      ins.push({ id: 'ins_ppb_carte', type: 'conseil',
        titre: "La carte qui te convient",
        contenu: `D’après ta situation, ${carte}. Pour savoir ce que tu as aujourd’hui, le type est écrit à côté de la cotisation sur ton relevé.` });
    }
    if (besoins.length) {
      const pluriel = besoins.length > 1;
      ins.push({ id: 'ins_ppb_besoins', type: 'info',
        titre: "Ce qui te sera utile",
        contenu: `On a retenu ${besoins.length} chose${pluriel ? 's' : ''} adaptée${pluriel ? 's' : ''} à ta situation : ${besoins.slice(0, 3).join(', ')}${besoins.length > 3 ? '…' : ''}.` });
    }
    if (notions >= 4) {
      ins.push({ id: 'ins_ppb_bases', type: 'info',
        titre: "Les bases sont posées",
        contenu: `Tu as parcouru ${notions} notions sur 5. Compte, moyens de paiement, découvert, épargne, crédit : tu sais désormais à quoi sert chaque pièce.` });
    }
  }
  if (brickId === 'plan_desendettement') {
    const mois    = data.mois_liberte || 0;
    const dateLib = data.date_liberte || null;
    const interets = data.interets_totaux || 0;
    const methode = data.methode === 'avalanche' ? 'Avalanche' : 'Boule de neige';
    const surplus = data.surplus_mensuel || 0;

    if (mois > 0 && dateLib) {
      ins.push({ id: 'ins_dettes_liberte', type: 'projection',
        titre: 'Ta date de sortie de dette',
        contenu: `Au rythme que tu as choisi, tu es libre en ${dateLib} — dans ${mois} mois. Cette date bouge dès que tu changes l'effort mensuel.` });
    }
    if (interets > 0) {
      ins.push({ id: 'ins_dettes_interets', type: 'chiffre',
        titre: 'Ce que la dette te coûte encore',
        contenu: `Il te reste ${formatEuro(interets)} d'intérêts à payer sur tes crédits en cours. C'est le montant que tu réduis en remboursant plus vite.` });
    }
    if (data.methode) {
      ins.push({ id: 'ins_dettes_methode', type: 'conseil',
        titre: `Méthode retenue : ${methode}`,
        contenu: data.methode === 'avalanche'
          ? `Tu attaques la dette au TAEG le plus élevé d'abord : c'est l'ordre qui coûte le moins cher au total.${surplus > 0 ? ` Tu y consacres ${formatEuro(surplus)} de plus par mois.` : ''}`
          : `Tu soldes la plus petite dette d'abord : c'est l'ordre qui donne une victoire rapide, et la mensualité libérée vient grossir la suivante.${surplus > 0 ? ` Tu y consacres ${formatEuro(surplus)} de plus par mois.` : ''}` });
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
    // Ce qui revient a cette date, ce sont les paiements fractionnes seuls :
    // un credit amortissable continue bien au-dela. L'ancien champ reste en
    // repli pour les etats deja enregistres.
    const mensualite = data.bnpl_mensualite_fractionnes || data.bnpl_mensualite_total || 0;
    if (liberation && mensualite > 0) {
      ins.push({ id: 'ins_bnpl_liberation', type: 'projection',
        titre: 'Date de libération BNPL',
        contenu: `À partir de ${liberation}, tu récupères ${formatEuro(mensualite)}/mois de marge — si tu n'ajoutes pas de nouveaux paiements.` });
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
  premiers_pas_bancaires: 'brique-premiers-pas-bancaires.html',
  budget_base:          'brique-budget-base.html',
  fonds_urgence:        'brique-fonds-urgence.html',
  paiements_fractionnes:'brique-paiements-fractionnes.html',
  achat_immobilier:     'brique-achat-immobilier.html',
  immo_locatif:         'brique-immo-locatif.html',
  plan_desendettement:  'brique-plan-desendettement.html'
};

function getNextBrick(currentBrickId) {
  let dash = loadFromStorage('fund_dashboard') || getMockDashboard();
  const currentIdx = dash.briques.findIndex(br => br.id === currentBrickId);
  // Brique absente du parcours (pas encore publiee) : findIndex renvoie -1,
  // et `i > -1` est vrai des le premier element — on proposait alors la
  // premiere brique de la liste comme suite. Mieux vaut ne rien proposer.
  if (currentIdx === -1) return null;
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

// getBrickCSS() vivait ici : une palette sombre complete, distincte de
// theme.css comme des blocs en ligne. Elle n'etait APPELEE NULLE PART —
// une seule occurrence dans tout le depot, sa propre definition. Retiree
// le 2026-09-05 avec les autres redeclarations de jetons.
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
