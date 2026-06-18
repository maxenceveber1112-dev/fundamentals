// ===================================================================
// immo-core.js — Primitives financieres PARTAGEES (briques immo)
// Source unique de verite pour les fonctions pures + constantes communes
// a brique-achat-immobilier.html et brique-immo-locatif.html.
// Charge AVANT le <script> inline de chaque brique (apres nav-avatar.js).
// NE PAS mettre ici de fonction couplee a l etat S ou au DOM.
// ===================================================================

/* --- Constantes + helpers geo/typologie --- */
var EFFORT_MAX = 0.35;
var RENT_WEIGHT = 0.70;   // part des loyers attendus retenue par les banques dans la capacite d'emprunt
var NOTARY_RATE_LOW = 0.10;
var NOTARY_RATE_ANCIEN = 0.07;
var NOTARY_RATE_NEUF = 0.025;
var PRICE_THRESHOLD_LOW = 75000;

/* ─── ASSURANCE AUTO PAR AGE ─────────────────────────────── */
var ASSURANCE_RATES = {
  '15_17': 0.0015, '18_24': 0.0015,
  '25_34': 0.0020,
  '35_54': 0.0030,
  '55_64': 0.0045,
  '65_plus': 0.0060
};

/* ─── PRIX M² PAR DÉPARTEMENT (DVF 2024 data.gouv + sources notaires Alsace-Moselle) ───── */
var PRIX_M2 = {
  '01':2900,'02':1400,'03':1400,'04':2400,'05':3000,'06':5200,'07':2100,'08':1300,
  '09':1600,'10':1600,'11':2200,'12':1700,'13':3900,'14':3000,'15':1400,'16':1500,
  '17':3200,'18':1300,'19':1600,'21':2400,'22':2200,'23':1100,'24':1700,'25':2100,
  '26':2300,'27':2000,'28':2000,'29':2300,'2A':4500,'2B':3300,'30':2700,'31':2900,
  '32':1700,'33':3700,'34':3400,'35':3000,'36':1200,'37':2400,'38':2800,'39':1800,
  '40':3200,'41':1700,'42':1800,'43':1600,'44':3300,'45':2100,'46':1700,'47':1600,
  '48':1800,'49':2300,'50':2100,'51':2200,'52':1100,'53':1600,'54':1900,'55':1200,
  '56':3000,'57':2200,'58':1200,'59':2300,'60':2300,'61':1500,'62':2100,'63':2000,
  '64':3600,'65':1900,'66':2600,'67':3000,'68':2400,'69':3800,'70':1300,'71':1600,
  '72':1700,'73':4300,'74':4800,'75':9700,'76':2300,'77':3100,'78':4300,'79':1500,
  '80':2000,'81':1800,'82':1900,'83':4400,'84':2800,'85':2800,'86':1700,'87':1600,
  '88':1600,'89':1500,'90':1600,'91':3300,'92':6700,'93':4200,'94':5200,'95':3500,
  '971':2400,'972':2500,'973':1900,'974':2900,'976':1800,
  'default':2300
};
var DEPT_NAMES = {
  '01':'Ain','02':'Aisne','03':'Allier','04':'Alpes-de-Haute-Provence','05':'Hautes-Alpes',
  '06':'Alpes-Maritimes','07':'Ardèche','08':'Ardennes','09':'Ariège','10':'Aube',
  '11':'Aude','12':'Aveyron','13':'Bouches-du-Rhône','14':'Calvados','15':'Cantal',
  '16':'Charente','17':'Charente-Maritime','18':'Cher','19':'Corrèze','21':"Côte-d'Or",
  '22':"Côtes-d'Armor",'23':'Creuse','24':'Dordogne','25':'Doubs','26':'Drôme',
  '27':'Eure','28':'Eure-et-Loir','29':'Finistère','2A':'Corse-du-Sud','2B':'Haute-Corse',
  '30':'Gard','31':'Haute-Garonne','32':'Gers','33':'Gironde','34':'Hérault',
  '35':'Ille-et-Vilaine','36':'Indre','37':'Indre-et-Loire','38':'Isère','39':'Jura',
  '40':'Landes','41':'Loir-et-Cher','42':'Loire','43':'Haute-Loire','44':'Loire-Atlantique',
  '45':'Loiret','46':'Lot','47':'Lot-et-Garonne','48':'Lozère','49':'Maine-et-Loire',
  '50':'Manche','51':'Marne','52':'Haute-Marne','53':'Mayenne','54':'Meurthe-et-Moselle',
  '55':'Meuse','56':'Morbihan','57':'Moselle','58':'Nièvre','59':'Nord',
  '60':'Oise','61':'Orne','62':'Pas-de-Calais','63':'Puy-de-Dôme','64':'Pyrénées-Atlantiques',
  '65':'Hautes-Pyrénées','66':'Pyrénées-Orientales','67':'Bas-Rhin','68':'Haut-Rhin','69':'Rhône',
  '70':'Haute-Saône','71':'Saône-et-Loire','72':'Sarthe','73':'Savoie','74':'Haute-Savoie',
  '75':'Paris','76':'Seine-Maritime','77':'Seine-et-Marne','78':'Yvelines','79':'Deux-Sèvres',
  '80':'Somme','81':'Tarn','82':'Tarn-et-Garonne','83':'Var','84':'Vaucluse',
  '85':'Vendée','86':'Vienne','87':'Haute-Vienne','88':'Vosges','89':'Yonne',
  '90':'Territoire de Belfort','91':'Essonne','92':'Hauts-de-Seine','93':'Seine-Saint-Denis','94':'Val-de-Marne',
  '95':"Val-d'Oise",'971':'Guadeloupe','972':'Martinique','973':'Guyane','974':'La Réunion','976':'Mayotte'
};
function getDeptFromPostal(cp) {
  if (!cp || cp.length < 2) return null;
  if (['971','972','973','974','976'].includes(cp.substring(0,3))) return cp.substring(0,3);
  return cp.substring(0,2);
}
function getPrixM2(cp) {
  var dept = getDeptFromPostal(cp);
  return PRIX_M2[dept] || PRIX_M2['default'];
}

