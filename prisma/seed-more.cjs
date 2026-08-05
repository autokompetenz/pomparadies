const { PrismaClient } = require('@prisma/client');
const { newBreeds } = require('./new-breeds-data.cjs');
const prisma = new PrismaClient();

async function main() {
  let created = 0;
  for (const breed of newBreeds) {
    for (const p of breed.puppies) {
      const exists = await prisma.puppy.findFirst({ where: { microchipNumber: p.microchip } });
      if (exists) {
        console.log(`⏭️  ${p.name} déjà présent (microchip ${p.microchip})`);
        continue;
      }
      await prisma.puppy.create({
        data: {
          name: p.name,
          breed: breed.breed,
          sex: p.sex,
          birthDate: p.birthDate,
          color: breed.color,
          price: breed.price,
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
      console.log(`✅ ${p.name} (${breed.breed}) créé`);
    }
  }

  const count = await prisma.puppy.count();
  console.log(`\n📊 ${created} chiots ajoutés — total chiots en base : ${count}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); prisma.$disconnect(); });
