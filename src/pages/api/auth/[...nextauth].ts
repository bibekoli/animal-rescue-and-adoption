import { z } from "zod";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ConnectToDatabase from "@/functions/mongodb";
import { hashString } from "@/functions/functions";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  callbacks: {
    signIn: async({ user, account }): Promise<any> => {
      if (!user || !account || !user.name || !user.email) {
        throw new Error("No User or Account Provided");
      }

      const { db } = await ConnectToDatabase();
      const loginProvider = account.provider as string;

      const users = db.collection("Users");
      const userExists = await users.findOne({
        email: user.email
      });

      if (loginProvider === "google") {
        if (!userExists) {
          const randomPassword = "123456";
          const userName = user.email.split("@")[0];

          const newUser = {
            name: user.name,
            email: user.email,
            userName: userName,
            password: hashString(randomPassword),
            createdAt: new Date(),
            isAdmin: false
          };

          const response = await users.insertOne(newUser);
          if (response.insertedId) {
            return true;
          }
          else {
            throw new Error("Could Not Create User");
          }
        }
        return true;
      }
    },
    session: async({ session, token }) => {
      session.user = token;
      return session;
    },
    jwt: async({ token, user, trigger, session }) => {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        }
      }
      return {
        ...token,
        ...user,
      }
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});