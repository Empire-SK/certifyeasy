import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminByEmail, verifyPassword } from "@/lib/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const admin = await getAdminByEmail(credentials.email);

        if (!admin) {
          throw new Error("Admin not found");
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          admin.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: admin.id,
          email: admin.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
