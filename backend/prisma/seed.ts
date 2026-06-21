/**
 * StudyPilot AI — Database seed script.
 * Uses `pg` directly (not Prisma Client) since this environment cannot run
 * `prisma generate`. Run with: npm run db:seed
 */
import { pool } from "../src/lib/db";
import { hashPassword } from "../src/lib/jwt";
import { registerUserWithProfile } from "../src/repositories/user.repository";
import { createSubject, addStudentSubject, createTopic } from "../src/repositories/subject.repository";
import { insertQuizQuestions } from "../src/repositories/quiz.repository";
import { linkParentToChild } from "../src/repositories/parent.repository";
import { createClassroom, addStudentToClassroom } from "../src/repositories/classroom.repository";
import { query } from "../src/lib/db";
import type { SubjectCategory, GradeLevel } from "../src/types/db";

const ALL_LEVELS: GradeLevel[] = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const JSS_LEVELS: GradeLevel[] = ["JSS1", "JSS2", "JSS3"];
const SS_LEVELS: GradeLevel[] = ["SS1", "SS2", "SS3"];

// Full Nigerian secondary curriculum per the project spec — 76 subjects across 5 categories.
const SUBJECTS: Array<{ name: string; category: SubjectCategory; levels: GradeLevel[] }> = [
  // JSS Core
  { name: "English Studies", category: "CORE", levels: JSS_LEVELS },
  { name: "Mathematics", category: "CORE", levels: ALL_LEVELS },
  { name: "Basic Science", category: "CORE", levels: JSS_LEVELS },
  { name: "Basic Technology", category: "CORE", levels: JSS_LEVELS },
  { name: "Physical and Health Education", category: "CORE", levels: JSS_LEVELS },
  { name: "Information Technology / Computer Studies", category: "CORE", levels: ALL_LEVELS },
  { name: "Home Economics", category: "CORE", levels: JSS_LEVELS },
  { name: "Agricultural Science", category: "CORE", levels: ALL_LEVELS },
  { name: "Social Studies", category: "CORE", levels: JSS_LEVELS },
  { name: "Civic Education", category: "CORE", levels: ALL_LEVELS },
  { name: "Security Education", category: "CORE", levels: JSS_LEVELS },
  { name: "Christian Religious Studies", category: "CORE", levels: ALL_LEVELS },
  { name: "Islamic Religious Studies", category: "CORE", levels: ALL_LEVELS },
  { name: "Cultural and Creative Arts", category: "CORE", levels: JSS_LEVELS },
  { name: "Hausa Language", category: "CORE", levels: ALL_LEVELS },
  { name: "Igbo Language", category: "CORE", levels: ALL_LEVELS },
  { name: "Yoruba Language", category: "CORE", levels: ALL_LEVELS },
  { name: "French", category: "CORE", levels: ALL_LEVELS },

  // SS Compulsory
  { name: "English Language", category: "CORE", levels: SS_LEVELS },

  // SS Sciences
  { name: "Biology", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Chemistry", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Physics", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Further Mathematics", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Technical Drawing", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Geography", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Computer Science", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Data Processing", category: "SCIENCES", levels: SS_LEVELS },
  { name: "Health Education", category: "SCIENCES", levels: SS_LEVELS },

  // SS Arts & Humanities
  { name: "Literature in English", category: "ARTS_HUMANITIES", levels: SS_LEVELS },
  { name: "Government", category: "ARTS_HUMANITIES", levels: SS_LEVELS },
  { name: "History", category: "ARTS_HUMANITIES", levels: SS_LEVELS },
  { name: "Arabic", category: "ARTS_HUMANITIES", levels: SS_LEVELS },
  { name: "Music", category: "ARTS_HUMANITIES", levels: SS_LEVELS },
  { name: "Fine Arts", category: "ARTS_HUMANITIES", levels: SS_LEVELS },

  // SS Commercial
  { name: "Economics", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Commerce", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Financial Accounting", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Marketing", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Office Practice", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Insurance", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Book Keeping", category: "COMMERCIAL", levels: SS_LEVELS },
  { name: "Business Studies", category: "COMMERCIAL", levels: SS_LEVELS },

  // Technical & Vocational (Trade)
  { name: "Animal Husbandry", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Fisheries", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Crop Husbandry", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Catering Craft Practice", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Garment Making", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Dyeing and Bleaching", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Photography", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Tourism", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Store Keeping", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Salesmanship", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Auto Mechanics", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Electrical Installation", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Electronics", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Welding and Fabrication", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Carpentry and Joinery", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Plumbing", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "GSM Phone Repairs", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Computer Hardware Maintenance", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Solar Installation and Maintenance", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Furniture Making", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Beauty Therapy and Cosmetology", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Painting and Decoration", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Refrigeration and Air Conditioning", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Printing Craft Practice", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Leather Goods Manufacturing", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Mining", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Radio, Television and Electronic Works", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Block Laying, Bricklaying and Concreting", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Upholstery", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Textile Trade", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Basketry", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Jewellery Making", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Ceramics", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
  { name: "Machine Woodworking", category: "TRADE_VOCATIONAL", levels: SS_LEVELS },
];

const ACHIEVEMENTS = [
  { key: "first-lesson", label: "First Steps", description: "Completed your first lesson", iconKey: "footprints" },
  { key: "quiz-master", label: "Quiz Master", description: "Scored 100% on a quiz", iconKey: "trophy" },
  { key: "seven-day-streak", label: "Week Warrior", description: "Studied 7 days in a row", iconKey: "flame" },
  { key: "thirty-day-streak", label: "Monthly Master", description: "Studied 30 days in a row", iconKey: "calendar" },
  { key: "homework-helper", label: "Self-Starter", description: "Resolved 10 homework sessions", iconKey: "lightbulb" },
  { key: "subject-explorer", label: "Subject Explorer", description: "Enrolled in 5 different subjects", iconKey: "compass" },
];

async function main() {
  console.log("Seeding StudyPilot AI database...\n");

  // ── Subjects ──
  console.log(`Seeding ${SUBJECTS.length} subjects...`);
  const subjectIds: Record<string, string> = {};
  for (const s of SUBJECTS) {
    const subject = await createSubject(s.name, s.category, s.levels);
    subjectIds[s.name] = subject.id;
  }
  console.log(`✓ ${SUBJECTS.length} subjects seeded\n`);

  // ── Achievements ──
  console.log("Seeding achievements...");
  for (const a of ACHIEVEMENTS) {
    await query(
      `INSERT INTO "Achievement" (key, label, description, "iconKey") VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO NOTHING`,
      [a.key, a.label, a.description, a.iconKey],
    );
  }
  console.log(`✓ ${ACHIEVEMENTS.length} achievements seeded\n`);

  // ── Demo users ──
  console.log("Seeding demo users...");
  const demoPassword = await hashPassword("Demo@1234");

  const student = await registerUserWithProfile(
    { email: "student@studypilot.demo", passwordHash: demoPassword, name: "Tunde Adekunle", role: "STUDENT" },
    { gradeLevel: "SS2", examBoards: ["WAEC", "JAMB"], school: "Birnin Kebbi High School" },
  );

  const parent = await registerUserWithProfile(
    { email: "parent@studypilot.demo", passwordHash: demoPassword, name: "Mrs. Adekunle", role: "PARENT" },
  );

  const teacher = await registerUserWithProfile(
    { email: "teacher@studypilot.demo", passwordHash: demoPassword, name: "Mr. Okafor", role: "TEACHER" },
    { school: "Birnin Kebbi High School" },
  );

  const admin = await registerUserWithProfile(
    { email: "admin@studypilot.demo", passwordHash: demoPassword, name: "StudyPilot Admin", role: "ADMIN" },
  );
  console.log("✓ 4 demo users seeded (student, parent, teacher, admin — all password: Demo@1234)\n");

  // ── Relationships ──
  console.log("Linking parent-child and classroom...");
  await linkParentToChild(parent.id, student.id);

  const classroom = await createClassroom(teacher.id, "SS2 Biology", "SS2");
  await addStudentToClassroom(classroom.id, student.id);
  console.log(`✓ Parent linked to student; classroom "${classroom.name}" created with join code ${classroom.joinCode}\n`);

  // ── Student subject enrollment ──
  console.log("Enrolling demo student in subjects...");
  const enrolledSubjects = ["Biology", "Chemistry", "Physics", "Mathematics", "English Language", "Further Mathematics"];
  for (const name of enrolledSubjects) {
    if (subjectIds[name]) await addStudentSubject(student.id, subjectIds[name]);
  }
  console.log(`✓ Enrolled in ${enrolledSubjects.length} subjects\n`);

  // ── Sample Biology content: Photosynthesis ──
  console.log("Seeding sample Biology topic and quiz questions...");
  const biologyId = subjectIds["Biology"];
  const topic = await createTopic(biologyId, "Photosynthesis", "SS2", 1);

  await insertQuizQuestions([
    {
      subjectId: biologyId,
      topicId: topic.id,
      type: "MCQ",
      questionText: "What is the primary pigment responsible for capturing light energy in photosynthesis?",
      options: ["Chlorophyll", "Carotene", "Xanthophyll", "Anthocyanin"],
      correctAnswer: 0,
      explanation: "Chlorophyll absorbs light most efficiently in the red and blue wavelengths, making it the primary light-capturing pigment.",
      difficulty: "EASY",
      examBoard: "WAEC",
    },
    {
      subjectId: biologyId,
      topicId: topic.id,
      type: "TRUE_FALSE",
      questionText: "Photosynthesis only occurs during the day when sunlight is available.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation: "The light-dependent reactions require sunlight, so photosynthesis as a whole only proceeds when light is available (though the Calvin cycle can briefly continue using stored ATP/NADPH).",
      difficulty: "EASY",
      examBoard: "WAEC",
    },
    {
      subjectId: biologyId,
      topicId: topic.id,
      type: "FILL_BLANK",
      questionText: "The gas released as a by-product of photosynthesis is ___.",
      options: null,
      correctAnswer: "oxygen",
      explanation: "Water molecules are split during the light reactions, releasing oxygen as a by-product.",
      difficulty: "EASY",
      examBoard: "WAEC",
    },
    {
      subjectId: biologyId,
      topicId: topic.id,
      type: "SHORT_ANSWER",
      questionText: "Explain why photosynthesis is important for life on Earth.",
      options: null,
      correctAnswer: "Photosynthesis produces oxygen for respiration and forms the base of most food chains by converting solar energy into chemical energy stored in glucose.",
      explanation: "A complete answer should mention oxygen production and energy/food chain foundation.",
      difficulty: "MEDIUM",
      examBoard: "WAEC",
    },
    {
      subjectId: biologyId,
      topicId: topic.id,
      type: "MATCHING",
      questionText: "Chlorophyll|Stomata|Stroma|Thylakoid",
      options: ["Site of the Calvin cycle", "Light absorption", "Gas exchange pores", "Site of light-dependent reactions"],
      correctAnswer: {
        Chlorophyll: "Light absorption",
        Stomata: "Gas exchange pores",
        Stroma: "Site of the Calvin cycle",
        Thylakoid: "Site of light-dependent reactions",
      },
      explanation: "Each structure/molecule plays a distinct, well-defined role in the photosynthesis process.",
      difficulty: "HARD",
      examBoard: "WAEC",
    },
  ]);
  console.log("✓ Photosynthesis topic + 5 sample quiz questions seeded\n");

  // ── Offline packs ──
  console.log("Seeding offline packs...");
  await query(
    `INSERT INTO "OfflinePack" (key, name, type, "subjectId", "sizeMB") VALUES
     ($1, $2, $3, $4, $5) ON CONFLICT (key) DO NOTHING`,
    ["pack-biology-ss", "Biology (SS1-SS3) Complete Pack", "SUBJECT", biologyId, 24.5],
  );
  await query(
    `INSERT INTO "OfflinePack" (key, name, type, "examBoard", "sizeMB") VALUES
     ($1, $2, $3, $4, $5) ON CONFLICT (key) DO NOTHING`,
    ["pack-waec-2026", "WAEC 2026 Exam Prep Pack", "EXAM", "WAEC", 58.2],
  );
  console.log("✓ 2 offline packs seeded\n");

  console.log("Seed complete.");
  console.log("\nDemo logins (password for all: Demo@1234):");
  console.log("  student@studypilot.demo");
  console.log("  parent@studypilot.demo");
  console.log("  teacher@studypilot.demo");
  console.log("  admin@studypilot.demo");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
