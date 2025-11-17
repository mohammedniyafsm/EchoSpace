import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

//  GET — Fetch one idea
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = await params.id;
    const idea = await prisma.ideas.findUnique({
      where: { id: id },
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
      },
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea, { status: 200 });
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  PATCH — Update an idea (only by the author)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } =  await params;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.ideas.findUnique({ where:  { id } });
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const { category, title, description, anonymous } = await request.json();

    const updated = await prisma.ideas.update({
      where: { id },
      data: {
        category: category ?? existing.category,
        title: title ?? existing.title,
        description: description ?? existing.description,
        anonymous: anonymous ?? existing.anonymous,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  DELETE — Delete an idea (only by the author)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } =  await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.ideas.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.ideas.delete({ where: { id } });
    return NextResponse.json({ message: "Idea deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
