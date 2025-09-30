import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

// GET /api/calendars/:userId/events
export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const userIdInt = parseInt(userId, 10);

    //console.log("Récupération des événements pour userId:", userIdInt);

    // Récupérer le calendrier de l'utilisateur
    const calendar = await prisma.calendar.findFirst({
      where: { ownerId: userIdInt },
      include: {
        events: {
          orderBy: { start: "asc" },
        },
      },
    });

    if (!calendar) {
     // console.log("Aucun calendrier trouvé, création d'un nouveau");
      // Si le calendrier n'existe pas, on peut le créer automatiquement
      const newCalendar = await prisma.calendar.create({
        data: {
          ownerId: userIdInt,
        },
        include: { events: true },
      });
      return NextResponse.json(newCalendar.events, { status: 200 });
    }

   // console.log(`${calendar.events.length} événements trouvés`);
    return NextResponse.json(calendar.events, { status: 200 });
  } catch (err) {
    console.error("Erreur lors de la récupération des événements:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    );
  }
}

// POST /api/calendars/:userId/events
export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const userIdInt = parseInt(userId, 10);

    const body = await req.json();
    const { title, start, end } = body;

    console.log("Création d'événement:", { userId: userIdInt, title, start, end });

    if (!title || !start) {
      return NextResponse.json(
        { error: "Titre et date de début requis" },
        { status: 400 }
      );
    }

    // Trouver ou créer le calendrier
    let calendar = await prisma.calendar.findFirst({
      where: { ownerId: userIdInt },
    });

    if (!calendar) {
      console.log("Création du calendrier pour l'utilisateur", userIdInt);
      calendar = await prisma.calendar.create({
        data: { ownerId: userIdInt },
      });
    }

    // Créer l'événement
    const newEvent = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : new Date(start),
        calendarId: calendar.id,
      },
    });

    console.log("Événement créé:", newEvent);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error("Erreur lors de la création de l'événement:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: String(err) },
      { status: 500 }
    );
  }
}