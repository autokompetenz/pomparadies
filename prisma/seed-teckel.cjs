const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function d(day, month, year = 2026) {
  return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

const teckel = [
  { name:'Bruno',   birthDate:d(5,6),  sex:'Male',   father:'Kaiser', mother:'Gretel', pedigree:'LOSH-TEC-2026-0311', microchip:'985 1410 0240 101', desc:'Petit débrouillard au caractère bien trempé, déjà très curieux de tout.' },
  { name:'Frida',   birthDate:d(5,6),  sex:'Female', father:'Kaiser', mother:'Gretel', pedigree:'LOSH-TEC-2026-0312', microchip:'985 1410 0240 102', desc:'Douce et affectueuse, elle adore se blottir contre ses frères et sœurs.' },
  { name:'Oscar',   birthDate:d(5,6),  sex:'Male',   father:'Kaiser', mother:'Gretel', pedigree:'LOSH-TEC-2026-0313', microchip:'985 1410 0240 103', desc:'Vif et joueur, il explore déjà chaque recoin de son enclos avec entrain.' },
  { name:'Lotti',   birthDate:d(5,6),  sex:'Female', father:'Kaiser', mother:'Gretel', pedigree:'LOSH-TEC-2026-0314', microchip:'985 1410 0240 104', desc:'Calme et observatrice, elle garde un œil attentif sur tout ce qui l\'entoure.' },
  { name:'Max',     birthDate:d(5,6),  sex:'Male',   father:'Kaiser', mother:'Gretel', pedigree:'LOSH-TEC-2026-0315', microchip:'985 1410 0240 105', desc:'Énergique et malicieux, toujours prêt à faire une petite bêtise.' },
  { name:'Gretel',  birthDate:d(18,4), sex:'Female', father:'Otto',   mother:'Berta',  pedigree:'LOSH-TEC-2026-0280', microchip:'985 1410 0240 780', desc:'Sociable et câline, elle réclame des caresses dès qu\'on s\'approche.' },
  { name:'Hans',    birthDate:d(18,4), sex:'Male',   father:'Otto',   mother:'Berta',  pedigree:'LOSH-TEC-2026-0281', microchip:'985 1410 0240 781', desc:'Robuste et confiant, il s\'approche facilement des nouvelles têtes.' },
  { name:'Emmi',    birthDate:d(18,4), sex:'Female', father:'Otto',   mother:'Berta',  pedigree:'LOSH-TEC-2026-0282', microchip:'985 1410 0240 782', desc:'Délicate et attachante, elle préfère les longues siestes au soleil.' },
  { name:'Kurt',    birthDate:d(18,4), sex:'Male',   father:'Otto',   mother:'Berta',  pedigree:'LOSH-TEC-2026-0283', microchip:'985 1410 0240 783', desc:'Plein d\'assurance, il apprend déjà très vite les règles de base.' },
  { name:'Heidi',   birthDate:d(18,4), sex:'Female', father:'Otto',   mother:'Berta',  pedigree:'LOSH-TEC-2026-0284', microchip:'985 1410 0240 784', desc:'Pétillante et joueuse, elle adore jouer avec ses frères et sœurs.' },
];

async function main() {
  let created = 0;
  for (const p of teckel) {
    const exists = await prisma.puppy.findFirst({ where: { microchipNumber: p.microchip } });
    if (exists) {
      console.log(`⏭️  ${p.name} déjà présent (microchip ${p.microchip})`);
      continue;
    }
    await prisma.puppy.create({
      data: {
        name: p.name,
        breed: 'Teckel',
        sex: p.sex,
        birthDate: p.birthDate,
        color: 'Noir et feu',
        price: 900,
        microchipNumber: p.microchip,
        vaccinationStatus: '1ère injection',
        dewormingStatus: 'À jour',
        description: p.desc,
        parentMotherName: p.mother,
        parentFatherName: p.father,
        pedigreeDocUrl: `https://pomparadiesgmbh.com/pedigree/${p.pedigree}`,
        location: 'Bonn',
        isActive: true,
      },
    });
    created++;
    console.log(`✅ ${p.name} (Teckel) créé`);
  }

  const count = await prisma.puppy.count();
  console.log(`\n📊 ${created} Teckel(s) ajouté(s) — total chiots en base : ${count}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); prisma.$disconnect(); });
