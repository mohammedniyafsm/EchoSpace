import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import AdminPanel from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/feedback");
  }

  return <AdminPanel />;
}
