import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";



//  POST — Add a new idea
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, title, description, anonymous } = await request.json();
    console.log(category, title, description, anonymous);

    if (!category || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newIdea = await prisma.ideas.create({
      data: {
        userId: session.user.id,
        category,
        title,
        description,
        anonymous: anonymous ?? false,
      },
    });

    

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error("Error adding idea:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  GET — Get all ideas (optional filter by category)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const skip = (page - 1) * pageSize;

    const ideas = await prisma.ideas.findMany({
      where: category ? { category: category as any } : {},
      include: {
        user: {
          select: { id: true, username: true, image: true },
        },
        likes: {
          where: { userId },
          select: { id: true },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip,
    });

    // Add boolean currentUserLiked
    const ideasWithLikeFlag = ideas.map((idea) => ({
      ...idea,
      currentUserLiked: idea.likes.length > 0,
    }));

    const totalCount = await prisma.ideas.count({
      where: category ? { category: category as any } : {},
    });

    return NextResponse.json(
      { ideas: ideasWithLikeFlag, totalCount, page, pageSize },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

