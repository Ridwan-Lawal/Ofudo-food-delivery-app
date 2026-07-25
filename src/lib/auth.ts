import { sendVerificationOtp } from "@/features/auth/services/resend";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    expo(),
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      allowedAttempts: 5,
      resendStrategy: "reuse",
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendVerificationOtp({ to: email, otp });
        }
      },
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  trustedOrigins: [
    // Basic scheme
    "ofudo://",

    // Production & staging schemes
    "ofudo-prod://",
    "ofudo-staging://",

    // Wildcard support for all paths following the scheme
    "ofudo://*",

    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://", // Trust all Expo URLs (prefix matching)
          "exp://**", // Trust all Expo URLs (wildcard matching)
          "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
        ]
      : []),
  ],
});
