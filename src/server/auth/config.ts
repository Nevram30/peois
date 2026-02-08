import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import { type UserRole } from "../../../generated/prisma";
import { edgeAuthConfig } from "./edge-config";

/**
 * Full auth config — extends the edge config with DB-dependent providers,
 * callbacks, and events. Only used in the Node.js runtime (API routes / RSC).
 */
export const authConfig = {
  ...edgeAuthConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...edgeAuthConfig.callbacks,
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // Create DB session record (don't let failures break sign-in)
        try {
          const dbSession = await db.userSession.create({
            data: {
              userId: user.id!,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
          token.sessionId = dbSession.id;
        } catch {
          // DB may be temporarily unreachable; sign-in still works via JWT
        }
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
  events: {
    signOut: async (message) => {
      if ("token" in message && message.token?.sessionId) {
        await db.userSession
          .delete({
            where: { id: message.token.sessionId as string },
          })
          .catch(() => {
            // Already deleted
          });
      }
    },
  },
} satisfies NextAuthConfig;
