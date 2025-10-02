// prisma/reset.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données...");

  // Ordre important : supprimer les relations d'abord
  await prisma.assignment.deleteMany();
  console.log("✓ Assignments supprimés");

  await prisma.event.deleteMany();
  console.log("✓ Events supprimés");

  await prisma.calendar.deleteMany();
  console.log("✓ Calendars supprimés");

  await prisma.user.deleteMany();
  console.log("✓ Users supprimés");

  console.log("Base de données nettoyée !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
