import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Nettoyage (attention en production !)
  await prisma.assignment.deleteMany();
  await prisma.event.deleteMany();
  await prisma.calendar.deleteMany();
  await prisma.user.deleteMany();

  // Création de prescripteurs
  await prisma.user.createMany({
    data: [
      { email: 'prescripteur1@test.com', name: 'Prescripteur 1', role: 'PRESCRIPTEUR' },
      { email: 'prescripteur2@test.com', name: 'Prescripteur 2', role: 'PRESCRIPTEUR' }
    ]
  });

  // Création de référents
  await prisma.user.createMany({
    data: [
      { email: 'referent1@test.com', name: 'Référent 1', role: 'REFERENT' },
      { email: 'referent2@test.com', name: 'Référent 2', role: 'REFERENT' }
    ]
  });

  // Récupération des managers (prescripteurs + référents)
  const allManagers = await prisma.user.findMany({
    where: { role: { in: ['PRESCRIPTEUR', 'REFERENT'] } }
  });

  // Création des bénéficiaires, calendriers et événements
  for (let i = 1; i <= 5; i++) {
    // Génére le nom/prénom/email de façon unique
    const day = (i + 1).toString().padStart(2, '0');

    // Génère des dates ISO valides
    const startMedical = new Date(`2025-10-${day}T09:00:00Z`);
    const endMedical = new Date(`2025-10-${day}T10:00:00Z`);
    const startAtelier = new Date(`2025-10-${day}T14:00:00Z`);
    const endAtelier = new Date(`2025-10-${day}T16:00:00Z`);

    const beneficiaire = await prisma.user.create({
      data: {
        email: `beneficiaire${i}@test.com`,
        name: `Bénéficiaire ${i}`,
        role: 'BENEFICIAIRE',
        calendars: {
          create: {
            events: {
              create: [
                {
                  title: 'Rendez-vous médical',
                  start: startMedical,
                  end: endMedical
                },
                {
                  title: 'Atelier formation',
                  start: startAtelier,
                  end: endAtelier
                }
              ]
            }
          }
        }
      },
      include: { calendars: true }
    });

    // Attribution d'un manager au hasard
    const randomManager = allManagers[Math.floor(Math.random() * allManagers.length)];

    await prisma.assignment.create({
      data: {
        managerId: randomManager.id,
        beneficiaryId: beneficiaire.id,
        role: randomManager.role
      }
    });

    console.log(`Bénéficiaire ${beneficiaire.email} assigné à ${randomManager.role}`);
  }

  console.log('Seeding terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
