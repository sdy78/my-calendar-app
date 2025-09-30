import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// PUT /api/events/:id
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    const body = await req.json();
    const { title, start, end } = body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title ?? existingEvent.title,
        start: start ? new Date(start) : existingEvent.start,
        end: end ? new Date(end) : existingEvent.end,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/events/:id
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json(
      { message: "Événement supprimé" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET /api/calendars/:userId/events
export async function GET(
    req: Request,
    context: { params: Promise<{ userId: string }> }
  ) {
    try {
      const { userId } = await context.params;
      const userIdInt = parseInt(userId, 10);
  
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
        // Si le calendrier n'existe pas, on peut le créer automatiquement
        const newCalendar = await prisma.calendar.create({
          data: {
            ownerId: userIdInt,
          },
          include: { events: true },
        });
        return NextResponse.json(newCalendar.events, { status: 200 });
      }
  
      return NextResponse.json(calendar.events, { status: 200 });
    } catch (err) {
      console.error("Erreur lors de la récupération des événements:", err);
      return NextResponse.json(
        { error: "Erreur serveur" },
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
  
      return NextResponse.json(newEvent, { status: 201 });
    } catch (err) {
      console.error("Erreur lors de la création de l'événement:", err);
      return NextResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
      );
    }
  }