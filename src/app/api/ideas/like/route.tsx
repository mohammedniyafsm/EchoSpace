import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

//  ADD LIKE
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId } = await req.json();

    await prisma.ideaLike.create({
      data: {
        ideaId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Liked" });
  } catch (error: any) {
    // handle unique constraint crash
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Already liked" });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//  REMOVE LIKE
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId } = await req.json();

    await prisma.ideaLike.delete({
      where: {
        ideaId_userId: {
          ideaId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ message: "Unliked" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
