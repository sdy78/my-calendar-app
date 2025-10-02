// src/app/api/events/[id]/route.ts
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
    const { title, description, start, end } = body;

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
        description: description !== undefined ? description : existingEvent.description,
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