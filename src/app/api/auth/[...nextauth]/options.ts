import { prisma } from "@/lib/prisma";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";

type SessionUserWithRole = {
  id?: string;
  email?: string;
  username?: string;
  role?: "USER" | "ADMIN";
};

type CallbackUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  dbId?: string;
  role?: "USER" | "ADMIN";
};

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const callbackUser = user as CallbackUser;
        let existingUser = await prisma.user.findFirst({
          where: { githubId: callbackUser.id },
        })

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              username: callbackUser.name ?? "Unknown User",
              email: callbackUser.email,
              image: callbackUser.image ?? "",
              githubId: callbackUser.id?.toString() ?? "",
            },
          });
        }

        callbackUser.dbId = existingUser.id;
        callbackUser.role = existingUser.role;
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        const callbackUser = user as CallbackUser;
        token.id = callbackUser.dbId ?? token.id;
        token.email = callbackUser.email ?? undefined;
        token.username = callbackUser.name ?? "Unknown User";
        token.role = callbackUser.role ?? token.role;
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        const user = session.user as SessionUserWithRole;
        user.id = token.id;
        user.email = token.email;
        user.username = token.username ?? "Unknown User";
        user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
