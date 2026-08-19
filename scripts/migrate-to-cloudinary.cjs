require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

const BATCH = 5;
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function migrateImage(url, folder) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' }],
    });
    return result.secure_url;
  } catch (e) {
    console.error(`  ✗ Failed: ${url.substring(0, 80)}... → ${e.message}`);
    return null;
  }
}

async function main() {
  const puppies = await prisma.puppy.findMany({
    select: { id: true, name: true, imageUrl: true, imageUrl2: true, imageUrl3: true, imageUrl4: true, imageUrl5: true },
  });

  const urlsToMigrate = [];
  for (const p of puppies) {
    for (const field of ['imageUrl', 'imageUrl2', 'imageUrl3', 'imageUrl4', 'imageUrl5']) {
      const url = p[field];
      if (url && url.startsWith('https://imccvtocxfngosgitnum.supabase.co')) {
        urlsToMigrate.push({ puppyId: p.id, field, url, puppyName: p.name });
      }
    }
  }

  console.log(`\n🐶 Migration: ${urlsToMigrate.length} images à migrer pour ${puppies.length} chiots\n`);

  let migrated = 0;
  let failed = 0;
  const updates = [];

  for (let i = 0; i < urlsToMigrate.length; i += BATCH) {
    const batch = urlsToMigrate.slice(i, i + BATCH);
    console.log(`📦 Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(urlsToMigrate.length / BATCH)} (${i + 1}-${Math.min(i + BATCH, urlsToMigrate.length)}/${urlsToMigrate.length})`);

    const results = await Promise.all(
      batch.map(async (item) => {
        const newUrl = await migrateImage(item.url, 'puppies');
        if (newUrl) {
          migrated++;
          console.log(`  ✓ ${item.puppyName} [${item.field}]`);
          return { puppyId: item.puppyId, field: item.field, newUrl };
        } else {
          failed++;
          return null;
        }
      })
    );

    results.filter(Boolean).forEach(r => updates.push(r));

    if (i + BATCH < urlsToMigrate.length) {
      await delay(500);
    }
  }

  console.log(`\n📊 Résultat: ${migrated} migrées, ${failed} échouées`);

  if (updates.length > 0) {
    console.log(`\n💾 Mise à jour de la base de données...`);
    for (const u of updates) {
      await prisma.puppy.update({
        where: { id: u.puppyId },
        data: { [u.field]: u.newUrl },
      });
    }
    console.log(`✅ ${updates.length} URLs mises à jour dans la base de données`);
  }

  await prisma.$disconnect();
  console.log('\n🎉 Migration terminée !');
}

main().catch(e => { console.error('❌ Erreur fatale:', e); process.exit(1); });
