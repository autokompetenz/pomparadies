const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function d(day, month, year = 2026) {
  return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

const braque = [
  { name:'Ulysse',  birthDate:d(6,6),  sex:'Male',   father:'Hector', mother:'Isis',  pedigree:'LOSH-BRA-2026-0211', microchip:'985 1410 0235 101', desc:'Alerte et intelligent, il observe déjà son environnement avec attention.' },
  { name:'Diane',   birthDate:d(6,6),  sex:'Female', father:'Hector', mother:'Isis',  pedigree:'LOSH-BRA-2026-0212', microchip:'985 1410 0235 102', desc:'Élégante et affectueuse, elle adore les caresses et les longues siestes.' },
  { name:'Igor',    birthDate:d(6,6),  sex:'Male',   father:'Hector', mother:'Isis',  pedigree:'LOSH-BRA-2026-0213', microchip:'985 1410 0235 103', desc:'Vif et joueur, toujours prêt à courir après une balle dans l\'enclos.' },
  { name:'Vénus',   birthDate:d(6,6),  sex:'Female', father:'Hector', mother:'Isis',  pedigree:'LOSH-BRA-2026-0214', microchip:'985 1410 0235 104', desc:'Sociable et douce, elle s\'entend déjà très bien avec ses frères et sœurs.' },
  { name:'Boris',   birthDate:d(6,6),  sex:'Male',   father:'Hector', mother:'Isis',  pedigree:'LOSH-BRA-2026-0215', microchip:'985 1410 0235 105', desc:'Costaud et confiant, il s\'approche facilement des nouvelles têtes.' },
  { name:'Olga',    birthDate:d(20,4), sex:'Female', father:'Rambo',  mother:'Luna',  pedigree:'LOSH-BRA-2026-0180', microchip:'985 1410 0235 780', desc:'Calme et attachante, elle préfère observer avant de se lancer dans le jeu.' },
  { name:'Rex',     birthDate:d(20,4), sex:'Male',   father:'Rambo',  mother:'Luna',  pedigree:'LOSH-BRA-2026-0181', microchip:'985 1410 0235 781', desc:'Plein d\'énergie, il apprend déjà très vite les bases de l\'obéissance.' },
  { name:'Nala',    birthDate:d(20,4), sex:'Female', father:'Rambo',  mother:'Luna',  pedigree:'LOSH-BRA-2026-0182', microchip:'985 1410 0235 782', desc:'Délicate et joueuse, elle adore explorer chaque coin de son enclos.' },
  { name:'Gaston',  birthDate:d(20,4), sex:'Male',   father:'Rambo',  mother:'Luna',  pedigree:'LOSH-BRA-2026-0183', microchip:'985 1410 0235 783', desc:'Curieux et sociable, il suit les visiteurs du regard avec beaucoup d\'intérêt.' },
  { name:'Iris',    birthDate:d(20,4), sex:'Female', father:'Rambo',  mother:'Luna',  pedigree:'LOSH-BRA-2026-0184', microchip:'985 1410 0235 784', desc:'Douce et affectueuse, elle réclame des câlins dès qu\'on s\'approche.' },
];

async function main() {
  let created = 0;
  for (const p of braque) {
    const exists = await prisma.puppy.findFirst({ where: { microchipNumber: p.microchip } });
    if (exists) {
      console.log(`⏭️  ${p.name} déjà présent (microchip ${p.microchip})`);
      continue;
    }
    await prisma.puppy.create({
      data: {
        name: p.name,
        breed: 'Braque Allemand',
        sex: p.sex,
        birthDate: p.birthDate,
        color: 'Foie et blanc',
        price: 850,
        microchipNumber: p.microchip,
        vaccinationStatus: '1ère injection',
        dewormingStatus: 'À jour',
        description: p.desc,
        parentMotherName: p.mother,
        parentFatherName: p.father,
        pedigreeDocUrl: `https://animalconceptsrl.com/pedigree/${p.pedigree}`,
        location: 'Oupeye',
        isActive: true,
      },
    });
    created++;
    console.log(`✅ ${p.name} (Braque Allemand) créé`);
  }

  const count = await prisma.puppy.count();
  console.log(`\n📊 ${created} Braque(s) Allemand(s) ajouté(s) — total chiots en base : ${count}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); prisma.$disconnect(); });
