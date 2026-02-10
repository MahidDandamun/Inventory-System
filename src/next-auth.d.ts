import { UserRole } from "@prisma/client";
import NextAuth, { User, type DefaultSession } from "next-auth"


export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: UserRole;
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
};
declare module "next-auth" {
  interface Session{
    user: ExtendedUser;
  }
}


 