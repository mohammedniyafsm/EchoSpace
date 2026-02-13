import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") return null;

  return session;
}

// GET
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const section = await prisma.section.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!section) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await context.params;
  const { topic, category, date } = await req.json();

  try {
    const updatedSession = await prisma.section.update({
      where: { id },
      data: {
        topic,
        category,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
