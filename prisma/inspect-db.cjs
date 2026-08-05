require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const puppies = await p.puppy.findMany({ select: { id: true, name: true, breed: true, description: true, vaccinationStatus: true, dewormingStatus: true, parentMotherName: true, parentFatherName: true, status: true } });
  console.log('TOTAL:', puppies.length);
  console.log('--- description samples ---');
  puppies.filter(x => x.description).slice(0, 8).forEach(x => console.log(JSON.stringify(x.name) + ': ' + x.description.slice(0, 120)));
  console.log('--- vaccinationStatus values ---');
  [...new Set(puppies.map(x => x.vaccinationStatus).filter(Boolean))].forEach(v => console.log(JSON.stringify(v)));
  console.log('--- dewormingStatus values ---');
  [...new Set(puppies.map(x => x.dewormingStatus).filter(Boolean))].forEach(v => console.log(JSON.stringify(v)));
  console.log('--- parents ---');
  [...new Set(puppies.map(x => x.parentMotherName).filter(Boolean))].forEach(v => console.log('M:', JSON.stringify(v)));
  [...new Set(puppies.map(x => x.parentFatherName).filter(Boolean))].forEach(v => console.log('F:', JSON.stringify(v)));
  console.log('--- names (first 30) ---');
  puppies.slice(0, 30).forEach(x => console.log(x.name));
  await p.$disconnect();
})();
