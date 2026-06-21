// StudyPilot AI — Database types
// Hand-written to mirror prisma/schema.prisma exactly, since this environment
// cannot run `prisma generate` (see README "Architecture decisions" section).
// In an environment with normal internet access, these can be replaced by
// importing types from '@prisma/client' after running `npx prisma generate`.

// ───────────────────────── Enums ─────────────────────────

export type Role = "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";

export type GradeLevel = "JSS1" | "JSS2" | "JSS3" | "SS1" | "SS2" | "SS3";

export type SubjectCategory =
  | "CORE"
  | "SCIENCES"
  | "ARTS_HUMANITIES"
  | "COMMERCIAL"
  | "TRADE_VOCATIONAL";

export type ExplanationMode = "BEGINNER" | "STANDARD" | "ADVANCED" | "PIDGIN";

export type QuestionType =
  | "MCQ"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "SHORT_ANSWER"
  | "MATCHING";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type QuizMode = "PRACTICE" | "MOCK_EXAM" | "WEAK_AREAS" | "SPEED_ROUND";

export type ExamBoard = "WAEC" | "JAMB" | "NECO" | "NABTEB" | "GCSE" | "SAT";

export type PlanItemType =
  | "LESSON"
  | "QUIZ"
  | "REVISION"
  | "PRACTICE"
  | "MOCK_EXAM"
  | "REVIEW";

export type PackType = "SUBJECT" | "EXAM" | "TOPIC";

export type ResourceType =
  | "NOTES"
  | "FLASHCARDS"
  | "CHEATSHEET"
  | "MINDMAP"
  | "QUESTIONS";

export type ResourceFormat = "PDF" | "DOCX" | "INLINE";

export type ConsentStatus = "PENDING" | "APPROVED" | "EXPIRED";

export type ModerationAction =
  | "AUTO_FILTERED"
  | "FLAGGED"
  | "BLOCKED"
  | "APPROVED"
  | "REMOVED";

export type CacheType =
  | "TUTOR_EXPLANATION"
  | "STEP_LESSON"
  | "QUIZ_GEN"
  | "HOMEWORK_HINT"
  | "RESOURCE_GEN"
  | "STUDY_PLAN";

// ───────────────────────── Core identity ─────────────────────────

