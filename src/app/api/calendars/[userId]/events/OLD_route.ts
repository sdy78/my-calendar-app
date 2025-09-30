import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

// POST /api/calendars/:calendarId/events
export async function POST(
  req: Request,
  context: { params: Promise<{ calendarId: string }> }
) {
  try {
    const { title, start, end } = await req.json();
    const { calendarId } = await context.params;
    const id = parseInt(calendarId, 10);

    if (!title || !start) {
      return NextResponse.json(
        { error: "title et start sont obligatoires" },
        { status: 400 }
      );
    }

    const calendar = await prisma.calendar.findUnique({
      where: { id },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendrier non trouvé" },
        { status: 404 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : null,
        calendarId: id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
