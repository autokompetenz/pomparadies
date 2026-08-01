function formatEuro(amount) {
  if (!amount && amount !== 0) return '—';
  return '€' + new Intl.NumberFormat('en-US').format(Math.round(amount));
}

function generateReservationNumber() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).substring(2,8).toUpperCase();
  return `SWP${date}${rand}`;
}

// Codes par race : micro = plage de numéros de puce (comme dans le seed),
// code = référence LOSH/ELEV, prefix = préfixe du pedigree
const BREED_ID_CODES = {
  'Jack Russell Terrier': { micro: 234, code: 'JR',  prefix: 'LOSH' },
  'Braque Allemand':      { micro: 235, code: 'BRA', prefix: 'LOSH' },
  'Dogue Allemand':       { micro: 236, code: 'DOG', prefix: 'LOSH' },
  'Dobermann':            { micro: 237, code: 'DOB', prefix: 'LOSH' },
  'Caniche':              { micro: 238, code: 'CAN', prefix: 'LOSH' },
  'Drahthaar':            { micro: 239, code: 'DRA', prefix: 'LOSH' },
  'Teckel':               { micro: 240, code: 'TEC', prefix: 'LOSH' },
  'Boxer':                { micro: 242, code: 'BOX', prefix: 'LOSH' },
  'Spitz Allemand':       { micro: 243, code: 'SPI', prefix: 'LOSH' },
  'Bouledogue Français':  { micro: 244, code: 'BOU', prefix: 'LOSH' },
  'Labrador Retriever':   { micro: 245, code: 'LAB', prefix: 'LOSH' },
  'Leonberg':             { micro: 246, code: 'LEO', prefix: 'LOSH' },
  'Kangal':               { micro: 248, code: 'KAN', prefix: 'LOSH' },
  'Chihuahua':            { micro: 250, code: 'CHI', prefix: 'LOSH' },
  'Yorkshire Terrier':    { micro: 260, code: 'YOR', prefix: 'LOSH' },
  'Berger Allemand':      { micro: 270, code: 'BA',  prefix: 'LOSH' },
  'Berger Malinois':      { micro: 275, code: 'BM',  prefix: 'LOSH' },
  'Bichon Maltais':       { micro: 280, code: 'BIC', prefix: 'LOSH' },
  'Shih Tzu':             { micro: 290, code: 'SHI', prefix: 'LOSH' },
  'Golden Retriever':     { micro: 300, code: 'GR',  prefix: 'LOSH' },
  'Canis Vulgaris':       { micro: 310, code: 'CV',  prefix: 'ELEV' },
};

function getDayOfYear(d) {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
}

// Génération déterministe puce + pedigree à partir de la race et de la date de naissance.
// index = position du chiot dans sa portée (chiots même race + même date de naissance).
function generatePuppyIds(breed, birthDate, index = 0) {
  const info = BREED_ID_CODES[breed];
  if (!info || !birthDate) return null;
  const d = new Date(birthDate);
  const doy = getDayOfYear(d);
  const microSeq = (100 + doy + index * 7) % 1000;
  const pedSeq = (100 + doy * 3 + index * 13) % 10000;
  return {
    microchipNumber: `985 1410 0${info.micro} ${String(microSeq).padStart(3, '0')}`,
    pedigreeDocUrl: `${info.prefix}-${info.code}-${d.getFullYear()}-${String(pedSeq).padStart(4, '0')}`,
  };
}

// Génère des identifiants uniques en base (vérifie les collisions sur la race).
async function generateUniquePuppyIds(prisma, breed, birthDate, excludeId) {
  if (!breed || !birthDate) return { microchipNumber: null, pedigreeDocUrl: null };
  if (!generatePuppyIds(breed, birthDate)) return { microchipNumber: null, pedigreeDocUrl: null };

  const d = new Date(birthDate);
  const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const end = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  const breedPuppies = await prisma.puppy.findMany({
    where: excludeId ? { id: { not: excludeId }, breed } : { breed },
    select: { id: true, birthDate: true, microchipNumber: true, pedigreeDocUrl: true },
  });

  const usedMicro = new Set(breedPuppies.map(p => p.microchipNumber).filter(Boolean));
  const usedPed = new Set(breedPuppies.map(p => p.pedigreeDocUrl).filter(Boolean));
  const sameLitter = breedPuppies.filter(p => {
    const pd = new Date(p.birthDate);
    return pd >= start && pd < end;
  });

  let index = sameLitter.length;
  for (let attempt = 0; attempt < 500; attempt++) {
    const cand = generatePuppyIds(breed, birthDate, index);
    if (cand && !usedMicro.has(cand.microchipNumber) && !usedPed.has(cand.pedigreeDocUrl)) {
      return cand;
    }
    index++;
  }
  return generatePuppyIds(breed, birthDate, sameLitter.length);
}

module.exports = {
  formatEuro,
  generateReservationNumber,
  generatePuppyIds,
  generateUniquePuppyIds,
  BREED_ID_CODES,
};
