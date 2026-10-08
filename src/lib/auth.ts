import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // กฎ 6.8 (5): จำกัดโดเมนอีเมลมหาวิทยาลัยผ่าน env ALLOWED_EMAIL_DOMAIN ถ้ามีการตั้งค่า
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim();
      if (allowedDomain) {
        const emailDomain = user.email.split("@")[1];
        if (emailDomain !== allowedDomain) {
          return false;
        }
      }

      // ตรวจสอบสิทธิ์ ADMIN จาก ADMIN_EMAILS
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const role = user.email && adminEmails.includes(user.email.toLowerCase()) ? "ADMIN" : "USER";

      // ซิงค์ข้อมูลผู้ใช้เข้าตาราง User ใน Prisma SQLite
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            role,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role,
          },
        });
      } catch (err) {
        console.error("Error upserting user in signIn callback:", err);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        // ค้นหา ID ของ User จากตาราง User ใน Prisma
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (err) {
          console.error("Error fetching user in jwt callback:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // @ts-expect-error - role custom field
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
