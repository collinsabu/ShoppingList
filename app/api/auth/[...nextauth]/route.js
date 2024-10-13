import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByUsername } from "@/lib/user"; // Ensure this exists

const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await getUserByUsername(credentials.username);
        if (user && (await compare(credentials.password, user.password))) {
          return user;
        }
        throw new Error("Invalid credentials");
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
