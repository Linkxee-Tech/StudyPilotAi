import {
  findUserByEmail,
  findUserById,
  registerUserWithProfile,
} from "../repositories/user.repository";
import {
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} from "../repositories/refreshToken.repository";
import { createConsentRequest } from "../repositories/parent.repository";
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken, refreshTokenExpiryDate } from "../lib/jwt";
import { AppError } from "../lib/AppError";
import { logger } from "../lib/logger";
import type { Role, GradeLevel, ExamBoard, UserRow } from "../types/db";

const MINOR_AGE_THRESHOLD = 13;

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  dateOfBirth?: string; // ISO date string
  gradeLevel?: GradeLevel;
  examBoards?: ExamBoard[];
  school?: string;
  parentEmail?: string; // required if under 13
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function isUnder13(dateOfBirth?: string): boolean {
  if (!dateOfBirth) return false;
  const dob = new Date(dateOfBirth);
  const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return age < MINOR_AGE_THRESHOLD;
}

export async function register(input: RegisterInput): Promise<{ user: UserRow; tokens: AuthTokens; requiresParentConsent: boolean }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw AppError.conflict("An account with this email already exists.");
  }

  if (input.role === "STUDENT" && isUnder13(input.dateOfBirth) && !input.parentEmail) {
    throw AppError.badRequest(
      "Students under 13 require a parent or guardian email for consent before signing up.",
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await registerUserWithProfile(
    {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
    },
    {
      gradeLevel: input.gradeLevel,
      examBoards: input.examBoards,
      school: input.school,
    },
  );

  const requiresParentConsent = input.role === "STUDENT" && isUnder13(input.dateOfBirth);
  if (requiresParentConsent && input.parentEmail) {
    await createConsentRequest(user.id, input.parentEmail);
    logger.info("Parent consent requested", { studentId: user.id, parentEmail: input.parentEmail });
    // NOTE: actually emailing the parent requires an SMTP/email provider integration,
    // which is out of scope for this environment (no outbound network to mail providers
    // here). In production, wire this to e.g. SendGrid/Postmark/SES.
  }

  const tokens = await issueTokens(user.id, user.role);
  return { user, tokens, requiresParentConsent };
}

export async function login(email: string, password: string): Promise<{ user: UserRow; tokens: AuthTokens }> {
  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) {
    throw AppError.unauthorized("Invalid email or password.");
  }
  if (!user.isActive) {
    throw AppError.forbidden("This account has been deactivated. Contact support for help.");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized("Invalid email or password.");
  }

  const tokens = await issueTokens(user.id, user.role);
  return { user, tokens };
}

export async function issueTokens(userId: string, role: Role): Promise<AuthTokens> {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId, role });
  await storeRefreshToken(userId, refreshToken, refreshTokenExpiryDate());
  return { accessToken, refreshToken };
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const stored = await findValidRefreshToken(refreshToken);
  if (!stored) {
    throw AppError.unauthorized("Refresh token is invalid, expired, or has been revoked.");
  }

  const user = await findUserById(stored.userId);
  if (!user || !user.isActive) {
    throw AppError.unauthorized("Account not found or inactive.");
  }

  // Rotate: revoke the old refresh token and issue a fresh pair.
  await revokeRefreshToken(refreshToken);
  return issueTokens(user.id, user.role);
}

export async function logout(refreshToken: string): Promise<void> {
  await revokeRefreshToken(refreshToken);
}

export async function logoutAllDevices(userId: string): Promise<void> {
  await revokeAllUserTokens(userId);
}

/** Used by the Google OAuth callback (passport strategy) to find-or-create a user. */
export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
}): Promise<UserRow> {
  const existing = await findUserByEmail(profile.email);
  if (existing) return existing;

  return registerUserWithProfile({
    email: profile.email,
    passwordHash: null,
    googleId: profile.googleId,
    name: profile.name,
    role: "STUDENT", // default; role selection happens in onboarding after first login
  });
}
