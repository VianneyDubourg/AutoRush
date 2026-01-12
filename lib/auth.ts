import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./auth.db",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
})

export type Session = typeof auth.$Infer.Session
