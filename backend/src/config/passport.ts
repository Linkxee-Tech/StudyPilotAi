import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import { findOrCreateGoogleUser } from "../services/auth.service";
import { logger } from "../lib/logger";

/**
 * Registers the Google OAuth2 strategy. Only activates if both client
 * credentials are configured — in environments without them (like this
 * sandbox, which also has no outbound network access to accounts.google.com
 * to verify a real strategy anyway), the routes that depend on this will
 * return a clear 503 rather than crashing the server on startup.
 */
export function configureGoogleStrategy(): boolean {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    logger.warn("Google OAuth not configured (GOOGLE_CLIENT_ID/SECRET missing) — /auth/google routes will return 503");
    return false;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google profile did not include an email address"));
          }
          const user = await findOrCreateGoogleUser({
            googleId: profile.id,
            email,
            name: profile.displayName || email,
          });
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      },
    ),
  );

  return true;
}

export { passport };
