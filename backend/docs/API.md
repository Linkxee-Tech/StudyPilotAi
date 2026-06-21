# StudyPilot AI — Backend API Reference

Base URL (local dev): `http://localhost:4000/api`

All responses follow one of two shapes:

```json
{ "success": true, "data": { ... } }
```
```json
{ "success": false, "error": { "code": "SOME_CODE", "message": "Human-readable message", "details": { } } }
```

Authenticated routes require `Authorization: Bearer <accessToken>`. Access tokens expire in 15 minutes; use `/auth/refresh` to get a new pair.

Error codes you'll see across routes: `VALIDATION_ERROR` (400), `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500), `AI_UNAVAILABLE` (503).

---

## Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | none | Create an account. Body: `email, password, name, role, gradeLevel?, examBoards?, school?, dateOfBirth?, parentEmail?`. Students under 13 must supply `parentEmail`; response includes `requiresParentConsent`. |
| POST | `/login` | none | Body: `email, password`. Returns `user` + `tokens`. |
| POST | `/refresh` | none | Body: `refreshToken`. Rotates the token — the old one is revoked. |
| POST | `/logout` | none | Body: `refreshToken`. Revokes that one token. |
| POST | `/logout-all` | Bearer | Revokes every refresh token for the current user (all devices). |
| POST | `/consent/request` | Bearer | Body: `parentEmail`. Creates a 7-day consent link for an under-13 student. |
| POST | `/consent/approve` | none | Body: `token` (from the consent link). Approves the request. |

Rate limit: 20 requests / 15 min per IP on `/register`, `/login`.

---

## AI Tutor — `/tutor`
Role: STUDENT. Rate limit: shared AI daily quota (`RATE_LIMIT_PROMPTS_PER_DAY`, default 100/day/user).

| Method | Path | Description |
|---|---|---|
| POST | `/explain` | Body: `topic, subject, gradeLevel, mode` (`BEGINNER\|STANDARD\|ADVANCED\|PIDGIN`). Returns `{ definition, keyConcepts[], examples[], analogy, realLifeApplication, summary }`. |
| POST | `/lesson` | Body: `topic, subject, gradeLevel`. Returns the 6-part lesson: `{ introduction, conceptBreakdown, workedExamples, commonMistakes, practiceQuestions[], recap }`. |

---

## Quiz — `/quiz`
Role: STUDENT.

| Method | Path | Description |
|---|---|---|
| POST | `/generate` | Body: `subjectId, topicId?, topic, subject, gradeLevel, questionTypes[], count, difficulty, examBoard?, mode`. Generates questions via Gemini, persists them, creates a `Quiz` session. Returns `{ quizId, questions[] }`. |
| POST | `/answer` | Body: `quizId, questionId, studentAnswer, timeTakenSeconds?`. Grades immediately per question type and records the attempt. Returns `{ isCorrect, explanation }`. |
| POST | `/finish` | Body: `quizId`. Computes final score, awards XP (10/correct + 20 pass bonus at ≥70%), updates streak, may award `quiz-master` / `seven-day-streak` achievements. |
| GET | `/recent` | Last 10 completed quizzes. |
| GET | `/mastery` | Per-subject average score — backs weak-area detection. |

Grading logic by type: MCQ/TRUE_FALSE are index comparisons; FILL_BLANK is case-insensitive trimmed string match; MATCHING requires every pair correct; SHORT_ANSWER is graded by a lenient AI call against a model answer (not exact match).

---

## Homework Assistant — `/homework`
Role: STUDENT. The hint stage is tracked server-side per session — a client cannot skip ahead or request "the answer" directly; there is no such endpoint.

| Method | Path | Description |
|---|---|---|
| POST | `/start` | Body: `questionText, subjectId?, imageUrl?`. Creates a session. |
| POST | `/hint` | Body: `sessionId, subject?, gradeLevel?`. Returns the next hint in the progression (concept ID → method → worked similar example). Never returns the final answer. |
| POST | `/resolve` | Body: `sessionId`. Marks the session resolved once the student has solved it. |

---

## Study Library — `/library`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/subjects` | none | Query: `category?, level?, search?`. Browse the 76-subject curriculum. |
| GET | `/subjects/:subjectId/topics` | none | Query: `level?`. |
| POST | `/subjects/enroll` | Bearer (STUDENT) | Body: `subjectId`. |
| GET | `/subjects/mine` | Bearer (STUDENT) | Subjects the student is enrolled in. |
| GET | `/offline-packs` | none | Query: `type?` (`SUBJECT\|EXAM\|TOPIC`). |
| POST | `/offline-packs/download` | Bearer (STUDENT) | Body: `packKey`. Records the download for sync tracking. |

---

## Progress — `/progress`
Role: STUDENT.

