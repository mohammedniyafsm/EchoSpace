import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
