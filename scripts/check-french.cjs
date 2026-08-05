#!/usr/bin/env node
// Garde-fou : détecte les textes français dans le code (hors base de données).
// Usage :
//   node scripts/check-french.cjs            -> signale les chaînes FR, exit 1 si trouvées
//   node scripts/check-french.cjs --fix      -> applique la table TRANSLATIONS aux chaînes exactes
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const INCLUDES = [
  'src',
  'lib',
  'api',
  'index.html',
];

const EXCLUDES = new Set(['node_modules', 'dist', '.git', 'prisma', 'scripts', '.vercel']);

// Mots spécifiquement français. On évite les mots partagés avec l'allemand/l'anglais
// (des, mail, date, service, garantie, photo, nom, page, mai, site, contact, total, client...).
const FRENCH_WORDS = [
  'à', 'après', 'aussi', 'avant', 'avec', 'avez', 'avoir', 'beaucoup', 'belle',
  'bien', 'celle', 'celles', 'cet', 'cette', 'ceux', 'chaque', 'chiot', 'chiots', 'chez',
  'comme', 'comment', 'connexion', 'couvée', 'dans', 'deja', 'depuis',
  'deux', 'donc', 'dont', 'durant', 'erreur', 'etre', 'euros', 'fait', 'faire',
  'faut', 'femelle', 'jusque', 'juste', 'laisse', 'leur',
  'leurs', 'livraison', 'livre', 'mais', 'même', 'meme', 'mieux', 'moins', 'mois', 'moyen',
  'mutation', 'né', 'notre', 'nos', 'où', 'ou', 'oui', 'par', 'pas', 'paiement', 'pendant',
  'peut', 'peux', 'plus', 'portée', 'pour', 'pourquoi', 'précédent', 'premier', 'presque',
  'prochain', 'profession', 'puis', 'quand', 'quel', 'quelle', 'quelles', 'quelques', 'quels',
  'quelque', 'qui', 'rien', 'règlement', 'réservation', 'réservations', 'sans', 'selon', 'sera',
  'serez', 'soit', 'sont', 'sous', 'sur', 'supprimer', 'toujours', 'tout', 'toute', 'toutes',
  'tous', 'travail', 'très', 'tres', 'trouver', 'une', 'valider', 'vérifier', 'votre',
  'vous', 'veuillez', 'affichage', 'administrateur', 'annonce', 'aperçu', 'annuler', 'arrière',
  'aujourd', 'automatique', 'catalogue', 'cent', 'commande', 'confirmer', 'contenant',
  'courriel', 'déjà', 'descendant', 'devenir', 'disponible', 'domicile',
  'donner', 'entrez', 'envoyer', 'expédiée', 'historique', 'inscription', 'magasin',
  'mensuel', 'merci', 'nombre', 'numéro', 'obtenir', 'occasion', 'offre',
  'petit', 'petite', 'peut-être', 'prix', 'recherche', 'reçu', 'retard',
  'retour', 'revenu', 'sélectionner', 'semaine', 'seulement',
  'supplément', 'téléphone', 'télécharger', 'tenue', 'titre',
  'vacances', 'vente', 'visite', 'élevage', 'élément', 'été', 'être', 'appelez', 'appeler',
  'payer', 'virement', 'espèces', 'acompte', 'solde', 'prenom',
  'confirmation', 'numéro de suivi', 'statut', 'deuxième', 'dernier', 'actuel',
  'accueil', 'technique', 'réservé', 'vendue',
];

// Accents typiquement français uniquement (le « ü » et « ä/ö/ß » sont allemands).
const FRENCH_ACCENTS = /[àâçéèêëîïôùûœ]/i;

// Segments techniques à ignorer (chemins, identifiants, clés, URLs, fontes, interpolations).
function isTechnical(seg) {
  if (!seg || !seg.trim()) return true;
  if (/:\/\//.test(seg)) return true;
  if (/^\/|^\.|^@/.test(seg)) return true;
  if (/^[a-zA-Z0-9_@/.\-]+$/.test(seg)) return true;
  if (/^(\$\{[^}]*\}[^ ]*)+$/.test(seg)) return true;
  if (/sans-serif|sans serif/i.test(seg)) return true;
  return false;
}

const TRANSLATIONS = {
  "Code d'accès manquant": 'Zugangscode fehlt',
  'Accès non autorisé': 'Zugriff nicht autorisiert',
  'Code invalide ou expiré': 'Ungültiger oder abgelaufener Code',
  'Confirmation email sent to': 'Bestätigungs-E-Mail gesendet an',
  'Confirmation email error:': 'Fehler bei der Bestätigungs-E-Mail:',
  'Message requis': 'Nachricht erforderlich',
  "Code d'acces manquant": 'Zugangscode fehlt',
};

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (EXCLUDES.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(js|jsx|html)$/.test(e.name)) out.push(full);
  }
}

const STRING_RE = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;

function extractSegments(line) {
  const segs = [];
  let m;
  STRING_RE.lastIndex = 0;
  while ((m = STRING_RE.exec(line)) !== null) {
    const s = m[1] ?? m[2] ?? m[3];
    if (s && s.trim()) segs.push(s);
  }
  return segs;
}

function isFrench(seg) {
  if (FRENCH_ACCENTS.test(seg)) return true;
  const words = seg.toLowerCase().split(/[^a-zàâçéèêëîïôùûœ]+/).filter(Boolean);
  return words.some(w => FRENCH_WORDS.includes(w));
}

function main() {
  const fix = process.argv.includes('--fix');
  const files = [];
  for (const inc of INCLUDES) walk(path.join(ROOT, inc), files);

  let issues = 0;
  let fixes = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const segments = extractSegments(line);
      if (segments.length === 0) continue;
      for (const seg of segments) {
        if (isTechnical(seg)) continue;
        if (!isFrench(seg)) continue;
        if (fix && TRANSLATIONS[seg]) {
          lines[i] = line.split(seg).join(TRANSLATIONS[seg]);
          fixes++;
          continue;
        }
        issues++;
        out.push(`  ${rel}:${i + 1}  ${seg.slice(0, 120)}`);
      }
    }
    out.forEach(l => console.log(l));
    if (fix) fs.writeFileSync(file, lines.join('\n'), 'utf8');
  }

  if (fix) {
    console.log(`\n--fix : ${fixes} remplacement(s) appliqué(s).`);
    if (issues > 0) {
      console.log(`Restent ${issues} occurrence(s) sans traduction automatique connue.`);
      process.exitCode = 1;
    }
    return;
  }

  if (issues === 0) {
    console.log('OK — aucun texte français détecté dans le code.');
  } else {
    console.log(`\n${issues} occurrence(s) française(s) détectée(s) dans le code.`);
    process.exitCode = 1;
  }
}

main();
