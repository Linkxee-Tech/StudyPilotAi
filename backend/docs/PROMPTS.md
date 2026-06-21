# AI Prompt Templates

All prompts live in `src/prompts/` as typed builder functions — never raw strings scattered through services. Every prompt instructs Gemini to return ONLY a JSON object/array matching a documented shape, which the service layer parses via `generateJSON<T>()` (see `src/lib/gemini.ts`). On malformed output or repeated API failure, each workflow has a hand-written fallback so the user always gets *something* usable rather than an error page.

## 1. Tutor explanations — `tutorPrompts.ts: buildTutorExplanationPrompt`
Four modes (`BEGINNER`, `STANDARD`, `ADVANCED`, `PIDGIN`) each get a distinct instruction block. The Pidgin mode explicitly asks for Nigerian Pidgin sentence construction ("na the way wey...") while keeping untranslatable technical terms in English. Output shape: `definition, keyConcepts[], examples[], analogy, realLifeApplication, summary` — directly matching the spec's six required fields.

## 2. Step-by-step lessons — `tutorPrompts.ts: buildStepLessonPrompt`
Produces the six-part lesson (`introduction, conceptBreakdown, workedExamples, commonMistakes, practiceQuestions[], recap`), explicitly instructed to build understanding progressively rather than list facts — "the way a patient, skilled human tutor would."

## 3. Quiz generation — `quizPrompts.ts: buildQuizGenerationPrompt`
Single prompt handles all 5 question types in one call when a mixed quiz is requested. Each type gets its own formatting rule block (e.g. MCQ needs exactly 4 options + a numeric index answer; MATCHING needs a left-term/right-term map). When an exam board is specified, the prompt asks Gemini to mirror that board's real phrasing conventions.

## 4. Homework hints — `homeworkPrompts.ts: buildHomeworkHintPrompt`
The most safety-critical prompt. A constant (`ANTI_DIRECT_ANSWER_RULE`) is prepended verbatim to every call: *"Never state the final answer outright, at any hint level."* The stage (0, 1, 2+) changes the instruction — identify the concept, then show the method in the abstract, then walk through a fully worked *similar* (not identical) example. The hint stage is read from the database (`HomeworkSession.hintsGiven`), never from client input, so there's no way to request "hint 5" and get something more revealing than the system intends.

## 5. Resource generation — `resourcePrompts.ts: buildResourcePrompt`
One function, switched by `resourceType`, each with its own JSON shape: study notes, flashcards (front/back pairs), cheat sheets (term/definition pairs), mind maps (central node + branches), or revision questions.

## 6. Study planner — `plannerPrompts.ts: buildStudyPlannerPrompt`
Takes the student's subject list, flagged weak subjects, daily available minutes, and (if set) exam board + days-remaining. Instructs Gemini to weight weak subjects more heavily and vary session types day to day rather than repeating the same pattern.

## Caching strategy
`generateContent()`/`generateJSON()` accept an optional `cacheKeyInput` — when present, the exact prompt + params are hashed (SHA-256) into a Redis key with a 24h TTL. Tutor explanations, step lessons, quiz generation, and resource generation all use this (the same topic/mode combination is requested by many students). Homework hints deliberately skip caching, since each session's question text is usually unique and hint progression must reflect that specific session's stage.

## Safety settings
Every call sets all four Gemini harm categories to `BLOCK_LOW_AND_ABOVE` — the strictest available threshold — per the spec's "Gemini safety filters on maximum" requirement. Input is also sanitized server-side (`middleware/sanitize.ts`) before it ever reaches a prompt.
