import { databaseDrizzle } from "@/db/database";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GitlabProvider, { GitLabProfile } from "next-auth/providers/gitlab";
import bcrypt from "bcrypt";
import { env } from "process";
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(databaseDrizzle),
  providers: [
    CredentialsProvider({
      name: "Sign in With...",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, _) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await databaseDrizzle.query.users.findFirst({
          where: (user, opt) => opt.eq(user.email, credentials.email),
        });
        if (!user || !user.hashedPassword) return null;
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        return passwordMatch ? user : null;
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID!,
      clientSecret: env.FACEBOOK_CLIENT_SECRET!,
      profile(profile: FacebookProfile) {
        return {
          id: profile.id,
          name: profile.name,
          image: profile.picture.data.url,
          email: profile.email,
        };
      },
    }),
    GithubProvider({
      clientId: env.GITHUB_ID!,
      clientSecret: env.GITHUB_SECRET!,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          image: profile.avatar_url,
          email: profile.email,
        };
      },
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
      profile(profile: GitLabProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          image: profile.avatar_url,
          email: profile.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  theme: {
    colorScheme: "light",
    brandColor: "#164863",
    logo: "/worknify_main_logo.svg",
    buttonText: "#fff",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
