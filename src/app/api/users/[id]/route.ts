// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

const VALID_ROLES = ['PRESCRIPTEUR', 'REFERENT', 'BENEFICIAIRE'] as const;

// PUT /api/users/:id
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params est un Promise
) {
  try {
    const body = await req.json();
    const { email, role, name } = body;

    const { id } = await context.params; // 👈 on doit attendre
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { calendars: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Role invalide. Roles possibles: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email ?? existingUser.email,
        role: role ?? existingUser.role,
        name: name ?? existingUser.name,
      },
      include: { calendars: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
