// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

const VALID_ROLES = ['PRESCRIPTEUR', 'REFERENT', 'BENEFICIAIRE'] as const;

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role, name } = body;

    // Validation des champs obligatoires
    if (!email || !role || !name) {
      return NextResponse.json(
        { error: 'email, role et name sont obligatoires' },
        { status: 400 }
      );
    }

    // Validation stricte du rôle
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Role invalide. Roles possibles: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { calendars: true },
    });

    let user;
    let created = false;

    if (!existingUser) {
      // Nouvel utilisateur → on le crée avec un calendrier
      user = await prisma.user.create({
        data: {
          email,
          role,
          name,
          calendars: { create: {} },
        },
        include: { calendars: true },
      });
      created = true;
    } else {
      // Vérifier si les infos sont différentes
      const needsUpdate =
        existingUser.role !== role || existingUser.name !== name;

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { email },
          data: { role, name },
          include: { calendars: true },
        });
      } else {
        user = existingUser;
      }

      // Créer un calendrier si jamais il n’y en a pas
      if (user.calendars.length === 0) {
        const newCalendar = await prisma.calendar.create({
          data: { ownerId: user.id },
        });
        user = { ...user, calendars: [newCalendar] };
      }
    }

    return NextResponse.json(user, { status: created ? 201 : 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany({
    include: { calendars: true },
  });
  return NextResponse.json(users);
}
