import { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    /**
     * Extend the default Session.user with an `id` property added in callbacks.
     */
    user: {
      id?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
  }
}