/* ─── TYPOLOGIES (surface moyenne + multiplicateur prix/m²) ────────────── */
/* Source : ordres de grandeur DVF 2024 + Notaires de France. */
/* Multiplicateur appliqué au prix/m² départemental moyen. */
var TYPOLOGIES = [
  { id:'studio', label:'Studio',  surface:22, mult:1.15, icon:'🏙️',  short:'≤ 30 m², 1 pièce' },
  { id:'t2',     label:'T2',      surface:42, mult:1.05, icon:'🏠',   short:'40–50 m², 2 pièces' },
  { id:'t3',     label:'T3',      surface:62, mult:1.00, icon:'🏡',   short:'60–75 m², 3 pièces' },
  { id:'t4',     label:'T4 +',    surface:85, mult:0.97, icon:'🏡',   short:'≥ 80 m², 4 pièces +' },
  { id:'maison', label:'Maison',  surface:105,mult:0.93, icon:'🏡',   short:'Avec terrain' }
];
function getTypoById(id) { for (var i=0;i<TYPOLOGIES.length;i++){ if (TYPOLOGIES[i].id===id) return TYPOLOGIES[i]; } return TYPOLOGIES[2]; }
function estimateTypoPrice(typo, prixM2Base) {
  return Math.round(typo.surface * prixM2Base * typo.mult);
}

/* ─── HORIZON SLIDER DATA ───────────────────────────────── */
var HORIZON_LABELS = ['< 3 mois', '3–6 mois', '6–12 mois', '> 1 an', 'Simple curiosité'];
var HORIZON_VALUES = ['3m', '6m', '12m', '1y+', 'curiosite'];

/* ─── DURATION BY AGE GROUP ─────────────────────────────── */
var DUREE_PAR_AGE = { '25_34': 25, '25-34': 25, '35_44': 20, '35-44': 20, '45_54': 15, '45-54': 15, '55_plus': 10, '55+': 10 };

/* --- Fonctions de calcul (pures) --- */
/* ─── CALCULATION FUNCTIONS ──────────────────────────────── */
function calculateMonthlyPayment(loanAmount, annualRate, months) {
  if (!loanAmount || !months || months <= 0) return 0;
  if (!annualRate || annualRate <= 0) return loanAmount / months;
  var r = annualRate / 100 / 12;
  return loanAmount * r / (1 - Math.pow(1 + r, -months));
}

function calculateBorrowingCapacity(monthlyPayment, annualRate, months) {
  if (!monthlyPayment || !months || months <= 0) return 0;
  if (!annualRate || annualRate <= 0) return monthlyPayment * months;
  var r = annualRate / 100 / 12;
  return monthlyPayment * (1 - Math.pow(1 + r, -months)) / r;
}

function calculateDebtRatio(existingCredits, futurePaymentWithInsurance, monthlyIncome) {
  if (!monthlyIncome || monthlyIncome <= 0) return 0;
  return (n(existingCredits) + n(futurePaymentWithInsurance)) / monthlyIncome;
}

function calculateMobilizableDownPayment(availableSavings, familyHelp, protectedEmergency, blockedSavings, minReserve) {
  var result = n(availableSavings) + n(familyHelp) - n(protectedEmergency) - n(blockedSavings) - n(minReserve);
  return Math.max(0, result);
}

function estimateAcquisitionFees(price, propertyType) {
  if (!price || price <= 0) return 0;
  if (price < PRICE_THRESHOLD_LOW) return Math.round(price * NOTARY_RATE_LOW);
  if (propertyType === 'neuf' || propertyType === 'vefa') return Math.round(price * NOTARY_RATE_NEUF);
  return Math.round(price * NOTARY_RATE_ANCIEN);
}

/* --- Helpers numeriques / formatage --- */
function n(v) { var x = parseFloat(v); return isNaN(x) ? 0 : x; }
function fmt(v) {
  if (v === null || v === undefined || isNaN(v)) return '--';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}
function fmtPct(v) { return (Math.round(v * 1000) / 10) + ' %'; }