export interface UserRow {
  id: string;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  name: string;
  role: Role;
  dateOfBirth: Date | null;
  retainAnswers: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenRow {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface ParentConsentRow {
  id: string;
  studentId: string;
  parentEmail: string;
  token: string;
  status: ConsentStatus;
  requestedAt: Date;
  approvedAt: Date | null;
  expiresAt: Date;
}

export interface ParentChildLinkRow {
  id: string;
  parentId: string;
  studentId: string;
  linkedAt: Date;
}

// ───────────────────────── Role profiles ─────────────────────────

export interface StudentProfileRow {
  userId: string;
  gradeLevel: GradeLevel;
  school: string | null;
  examBoards: ExamBoard[];
  dailyStudyMinutesGoal: number;
  xp: number;
  streakCount: number;
  lastStudyDate: Date | null;
  defaultExplanationMode: ExplanationMode;
  lowBandwidthMode: boolean;
  voiceEnabled: boolean;
}

export interface ParentProfileRow {
  userId: string;
  dailySummaryEmail: boolean;
  weeklyReportEmail: boolean;
  weakAreaAlerts: boolean;
}

export interface TeacherProfileRow {
  userId: string;
  school: string | null;
}

// ───────────────────────── Classrooms ─────────────────────────

export interface ClassroomRow {
  id: string;
  teacherId: string;
  name: string;
  joinCode: string;
  gradeLevel: GradeLevel;
  createdAt: Date;
}

export interface ClassroomMembershipRow {
  id: string;
  classroomId: string;
  studentId: string;
  joinedAt: Date;
}

export interface LearningGoalRow {
  id: string;
  classroomId: string;
  title: string;
  subjectId: string | null;
  targetScore: number | null;
  dueDate: Date | null;
  createdAt: Date;
}

// ───────────────────────── Curriculum ─────────────────────────

export interface SubjectRow {
  id: string;
  name: string;
  category: SubjectCategory;
  levels: GradeLevel[];
  topicCount: number;
}

export interface StudentSubjectRow {
  id: string;
  studentId: string;
  subjectId: string;
  addedAt: Date;
}

export interface TopicRow {
  id: string;
  subjectId: string;
  title: string;
  level: GradeLevel;
  difficulty: Difficulty;
  order: number;
}

// ───────────────────────── AI cache ─────────────────────────

export interface AIResponseCacheRow {
  id: string;
  cacheKey: string;
  type: CacheType;
  requestJson: unknown;
  responseJson: unknown;
  modelUsed: string;
  createdAt: Date;
  expiresAt: Date;
}

// ───────────────────────── Quiz engine ─────────────────────────

export interface QuizQuestionRow {
  id: string;
  subjectId: string;
  topicId: string | null;
  type: QuestionType;
  questionText: string;
  options: unknown;
  correctAnswer: unknown;
  explanation: string;
  difficulty: Difficulty;
  examBoard: ExamBoard | null;
  aiGenerated: boolean;
  createdAt: Date;
}

export interface QuizRow {
  id: string;
  studentId: string;
  subjectId: string;
  topicId: string | null;
  mode: QuizMode;
  startedAt: Date;
  completedAt: Date | null;
  totalQuestions: number;
  score: number | null;
  xpEarned: number;
}

export interface QuizAttemptAnswerRow {
  id: string;
  quizId: string;
  questionId: string;
  studentAnswer: unknown;
  isCorrect: boolean;
  timeTakenSeconds: number | null;
  answeredAt: Date;
}

// ───────────────────────── Homework ─────────────────────────

export interface HomeworkSessionRow {
  id: string;
  studentId: string;
  subjectId: string | null;
  questionText: string;
  imageUrl: string | null;
  hintsGiven: number;
  resolved: boolean;
  createdAt: Date;
}

// ───────────────────────── Study planner ─────────────────────────

export interface StudyPlanEntryRow {
  id: string;
  studentId: string;
  date: Date;
  subjectId: string | null;
  topicTitle: string;
  type: PlanItemType;
  durationMinutes: number;
  completed: boolean;
  generatedByAI: boolean;
  createdAt: Date;
}

export interface ExamCountdownRow {
  id: string;
  studentId: string;
  examBoard: ExamBoard;
  examDate: Date;
  subjects: string[];
  createdAt: Date;
}

// ───────────────────────── Gamification ─────────────────────────

export interface AchievementRow {
  id: string;
  key: string;
  label: string;
  description: string;
  iconKey: string;
}

export interface StudentAchievementRow {
  id: string;
  studentId: string;
  achievementId: string;
  earnedAt: Date;
}

// ───────────────────────── Offline ─────────────────────────

export interface OfflinePackRow {
  id: string;
  key: string;
  name: string;
  type: PackType;
  subjectId: string | null;
  examBoard: ExamBoard | null;
  sizeMB: number;
  version: number;
  createdAt: Date;
}

export interface StudentOfflineDownloadRow {
  id: string;
  studentId: string;
  packId: string;
  downloadedAt: Date;
  downloadedVersion: number;
  lastSyncedAt: Date;
}

export interface SyncLogEntryRow {
  id: string;
  studentId: string;
  clientActionId: string;
  actionType: string;
  payload: unknown;
  appliedAt: Date;
  success: boolean;
}

// ───────────────────────── Resources ─────────────────────────

export interface ResourceGenerationRow {
  id: string;
  studentId: string;
  subjectId: string | null;
  topic: string;
  resourceType: ResourceType;
  contentJson: unknown;
  format: ResourceFormat;
  createdAt: Date;
}

// ───────────────────────── Notifications & moderation ─────────────────────────

export interface NotificationRow {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ModerationFlagRow {
  id: string;
  contentType: string;
  contentRef: string | null;
  studentId: string | null;
  reason: string;
  action: ModerationAction;
  createdAt: Date;
  reviewedBy: string | null;
  reviewedAt: Date | null;
}

// ───────────────────────── API-level shared types ─────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}
