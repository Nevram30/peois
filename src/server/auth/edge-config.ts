import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { UserRole } from "../../../generated/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      sessionId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

/**
 * Edge-compatible auth config — NO Prisma / DB imports.
 * Used by the middleware (Edge runtime) and extended by the full config.
 */
export const edgeAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers added in the full config
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        role: token.role as UserRole,
        sessionId: (token.sessionId as string) ?? "",
      },
    }),
  },
  trustHost: true,
} satisfies NextAuthConfig;
