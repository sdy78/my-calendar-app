import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';


// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'email et role sont obligatoires' },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { role },
      create: {
        email,
        role,
        name: email.split('@')[0], // optionnel
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