| Method | Path | Description |
|---|---|---|
| GET | `/overview` | XP, streak, per-subject mastery, weak subjects (avg score < 50), recent quizzes, achievements (earned + locked). |

---

## Study Planner — `/planner`
Role: STUDENT.

| Method | Path | Description |
|---|---|---|
| POST | `/generate` | Body: `subjects[], weakSubjects[], examBoard?, daysUntilExam?, dailyStudyMinutes, planLengthDays`. AI-generates and persists a day-by-day schedule. |
| GET | `/week` | Query: `from` (date). Returns plan entries for the following 7 days. |
| POST | `/entries/complete` | Body: `entryId`. |
| POST | `/exam-countdown` | Body: `examBoard, examDate, subjects[]`. |
| GET | `/exam-countdown` | Active countdowns with computed `daysRemaining`. |

---

## Resource Generator — `/resources`
Role: STUDENT.

| Method | Path | Description |
|---|---|---|
| POST | `/generate` | Body: `topic, subject, gradeLevel, resourceType` (`NOTES\|FLASHCARDS\|CHEATSHEET\|MINDMAP\|QUESTIONS`), `subjectId?, format?`. |
| GET | `/recent` | Last 20 generated resources. |

---

## Student profile/settings — `/student`
Role: STUDENT (except where noted).

| Method | Path | Description |
|---|---|---|
| GET | `/me` | Full student profile. |
| PATCH | `/me` | Update settings: `dailyStudyMinutesGoal, defaultExplanationMode, lowBandwidthMode, voiceEnabled`. |
| PATCH | `/me/data-retention` | Bearer (any role). Body: `retain` (boolean) — GDPR opt-in to keep answers beyond 30 days. |
| GET | `/me/export` | Bearer (any role). Full GDPR data export across every table referencing the user. |
| DELETE | `/me` | Bearer (any role). Deletes the account (cascades to all owned data). |

---

## Parent Dashboard — `/parent`
Role: PARENT.

| Method | Path | Description |
|---|---|---|
| POST | `/children/link` | Body: `studentId`. |
| GET | `/children` | List linked children. |
| GET | `/children/:studentId/progress` | Same shape as `/progress/overview`, authorization-checked against the parent-child link. |

---

## Teacher Dashboard — `/teacher`
Role: TEACHER (except `/classrooms/join`, which is STUDENT).

| Method | Path | Description |
|---|---|---|
| POST | `/classrooms` | Body: `name, gradeLevel`. Generates a join code (`SP-XXXXXX`). |
| GET | `/classrooms` | List the teacher's classrooms. |
| GET | `/classrooms/:classroomId/roster` | Students ranked by XP. Ownership-checked. |
| POST | `/classrooms/join` | Role: STUDENT. Body: `joinCode`. |
| POST | `/classrooms/:classroomId/goals` | Body: `title, subjectId?, targetScore?, dueDate?`. |
| GET | `/classrooms/:classroomId/goals` | |

---

## Admin Dashboard — `/admin`
Role: ADMIN for all routes below.

| Method | Path | Description |
|---|---|---|
| GET | `/users` | Query: `role?, search?, page?, pageSize?`. |
| POST | `/users/:userId/deactivate` | |
| POST | `/users/:userId/reactivate` | |
| GET | `/analytics` | Platform totals, today's completed quizzes, average score, top subjects by activity. |
| GET | `/moderation` | Query: `action?`. Moderation flag queue. |
| POST | `/moderation/:flagId/review` | Body: `action`. |

---

## Offline Sync — `/sync`
Role: STUDENT.

| Method | Path | Description |
|---|---|---|
| POST | `/batch` | Body: `actions[]`, each `{ clientActionId, type, payload, clientTimestamp }`. Processes a batch of actions queued while offline. Idempotent — replaying the same `clientActionId` returns `already_applied` rather than re-applying. `SETTINGS_UPDATED` actions are skipped if the server has newer data than `clientTimestamp` (last-write-wins). |

Supported action types: `QUIZ_ANSWER_SUBMITTED`, `QUIZ_COMPLETED`, `STUDY_PLAN_ENTRY_COMPLETED`, `SETTINGS_UPDATED`.

---

## Health — `/health`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Returns `{ status, database, redis, timestamp }`. 503 if either dependency is down. |

---

## Rate limits summary

- General traffic: 300 requests / 15 min per user-or-IP.
- AI-workflow routes (tutor, quiz generation, homework hints, resources, planner): `RATE_LIMIT_PROMPTS_PER_DAY` (default 100) per user / 24h.
- Auth routes (`/register`, `/login`): 20 / 15 min per IP.

All three are backed by real Redis (`rate-limit-redis`), so limits are correctly shared across multiple server instances in production.
