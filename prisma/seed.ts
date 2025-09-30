import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  // Créer quelques utilisateurs de test
  const prescripteur = await prisma.user.upsert({
    where: { email: 'prescripteur@test.com' },
    update: {},
    create: {
      email: 'prescripteur@test.com',
      name: 'Prescripteur Test',
      role: 'PRESCRIPTEUR', // adapte au type de ta colonne
    },
  });

  const referent = await prisma.user.upsert({
    where: { email: 'referent@test.com' },
    update: {},
    create: {
      email: 'referent@test.com',
      name: 'Référent Test',
      role: 'REFERENT',
    },
  });

  const beneficiaire = await prisma.user.upsert({
    where: { email: 'beneficiaire@test.com' },
    update: {},
    create: {
      email: 'beneficiaire@test.com',
      name: 'Bénéficiaire Test',
      role: 'BENEFICIAIRE',
    },
  });

  // Créer un calendrier pour le bénéficiaire
  const calendar = await prisma.calendar.create({
    data: {
      name: 'Calendrier du bénéficiaire',
      ownerId: beneficiaire.id,
    },
  });

  // Créer un événement test sur ce calendrier
  await prisma.event.create({
    data: {
      title: 'Premier rendez-vous',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      calendarId: calendar.id,
    },
  });

  console.log('Seed terminé : ✅');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
