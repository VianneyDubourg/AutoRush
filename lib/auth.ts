import { betterAuth } from "better-auth"
import { oauth } from "better-auth/plugins"

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./auth.db",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    oauth({
      providers: [
        {
          id: "google",
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          scope: ["openid", "email", "profile"],
        },
        {
          id: "github",
          clientId: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
          scope: ["read:user", "user:email"],
        },
        {
          id: "apple",
          clientId: process.env.APPLE_CLIENT_ID || "",
          clientSecret: process.env.APPLE_CLIENT_SECRET || "",
          scope: ["name", "email"],
        },
        {
          id: "discord",
          clientId: process.env.DISCORD_CLIENT_ID || "",
          clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
          scope: ["identify", "email"],
        },
      ],
    }),
  ],
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
})

export type Session = typeof auth.$Infer.Session
