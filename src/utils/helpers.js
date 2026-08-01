export const formatEuro = (amount) => {
  if (!amount && amount !== 0) return '—';
  return '€' + new Intl.NumberFormat('en-US').format(Math.round(amount));
};

export const BREEDS = [
  'Jack Russell Terrier', 'Braque Allemand', 'Teckel', 'Labrador Retriever', 'Chihuahua',
  'Yorkshire Terrier', 'Berger Allemand', 'Berger Malinois',
  'Bichon Maltais', 'Shih Tzu', 'Golden Retriever', 'Canis Vulgaris',
];

export const BREED_ID_CODES = {
  'Jack Russell Terrier': { micro: 234, code: 'JR',  prefix: 'LOSH' },
  'Braque Allemand':      { micro: 235, code: 'BRA', prefix: 'LOSH' },
  'Teckel':               { micro: 240, code: 'TEC', prefix: 'LOSH' },
  'Labrador Retriever':   { micro: 245, code: 'LAB', prefix: 'LOSH' },
  'Chihuahua':            { micro: 250, code: 'CHI', prefix: 'LOSH' },
  'Yorkshire Terrier':    { micro: 260, code: 'YOR', prefix: 'LOSH' },
  'Berger Allemand':      { micro: 270, code: 'BA',  prefix: 'LOSH' },
  'Berger Malinois':      { micro: 275, code: 'BM',  prefix: 'LOSH' },
  'Bichon Maltais':       { micro: 280, code: 'BIC', prefix: 'LOSH' },
  'Shih Tzu':             { micro: 290, code: 'SHI', prefix: 'LOSH' },
  'Golden Retriever':     { micro: 300, code: 'GR',  prefix: 'LOSH' },
  'Canis Vulgaris':       { micro: 310, code: 'CV',  prefix: 'ELEV' },
};

export function sameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export function generatePuppyIdentifiers(breed, birthDate, index = 0) {
  const info = BREED_ID_CODES[breed];
  if (!info || !birthDate) return null;
  const d = new Date(birthDate);
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const doy = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
  const microSeq = (100 + doy + index * 7) % 1000;
  const pedSeq = (100 + doy * 3 + index * 13) % 10000;
  return {
    microchipNumber: `985 1410 0${info.micro} ${String(microSeq).padStart(3, '0')}`,
    pedigreeDocUrl: `${info.prefix}-${info.code}-${d.getFullYear()}-${String(pedSeq).padStart(4, '0')}`,
  };
}

export function nextPuppyIdentifiers(puppies, breed, birthDate, excludeId) {
  const info = BREED_ID_CODES[breed];
  if (!info || !birthDate) return null;
  const filtered = (puppies || []).filter(p => p.id !== excludeId);
  const sameLitter = filtered.filter(p => p.breed === breed && sameDay(p.birthDate, birthDate));
  const index = sameLitter.length;
  const usedMicro = new Set(filtered.map(p => p.microchipNumber).filter(Boolean));
  const usedPed = new Set(filtered.map(p => p.pedigreeDocUrl).filter(Boolean));
  for (let i = index; i < index + 500; i++) {
    const cand = generatePuppyIdentifiers(breed, birthDate, i);
    if (!usedMicro.has(cand.microchipNumber) && !usedPed.has(cand.pedigreeDocUrl)) {
      return cand;
    }
  }
  return generatePuppyIdentifiers(breed, birthDate, index);
}

export function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getAgeString(birthDate, lang = 'fr') {
  const now = new Date();
  const birth = new Date(birthDate);
  const weeks = Math.floor((now - birth) / (7 * 24 * 60 * 60 * 1000));
  return `${weeks} ${lang === 'fr' ? 'semaines' : lang === 'nl' ? 'weken' : 'weeks'}`;
}

export const STATUS_LABELS = {
  pending: 'Demande reçue',
  deposit_confirmed: 'Acompte confirmé',
  preparing: 'En préparation',
  ready: 'Prêt(e) à partir',
  delivered: 'Remis(e) à la famille',
  cancelled: 'Annulée',
};

export const PUPPY_STATUS_LABELS = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
};

export function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}
