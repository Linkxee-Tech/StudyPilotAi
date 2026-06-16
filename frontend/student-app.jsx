"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Home, MessageCircle, BookOpen, ListChecks, BarChart3, CalendarDays, Settings, Flame, Star, Trophy, ChevronRight, ChevronDown, ChevronLeft, Mic, Send, Volume2, CheckCircle2, Circle, Bell, Brain, Lightbulb, AlertTriangle, ListOrdered, RotateCcw, Wifi, WifiOff, Download, Award, RefreshCw, Search, FlaskConical, Palette, Briefcase, Wrench, GraduationCap, Timer, X, Clock, Target, Zap, FileText, StickyNote, Plus, HardDrive, LogOut, Shield, FileDown, RotateCw, Layers, Image as ImageIcon } from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');.fd{font-family:'Lexend',system-ui,sans-serif}.fb{font-family:'Inter',system-ui,sans-serif}`;

function OWLogo({ size = 38 }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} xmlns="http://www.w3.org/2000/svg">
      <path d="M30 175 Q100 158 170 175 L170 205 Q100 188 30 205 Z" fill="#22c55e" />
      <path d="M30 188 Q100 172 170 188 L170 205 Q100 188 30 205 Z" fill="#f97316" />
      <path d="M30 175 Q100 158 170 175" stroke="#3b82f6" strokeWidth="10" fill="none" />
      <line x1="100" y1="158" x2="100" y2="208" stroke="#0f172a" strokeWidth="6" />
      <circle cx="100" cy="102" r="76" fill="#0f172a" />
      <circle cx="100" cy="110" r="60" fill="white" />
      <polygon points="100,18 42,52 158,52" fill="#0f172a" />
      <rect x="40" y="47" width="120" height="18" rx="3" fill="#1e293b" />
      <line x1="158" y1="52" x2="172" y2="80" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
      <circle cx="172" cy="86" r="8" fill="#eab308" />
      <circle cx="68" cy="97" r="27" fill="white" />
      <circle cx="132" cy="97" r="27" fill="white" />
      <circle cx="68" cy="97" r="27" fill="none" stroke="#0f172a" strokeWidth="7" />
      <circle cx="132" cy="97" r="27" fill="none" stroke="#0f172a" strokeWidth="7" />
      <line x1="95" y1="97" x2="105" y2="97" stroke="#0f172a" strokeWidth="5" />
      <circle cx="68" cy="97" r="13" fill="#1e3a8a" />
      <circle cx="132" cy="97" r="13" fill="#1e3a8a" />
      <circle cx="62" cy="91" r="5" fill="white" />
      <circle cx="126" cy="91" r="5" fill="white" />
      <polygon points="100,124 86,142 114,142" fill="#f97316" />
      <path d="M76 152 Q100 168 124 152" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "tutor", label: "AI Tutor", icon: MessageCircle },
  { key: "homework", label: "Homework Help", icon: Lightbulb },
  { key: "library", label: "Study Library", icon: BookOpen },
  { key: "quiz", label: "Quiz Center", icon: ListChecks },
  { key: "exam", label: "Exam Simulator", icon: GraduationCap },
  { key: "progress", label: "Progress", icon: BarChart3 },
  { key: "planner", label: "Study Planner", icon: CalendarDays },
  { key: "resources", label: "Resources", icon: FileText },
  { key: "sync", label: "Sync Manager", icon: RefreshCw },
  { key: "settings", label: "Settings", icon: Settings },
];
const BNAV = NAV.filter((n) => ["dashboard", "tutor", "library", "quiz", "progress"].includes(n.key));

const STUDY_TIME = [{ day: "Mon", min: 25 }, { day: "Tue", min: 40 }, { day: "Wed", min: 15 }, { day: "Thu", min: 55 }, { day: "Fri", min: 30 }, { day: "Sat", min: 70 }, { day: "Sun", min: 45 }];
const QUIZ_BARS = [{ sub: "Math", s: 88 }, { sub: "Bio", s: 82 }, { sub: "Eng", s: 70 }, { sub: "Chem", s: 64 }, { sub: "Gov", s: 55 }, { sub: "Phy", s: 41 }];
const MASTERY = [{ sub: "Mathematics", s: 88 }, { sub: "Biology", s: 82 }, { sub: "English Language", s: 70 }, { sub: "Chemistry", s: 64 }, { sub: "Government", s: 55 }, { sub: "Physics", s: 41 }];
const BOARD = [{ rank: 1, name: "Amaka O.", xp: 2840, st: 18 }, { rank: 2, name: "Tunde A.", xp: 2680, st: 12, me: true }, { rank: 3, name: "Chisom E.", xp: 2510, st: 9 }, { rank: 4, name: "Fatima M.", xp: 2300, st: 14 }, { rank: 5, name: "Emeka I.", xp: 2150, st: 7 }];
const BDGS = [{ icon: Flame, label: "7-Day Streak", ok: true, c: "text-orange-500 bg-orange-100" }, { icon: Trophy, label: "Quiz Master", ok: true, c: "text-amber-500 bg-amber-100" }, { icon: Award, label: "Pidgin Explorer", ok: true, c: "text-emerald-500 bg-emerald-100" }, { icon: Star, label: "Early Bird", ok: true, c: "text-indigo-500 bg-indigo-100" }, { icon: BookOpen, label: "Library Hero", ok: false, c: "text-slate-300 bg-stone-100" }, { icon: GraduationCap, label: "Exam Ready", ok: false, c: "text-slate-300 bg-stone-100" }, { icon: Zap, label: "Speed Learner", ok: false, c: "text-slate-300 bg-stone-100" }, { icon: Target, label: "Sharp Shooter", ok: false, c: "text-slate-300 bg-stone-100" }];
const WEEKLY = [{ day: "Mon", s: [{ sub: "Biology", t: "Cell Division", dur: "30 min", type: "Lesson" }, { sub: "Math", t: "Quadratic Eqns", dur: "20 min", type: "Practice" }] }, { day: "Tue", s: [{ sub: "Chemistry", t: "Periodic Table", dur: "25 min", type: "Revision" }] }, { day: "Wed", s: [{ sub: "English", t: "Comprehension", dur: "30 min", type: "Practice" }] }, { day: "Thu", s: [{ sub: "Government", t: "Legislature", dur: "25 min", type: "Lesson" }, { sub: "Biology", t: "Genetics", dur: "25 min", type: "Quiz" }] }, { day: "Fri", s: [{ sub: "Mathematics", t: "Statistics", dur: "35 min", type: "Lesson" }] }, { day: "Sat", s: [{ sub: "WAEC Mock", t: "Bio + Chem", dur: "60 min", type: "Mock Exam" }] }, { day: "Sun", s: [{ sub: "Review", t: "Progress check", dur: "15 min", type: "Review" }] }];
const CARDS = [{ front: "What is photosynthesis?", back: "The process by which green plants use sunlight, water and CO2 to produce glucose and oxygen." }, { front: "Where does photosynthesis occur?", back: "In the chloroplasts: thylakoid membranes (light reactions) and stroma (Calvin cycle)." }, { front: "What is chlorophyll?", back: "The green pigment that absorbs blue and red light energy for photosynthesis." }, { front: "Name the two stages of photosynthesis.", back: "1. Light-dependent reactions (thylakoids)\n2. Calvin cycle / light-independent (stroma)" }];
const CHEAT = [{ t: "Photosynthesis", d: "CO2+H2O+Light -> Glucose+O2" }, { t: "Chlorophyll", d: "Green pigment; absorbs blue & red light" }, { t: "Chloroplast", d: "Organelle where photosynthesis occurs" }, { t: "Thylakoid", d: "Light reactions: ATP, NADPH, O2 produced" }, { t: "Stroma", d: "Calvin cycle: CO2 fixed into glucose" }, { t: "Stomata", d: "Leaf pores for CO2 entry and O2 exit" }];
const REVQS = ["1. Name the two stages of photosynthesis and state where each occurs.", "2. State three factors that affect the rate of photosynthesis.", "3. Distinguish between photosynthesis and respiration.", "4. Explain why a plant in a dark cupboard eventually dies.", "5. Describe the role of chlorophyll in photosynthesis."];
const NOTES = "Biology SS2 - Photosynthesis: Study Notes\n\nDEFINITION\nPhotosynthesis converts light energy into chemical energy stored as glucose.\n\nEQUATION\n6CO2 + 6H2O + Light -> C6H12O6 + 6O2\n\nKEY CONCEPTS\n1. Chlorophyll - green pigment that absorbs sunlight\n2. Chloroplasts - organelles where photosynthesis occurs\n3. Thylakoids - light-dependent reactions\n4. Stroma - Calvin cycle (light-independent)\n5. Stomata - pores for gas exchange\n\nFACTORS AFFECTING RATE\n- Light intensity\n- CO2 concentration\n- Temperature\n- Water availability\n\nCOMMON EXAM MISTAKES\n- Confusing photosynthesis with respiration\n- Saying oxygen is a reactant (it is a product)\n- Forgetting glucose is the main product";
const QUIZ_QS = [
  { type: "mcq", q: "Which organelle carries out photosynthesis?", opts: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], ans: 1, exp: "Chloroplasts contain chlorophyll and carry out both stages of photosynthesis." },
  { type: "tf", q: "Oxygen is a reactant (input) in photosynthesis.", opts: ["True", "False"], ans: 1, exp: "Oxygen is a by-product, not a reactant. Inputs are CO2, water and light energy." },
  { type: "fill", q: "The green pigment in leaves that absorbs light is called ___.", opts: ["Chlorophyll", "Keratin", "Melanin", "Carotene"], ans: 0, exp: "Chlorophyll absorbs mainly blue and red light, reflecting green." },
  { type: "mcq", q: "Where does the Calvin cycle take place?", opts: ["Thylakoid membrane", "Stroma", "Grana", "Outer membrane"], ans: 1, exp: "The Calvin cycle (light-independent reactions) occurs in the stroma." },
  { type: "mcq", q: "What is the word equation for photosynthesis?", opts: ["Glucose+Oxygen -> CO2+Water", "CO2+Water+Light -> Glucose+Oxygen", "CO2+Glucose -> Oxygen+Water", "Water+Light -> Glucose+CO2"], ans: 1, exp: "CO2 + H2O + Light energy -> C6H12O6 + O2" },
];
const CAT_META = { "Core": { icon: BookOpen, c: "text-indigo-600 bg-indigo-100" }, "Sciences": { icon: FlaskConical, c: "text-emerald-600 bg-emerald-100" }, "Arts & Humanities": { icon: Palette, c: "text-rose-600 bg-rose-100" }, "Commercial": { icon: Briefcase, c: "text-amber-600 bg-amber-100" }, "Trade & Vocational": { icon: Wrench, c: "text-teal-600 bg-teal-100" } };
const SUBJECTS = [
  { n: "English Language", cat: "Core", lvls: ["JSS", "SS"], t: 52, p: 70, dl: false },
  { n: "Mathematics", cat: "Core", lvls: ["JSS", "SS"], t: 48, p: 88, dl: true },
  { n: "Civic Education", cat: "Core", lvls: ["JSS", "SS"], t: 20, p: null, dl: false },
  { n: "Basic Science", cat: "Core", lvls: ["JSS"], t: 24, p: null, dl: false },
  { n: "Basic Technology", cat: "Core", lvls: ["JSS"], t: 18, p: null, dl: false },
  { n: "Computer Studies (ICT)", cat: "Core", lvls: ["JSS", "SS"], t: 26, p: null, dl: false },
  { n: "Home Economics", cat: "Core", lvls: ["JSS"], t: 16, p: null, dl: false },
  { n: "Agricultural Science", cat: "Core", lvls: ["JSS", "SS"], t: 30, p: null, dl: false },
  { n: "Social Studies", cat: "Core", lvls: ["JSS"], t: 14, p: null, dl: false },
  { n: "Security Education", cat: "Core", lvls: ["JSS"], t: 10, p: null, dl: false },
  { n: "Christian Religious Studies", cat: "Core", lvls: ["JSS", "SS"], t: 22, p: null, dl: false },
  { n: "Islamic Studies", cat: "Core", lvls: ["JSS", "SS"], t: 22, p: null, dl: false },
  { n: "Cultural & Creative Arts", cat: "Core", lvls: ["JSS"], t: 12, p: null, dl: false },
  { n: "Hausa / Igbo / Yoruba", cat: "Core", lvls: ["JSS", "SS"], t: 16, p: null, dl: false },
  { n: "French", cat: "Core", lvls: ["JSS", "SS"], t: 18, p: null, dl: false },
  { n: "Biology", cat: "Sciences", lvls: ["SS"], t: 34, p: 82, dl: true },
  { n: "Chemistry", cat: "Sciences", lvls: ["SS"], t: 36, p: 64, dl: false },
  { n: "Physics", cat: "Sciences", lvls: ["SS"], t: 32, p: 41, dl: false },
  { n: "Further Mathematics", cat: "Sciences", lvls: ["SS"], t: 28, p: null, dl: false },
  { n: "Technical Drawing", cat: "Sciences", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Geography", cat: "Sciences", lvls: ["SS"], t: 24, p: null, dl: false },
  { n: "Computer Science", cat: "Sciences", lvls: ["SS"], t: 22, p: null, dl: false },
  { n: "Data Processing", cat: "Sciences", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Health Education", cat: "Sciences", lvls: ["SS"], t: 12, p: null, dl: false },
  { n: "Literature in English", cat: "Arts & Humanities", lvls: ["SS"], t: 26, p: null, dl: false },
  { n: "Government", cat: "Arts & Humanities", lvls: ["SS"], t: 28, p: 55, dl: false },
  { n: "History", cat: "Arts & Humanities", lvls: ["SS"], t: 24, p: null, dl: false },
  { n: "Arabic", cat: "Arts & Humanities", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Music", cat: "Arts & Humanities", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Fine Arts", cat: "Arts & Humanities", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Yoruba", cat: "Arts & Humanities", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Hausa", cat: "Arts & Humanities", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Economics", cat: "Commercial", lvls: ["SS"], t: 24, p: null, dl: false },
  { n: "Commerce", cat: "Commercial", lvls: ["SS"], t: 22, p: null, dl: false },
  { n: "Financial Accounting", cat: "Commercial", lvls: ["SS"], t: 26, p: null, dl: false },
  { n: "Marketing", cat: "Commercial", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Office Practice", cat: "Commercial", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Insurance", cat: "Commercial", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Book Keeping", cat: "Commercial", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Business Studies", cat: "Commercial", lvls: ["SS"], t: 20, p: null, dl: false },
  { n: "Catering Craft Practice", cat: "Trade & Vocational", lvls: ["SS"], t: 20, p: null, dl: false },
  { n: "Garment Making", cat: "Trade & Vocational", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Photography", cat: "Trade & Vocational", lvls: ["SS"], t: 12, p: null, dl: false },
  { n: "Tourism", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Auto Mechanics", cat: "Trade & Vocational", lvls: ["SS"], t: 24, p: null, dl: false },
  { n: "Electrical Installation", cat: "Trade & Vocational", lvls: ["SS"], t: 22, p: null, dl: false },
  { n: "Electronics", cat: "Trade & Vocational", lvls: ["SS"], t: 20, p: null, dl: false },
  { n: "Welding & Fabrication", cat: "Trade & Vocational", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Carpentry & Joinery", cat: "Trade & Vocational", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "GSM Phone Repairs", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Computer Hardware Maintenance", cat: "Trade & Vocational", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Solar Installation", cat: "Trade & Vocational", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Beauty Therapy & Cosmetology", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Plumbing", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Furniture Making", cat: "Trade & Vocational", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Dyeing & Bleaching", cat: "Trade & Vocational", lvls: ["SS"], t: 12, p: null, dl: false },
  { n: "Refrigeration & Air Conditioning", cat: "Trade & Vocational", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Animal Husbandry", cat: "Trade & Vocational", lvls: ["SS"], t: 16, p: null, dl: false },
  { n: "Fisheries", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Printing Craft Practice", cat: "Trade & Vocational", lvls: ["SS"], t: 14, p: null, dl: false },
  { n: "Block Laying & Bricklaying", cat: "Trade & Vocational", lvls: ["SS"], t: 18, p: null, dl: false },
  { n: "Jewellery Making", cat: "Trade & Vocational", lvls: ["SS"], t: 12, p: null, dl: false },
  { n: "Ceramics", cat: "Trade & Vocational", lvls: ["SS"], t: 12, p: null, dl: false },
];
const EPACKS = [{ n: "WAEC Complete Pack 2026", s: 9, sz: "180 MB", c: "bg-indigo-600" }, { n: "JAMB UTME Pack", s: 4, sz: "120 MB", c: "bg-emerald-600" }, { n: "NECO Complete Pack", s: 9, sz: "175 MB", c: "bg-amber-600" }, { n: "NABTEB Trade Pack", s: 6, sz: "140 MB", c: "bg-teal-600" }, { n: "GCSE Core Pack", s: 5, sz: "110 MB", c: "bg-rose-600" }, { n: "SAT Prep Pack", s: 3, sz: "90 MB", c: "bg-violet-600" }];
const DLS = [{ n: "Biology — SS2", sz: "38 MB", date: "Jun 10", st: "Up to date" }, { n: "Mathematics — SS1-SS3", sz: "44 MB", date: "Jun 8", st: "Up to date" }, { n: "WAEC Mock Pack 2026", sz: "52 MB", date: "Jun 5", st: "Update available" }];
const DEPTHS = [{ k: "beginner", l: "Beginner" }, { k: "standard", l: "Standard" }, { k: "advanced", l: "Advanced" }, { k: "pidgin", l: "Pidgin" }];
const EXPS = { beginner: "Plants need food to grow, just like you need food to have energy. But plants cannot go to a shop to buy food — they make their own! This process is called photosynthesis.", standard: "Photosynthesis is the process by which green plants convert light energy from the sun into chemical energy stored as glucose. It takes place in the leaves inside chloroplasts.", advanced: "Photosynthesis is a redox process in which light energy drives the reduction of CO2 to carbohydrate, with water as the electron donor. It occurs in two stages: light-dependent reactions in thylakoid membranes and the Calvin cycle in the stroma.", pidgin: "Plant need food to grow, just like how you need food to get energy. But plant no fit go market buy food — dem dey make their own! Na this process we call photosynthesis." };
const STEPS = [{ k: "intro", title: "Introduction", icon: BookOpen, c: "text-indigo-600 bg-indigo-100", body: "We are learning how green plants make their own food using sunlight — photosynthesis. By the end you will explain what happens, where it happens, and why it matters for all life on Earth." }, { k: "breakdown", title: "Concept Breakdown", icon: Brain, c: "text-emerald-600 bg-emerald-100", body: "Chlorophyll absorbs sunlight. Plants take in CO2 through stomata and water through roots. Inside the chloroplast: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2." }, { k: "example", title: "Worked Example", icon: Lightbulb, c: "text-amber-600 bg-amber-100", body: "A maize plant absorbs sunlight through its broad leaves. Roots pull up water; stomata let in CO2. Inside the chloroplasts these combine to produce glucose for growth and oxygen as a by-product." }, { k: "mistakes", title: "Common Mistakes", icon: AlertTriangle, c: "text-rose-600 bg-rose-100", body: "1. Mixing photosynthesis with respiration — they are opposites.\n2. Saying oxygen is an input — it is a by-product.\n3. Forgetting that glucose, not oxygen, is the main product." }, { k: "practice", title: "Practice Questions", icon: ListOrdered, c: "text-teal-600 bg-teal-100", body: "Q1: Name the green pigment that absorbs light.\nQ2: Write the word equation for photosynthesis.\nQ3: Why does a plant in a dark cupboard turn pale?" }, { k: "recap", title: "Recap", icon: RotateCcw, c: "text-slate-600 bg-slate-100", body: "Photosynthesis converts light to glucose in chloroplasts. Uses CO2 and water. Oxygen is a by-product. It is the opposite of respiration." }];
const HINTS = ["Think about what photosynthesis needs — what is missing in the dark?", "Without light, the plant cannot produce chlorophyll, the pigment that makes leaves green.", "And if it cannot photosynthesise, what food source is the plant also missing?"];
const RTYPES = [{ k: "flashcards", l: "Flashcards", icon: Layers }, { k: "notes", l: "Study Notes", icon: StickyNote }, { k: "cheatsheet", l: "Cheat Sheet", icon: FileText }, { k: "mindmap", l: "Mind Map", icon: Target }, { k: "questions", l: "Revision Qs", icon: ListOrdered }];
const TYPE_C = { Lesson: "bg-indigo-100 text-indigo-700", Practice: "bg-emerald-100 text-emerald-700", Revision: "bg-amber-100 text-amber-700", Quiz: "bg-rose-100 text-rose-700", "Mock Exam": "bg-slate-700 text-white", Review: "bg-stone-100 text-slate-600" };
const EXAMS2 = [{ name: "WAEC 2026", date: "Aug 2026", days: 42, subjects: 9, color: "bg-indigo-600" }, { name: "JAMB UTME", date: "Sep 2026", days: 58, subjects: 4, color: "bg-emerald-600" }];
const TASKS_INIT = [{ type: "Lesson", sub: "Biology", topic: "Photosynthesis", dur: "15 min", done: true }, { type: "Quiz", sub: "Chemistry", topic: "Periodic Table", dur: "10 min", done: false }, { type: "Revision", sub: "Physics", topic: "Forces & Motion", dur: "20 min", done: false }, { type: "Practice", sub: "Mathematics", topic: "Quadratic Equations", dur: "15 min", done: false }];

/* ─ SHARED ─ */
function Bdg({ ch, cls = "" }) { return <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 fb text-xs font-semibold " + cls}>{ch}</span>; }
function Tog({ on, fn, label }) { return <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => fn(!on)} className={"relative inline-flex h-6 w-11 items-center rounded-full transition " + (on ? "bg-emerald-500" : "bg-stone-300")}><span className={"inline-block h-4 w-4 rounded-full bg-white shadow transition-transform " + (on ? "translate-x-6" : "translate-x-1")} /></button>; }

function Sidebar({ active, setActive }) {
  return (
    <aside className="hidden w-64 flex-none flex-col bg-slate-900 lg:flex min-h-screen">
      <div className="flex items-center gap-3 px-5 py-5">
        <OWLogo size={38} />
        <div><p className="fd text-base font-bold text-white leading-tight">StudyPilot</p><p className="fb text-xs text-amber-400 font-semibold">AI Tutor Platform</p></div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((n) => (
          <button key={n.key} type="button" onClick={() => setActive(n.key)} className={"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 fb text-sm font-medium transition " + (active === n.key ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white")}>
            <n.icon className="h-4 w-4 flex-none" />{n.label}
          </button>
        ))}
      </nav>
      <div className="m-3 flex items-center gap-3 rounded-xl bg-slate-800 p-3">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-400 fd text-sm font-bold text-slate-900">T</div>
        <div className="min-w-0"><p className="truncate fb text-sm font-semibold text-white">Tunde Adekunle</p><p className="fb text-xs text-slate-400">SS2 · Birnin Kebbi</p></div>
      </div>
    </aside>
  );
}

function BotNav({ active, setActive }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white lg:hidden">
      {BNAV.map((n) => (
        <button key={n.key} type="button" onClick={() => setActive(n.key)} style={{ minHeight: 56 }} className={"flex flex-1 flex-col items-center justify-center gap-1 py-2 fb text-[10px] font-semibold transition " + (active === n.key ? "text-emerald-600" : "text-slate-400")}>
          <n.icon className="h-5 w-5" />{n.label.split(" ")[0]}
        </button>
      ))}
    </nav>
  );
}

function Topbar({ online, setOnline, title }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden"><OWLogo size={30} /><p className="fd text-sm font-bold text-slate-900">StudyPilot <span className="text-amber-500">AI</span></p></div>
        <div className="hidden lg:block"><p className="fb text-xs text-slate-400">Good afternoon, Tunde</p><h1 className="fd text-lg font-bold text-slate-900">{title}</h1></div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOnline((v) => !v)} className={"flex items-center gap-1.5 rounded-full px-3 py-2 fb text-xs font-semibold transition " + (online ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
            {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{online ? "Online" : "Offline"}</span>
          </button>
          <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-stone-100">
            <Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>
      {!online && <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 fb text-xs text-amber-800 sm:px-6"><WifiOff className="h-3.5 w-3.5 flex-none" />Offline mode — downloaded packs only. Syncs when back online.</div>}
    </header>
  );
}

/* ─ DASHBOARD ─ */
function Dashboard({ setActive }) {
  const [tasks, setTasks] = useState(TASKS_INIT);
  const done = tasks.filter((t) => t.done).length;
  return (
    <div className="space-y-8 p-4 pb-28 sm:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ icon: Flame, label: "Day streak", value: "12", c: "text-orange-500 bg-orange-100" }, { icon: Star, label: "XP today", value: "80", c: "text-amber-500 bg-amber-100" }, { icon: Trophy, label: "Quiz avg", value: "76%", c: "text-emerald-500 bg-emerald-100" }, { icon: BookOpen, label: "Subjects", value: "5", c: "text-indigo-500 bg-indigo-100" }].map((s) => (
          <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div>
            <p className="mt-3 fd text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="fb text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-slate-900 p-5 text-white">
        <div className="flex items-start justify-between">
          <div><p className="fb text-xs text-slate-400">Exam countdown</p><h3 className="fd text-xl font-bold">WAEC 2026</h3><p className="fb text-sm text-slate-400">9 subjects · Aug 2026</p></div>
          <div className="text-right"><p className="fd text-4xl font-bold text-amber-400">42</p><p className="fb text-xs text-slate-400">days to go</p></div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-700"><div className="h-2 rounded-full bg-amber-400" style={{ width: "70%" }} /></div>
        <p className="mt-2 fb text-xs text-slate-400">70% of revision plan complete</p>
      </div>
      <section>
        <h2 className="fd text-lg font-bold text-slate-900">Continue learning</h2>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
          {[{ sub: "Biology", topic: "Photosynthesis", prog: 60, lvl: "SS2" }, { sub: "Government", topic: "Federal System", prog: 30, lvl: "SS2" }, { sub: "Chemistry", topic: "Periodic Table", prog: 15, lvl: "SS2" }].map((c) => (
            <button key={c.topic} type="button" onClick={() => setActive("tutor")} className="w-60 flex-none rounded-2xl border border-stone-200 bg-white p-5 text-left transition hover:border-emerald-300">
              <p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400">{c.sub} · {c.lvl}</p>
              <h3 className="mt-1 fd text-base font-bold text-slate-900">{c.topic}</h3>
              <div className="mt-3 h-1.5 w-full rounded-full bg-stone-100"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: c.prog + "%" }} /></div>
              <p className="mt-1 fb text-xs text-slate-500">{c.prog}% complete</p>
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">Today's plan</h2><span className="fb text-sm text-slate-500">{done}/{tasks.length} done</span></div>
        <div className="mt-3 space-y-2">
          {tasks.map((t, i) => (
            <div key={t.topic} className={"flex items-center gap-3 rounded-xl border bg-white px-4 py-3 " + (t.done ? "border-stone-100 opacity-60" : "border-stone-200")}>
              <button type="button" onClick={() => setTasks((p) => p.map((x, j) => j === i ? { ...x, done: !x.done } : x))} className="flex-none">
                {t.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-stone-300" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={"fb text-sm font-medium " + (t.done ? "line-through text-slate-400" : "text-slate-800")}>{t.sub} — {t.topic}</p>
                <p className="fb text-xs text-slate-400">{t.type} · {t.dur}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="fd text-lg font-bold text-slate-900">Subject mastery</h2>
        <div className="mt-3 space-y-3">
          {MASTERY.map((m) => {
            const bc = m.s >= 75 ? "bg-emerald-500" : m.s >= 50 ? "bg-amber-400" : "bg-rose-400";
            return (
              <div key={m.sub} className="flex items-center gap-3">
                <p className="w-40 fb text-sm text-slate-700 truncate">{m.sub}</p>
                <div className="flex-1 h-2 rounded-full bg-stone-100"><div className={"h-2 rounded-full " + bc} style={{ width: m.s + "%" }} /></div>
                <p className="w-10 text-right fb text-sm font-bold text-slate-700">{m.s}%</p>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">Recommended next</h2><Bdg ch={<><Zap className="h-3 w-3" />AI pick</>} cls="bg-indigo-100 text-indigo-700" /></div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[{ sub: "Biology", topic: "Cell Division", reason: "Scored 58% on last quiz" }, { sub: "Physics", topic: "Forces & Motion", reason: "Not revised in 9 days" }].map((r) => (
            <div key={r.topic} className="rounded-2xl border border-stone-200 bg-white p-5">
              <Bdg ch={r.sub} cls="bg-rose-100 text-rose-600" />
              <h3 className="mt-2 fd text-base font-bold text-slate-900">{r.topic}</h3>
              <p className="mt-1 fb text-sm text-slate-500">{r.reason}</p>
              <button type="button" onClick={() => setActive("tutor")} className="mt-3 flex items-center gap-1 fb text-sm font-semibold text-emerald-600">Start now<ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">Offline packs</h2><button type="button" onClick={() => setActive("library")} className="fb text-sm font-semibold text-emerald-600">Manage</button></div>
        <div className="mt-3 space-y-2">
          {DLS.map((d) => (
            <div key={d.n} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3">
              <div><p className="fb text-sm font-medium text-slate-800">{d.n}</p><p className="fb text-xs text-slate-400">{d.sz}</p></div>
              <Bdg ch={<>{d.st === "Up to date" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}{d.st}</>} cls={d.st === "Up to date" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─ AI TUTOR ─ */
function TutorChat({ setActive }) {
  const [depth, setDepth] = useState("standard");
  const [open, setOpen] = useState(["intro"]);
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState(0);
  const tog = (k) => setOpen((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);
  return (
    <div className="space-y-6 p-4 pb-44 sm:p-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400">Biology · SS2</p><h2 className="fd text-lg font-bold text-slate-900">Photosynthesis</h2></div>
          <button type="button" className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-2 fb text-xs font-semibold text-slate-600 hover:bg-stone-50"><Volume2 className="h-3.5 w-3.5" />Listen</button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-full bg-stone-100 p-1">
          {DEPTHS.map((d) => (
            <button key={d.k} type="button" onClick={() => setDepth(d.k)} className={"rounded-full py-2 fb text-xs font-semibold transition " + (depth === d.k ? (d.k === "pidgin" ? "bg-amber-400 text-slate-900" : "bg-slate-900 text-white") : "text-slate-500")}>{d.l}</button>
          ))}
        </div>
        <p className="mt-4 fb text-sm leading-relaxed text-slate-700">{EXPS[depth]}</p>
      </div>
      <section>
        <h2 className="fd text-base font-bold text-slate-900">Step-by-step lesson</h2>
        <div className="mt-3 space-y-2">
          {STEPS.map((s) => {
            const isO = open.includes(s.k);
            return (
              <div key={s.k} className="overflow-hidden rounded-xl border border-stone-200">
                <button type="button" onClick={() => tog(s.k)} aria-expanded={isO} className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left hover:bg-stone-50">
                  <div className={"flex h-8 w-8 flex-none items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div>
                  <span className="flex-1 fd text-sm font-bold text-slate-900">{s.title}</span>
                  <ChevronDown className={"h-4 w-4 text-slate-400 transition-transform " + (isO ? "rotate-180" : "")} />
                </button>
                {isO && <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-3 fb text-sm leading-relaxed text-slate-600 whitespace-pre-line">{s.body}</div>}
              </div>
            );
          })}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="fd text-base font-bold text-slate-900">Ask the tutor</h2>
        <div className="flex gap-3"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-100"><Brain className="h-4 w-4 text-emerald-600" /></div><div className="max-w-[85%] rounded-2xl border border-stone-200 bg-white px-4 py-3 fb text-sm text-slate-700">Hi Tunde! Ready to continue with Photosynthesis? Ask anything or try a quick action below.</div></div>
        <div className="flex flex-row-reverse gap-3"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-200 fd text-xs font-bold text-slate-600">T</div><div className="max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 fb text-sm text-white">A plant in a dark cupboard turns pale after 3 days. Why?</div></div>
        <div className="flex gap-3">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-100"><Brain className="h-4 w-4 text-emerald-600" /></div>
          <div className="max-w-[85%] rounded-2xl border border-stone-200 bg-white px-4 py-3 fb text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Let us work through it — hint {Math.min(hint + 1, HINTS.length)}:</p>
            <p className="mt-1">{HINTS[Math.min(hint, HINTS.length - 1)]}</p>
            {hint < HINTS.length && <button type="button" onClick={() => setHint((h) => h + 1)} className="mt-3 rounded-full bg-stone-100 px-3 py-1.5 fb text-xs font-semibold text-slate-700 hover:bg-stone-200">{hint >= HINTS.length - 1 ? "Show full answer" : "Next hint"}</button>}
            {hint >= HINTS.length && <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 fb text-xs text-emerald-700">Without light, the plant cannot photosynthesise, so it cannot produce chlorophyll (causing paleness) or glucose for energy.</div>}
            <button type="button" className="mt-3 rounded-full border border-stone-200 px-3 py-1.5 fb text-xs font-semibold text-slate-600">Generate a similar question</button>
          </div>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-stone-200 bg-white p-3 lg:bottom-0 lg:left-64">
        <div className="mx-auto max-w-3xl flex flex-wrap gap-2 pb-2">
          {["Give me an example", "Quiz me on this", depth === "pidgin" ? "Switch to English" : "Switch to Pidgin", "View full lesson"].map((c) => (
            <button key={c} type="button" onClick={() => { if (c === "Quiz me on this") setActive("quiz"); if (c.includes("Pidgin")) setDepth("pidgin"); if (c.includes("English")) setDepth("standard"); }} className="rounded-full border border-stone-200 px-3 py-1.5 fb text-xs font-semibold text-slate-600 hover:bg-stone-50">{c}</button>
          ))}
        </div>
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <button type="button" aria-label="Upload image" className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-stone-200 text-slate-500 hover:bg-stone-50"><ImageIcon className="h-5 w-5" /></button>
          <button type="button" onClick={() => setListening((v) => !v)} aria-label="Voice input" className={"flex h-11 w-11 flex-none items-center justify-center rounded-full border transition " + (listening ? "border-rose-300 bg-rose-50 text-rose-500" : "border-stone-200 text-slate-500 hover:bg-stone-50")}><Mic className="h-5 w-5" /></button>
          <input type="text" placeholder={listening ? "Listening..." : "Ask about Photosynthesis..."} className="h-11 flex-1 rounded-full border border-stone-200 px-4 fb text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <button type="button" aria-label="Send" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

/* ─ STUDY LIBRARY ─ */
function StudyLibrary() {
  const [search, setSrch] = useState("");
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");
  const [tab, setTab] = useState("subjects");
  const cats = ["All", ...Object.keys(CAT_META)];
  const filtered = SUBJECTS.filter((s) => s.n.toLowerCase().includes(search.toLowerCase()) && (cat === "All" || s.cat === cat) && (lvl === "All" || s.lvls.includes(lvl)));
  return (
    <div className="pb-28">
      <div className="sticky top-[65px] z-20 border-b border-stone-200 bg-white px-4 sm:px-6">
        <div className="flex gap-6 fb text-sm font-semibold">
          {[["subjects", "All Subjects"], ["exams", "Exam Packs"], ["downloads", "My Downloads"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={"border-b-2 py-3 transition " + (tab === k ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500")}>{l}</button>
          ))}
        </div>
      </div>
      {tab === "subjects" && (
        <div className="p-4 space-y-5 sm:p-6">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(e) => setSrch(e.target.value)} placeholder="Search 60+ subjects..." aria-label="Search subjects" className="h-11 w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 fb text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="flex gap-2">
            {[{ k: "All", l: "All levels" }, { k: "JSS", l: "JSS1-JSS3" }, { k: "SS", l: "SS1-SS3" }].map(({ k, l }) => (
              <button key={k} type="button" onClick={() => setLvl(k)} className={"rounded-full border px-4 py-2 fb text-xs font-semibold transition " + (lvl === k ? "border-slate-900 bg-slate-900 text-white" : "border-stone-200 text-slate-600 hover:bg-stone-50")}>{l}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cats.map((c) => {
              const m = CAT_META[c];
              return <button key={c} type="button" onClick={() => setCat(c)} className={"flex flex-none items-center gap-1.5 rounded-full border px-4 py-2 fb text-xs font-semibold transition " + (cat === c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-200 text-slate-600 hover:bg-stone-50")}>{m && <m.icon className="h-3.5 w-3.5" />}{c}</button>;
            })}
          </div>
          <p className="fb text-sm text-slate-500">{filtered.length} subjects</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const m = CAT_META[s.cat] || { icon: BookOpen, c: "text-slate-500 bg-stone-100" };
              return (
                <div key={s.n} className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className={"flex h-10 w-10 flex-none items-center justify-center rounded-xl " + m.c}><m.icon className="h-5 w-5" /></div>
                    <Bdg ch={s.lvls.join("+")} cls="bg-stone-100 text-slate-600" />
                  </div>
                  <h3 className="mt-3 fd text-sm font-bold text-slate-900">{s.n}</h3>
                  <p className="fb text-xs text-slate-500">{s.cat} · {s.t} topics</p>
                  {s.p !== null && <div className="mt-3"><div className="h-1.5 w-full rounded-full bg-stone-100"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: s.p + "%" }} /></div><p className="mt-1 fb text-xs text-slate-500">{s.p}% complete</p></div>}
                  <div className="mt-4 flex gap-2">
                    <button type="button" className="flex flex-1 items-center justify-center rounded-full bg-slate-900 py-2 fb text-xs font-semibold text-white hover:bg-slate-800">Study now</button>
                    <button type="button" aria-label={"Download " + s.n} className={"flex h-9 w-9 flex-none items-center justify-center rounded-full border transition " + (s.dl ? "border-emerald-300 bg-emerald-50 text-emerald-600" : "border-stone-200 text-slate-500 hover:bg-stone-50")}>
                      {s.dl ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {tab === "exams" && (
        <div className="p-4 space-y-5 sm:p-6">
          <div><h2 className="fd text-lg font-bold text-slate-900">Exam Preparation Packs</h2><p className="mt-1 fb text-sm text-slate-500">Download a full pack to study offline. Each includes lessons, past questions, mock tests and revision notes.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EPACKS.map((p) => (
              <div key={p.n} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className={p.c + " px-5 py-4"}><GraduationCap className="h-6 w-6 text-white" /><h3 className="mt-2 fd text-base font-bold text-white">{p.n}</h3></div>
                <div className="p-5"><div className="flex items-center gap-4 fb text-sm text-slate-600"><span>{p.s} subjects</span><span>{p.sz}</span></div><button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 py-2.5 fb text-sm font-semibold text-slate-700 hover:bg-stone-50"><Download className="h-4 w-4" />Download pack</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "downloads" && (
        <div className="p-4 space-y-5 sm:p-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Storage used</h3><p className="fb text-sm font-semibold text-slate-700">134 MB / 2 GB</p></div>
            <div className="mt-3 h-2 w-full rounded-full bg-stone-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "6.7%" }} /></div>
            <p className="mt-2 fb text-xs text-slate-500">1.87 GB remaining</p>
          </div>
          <div className="space-y-2">
            {DLS.map((d) => (
              <div key={d.n} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-stone-100 text-slate-500"><Download className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1"><p className="fb text-sm font-semibold text-slate-800">{d.n}</p><p className="fb text-xs text-slate-400">{d.sz} · Downloaded {d.date}</p></div>
                <Bdg ch={<>{d.st === "Up to date" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}{d.st}</>} cls={d.st === "Up to date" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─ QUIZ CENTER ─ */
function QuizCenter() {
  const [stage, setStage] = useState("home");
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [ans, setAns] = useState(false);
  const [all, setAll] = useState([]);
  const [tl, setTl] = useState(30);
  const [fill, setFill] = useState("");
  const q = QUIZ_QS[qi];
  const score = all.filter((a, i) => a === QUIZ_QS[i].ans).length;
  useEffect(() => {
    if (stage !== "playing" || ans) return;
    const id = setInterval(() => setTl((t) => { if (t <= 1) { setAns(true); setAll((p) => [...p, -1]); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [stage, ans, qi]);
  function pick(i) { if (ans) return; setSel(i); setAns(true); setAll((p) => [...p, i]); }
  function next() { if (qi < QUIZ_QS.length - 1) { setQi((i) => i + 1); setSel(null); setAns(false); setFill(""); setTl(30); } else setStage("results"); }
  function restart() { setStage("home"); setQi(0); setSel(null); setAns(false); setAll([]); setTl(30); setFill(""); }
  if (stage === "home") return (
    <div className="p-4 pb-28 space-y-6 sm:p-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="fd text-lg font-bold text-slate-900">Quick start</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[{ l: "Topic Quiz", d: "Practice a specific topic with adaptive questions", b: "Recommended" }, { l: "Subject Mock Exam", d: "Full mock — 30 questions, timed", b: "WAEC style" }, { l: "Weak Areas Drill", d: "AI-selected questions on your weakest topics", b: "AI pick" }, { l: "Speed Round", d: "10 questions, 15 seconds each", b: "Challenge" }].map((qt) => (
            <button key={qt.l} type="button" onClick={() => setStage("playing")} className="rounded-xl border border-stone-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30">
              <div className="flex items-center justify-between"><h3 className="fd text-sm font-bold text-slate-900">{qt.l}</h3><Bdg ch={qt.b} cls="bg-indigo-100 text-indigo-700" /></div>
              <p className="mt-1 fb text-xs text-slate-500">{qt.d}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="fd text-lg font-bold text-slate-900">Recent performance</h2>
        <div className="mt-3 space-y-2">
          {[{ sub: "Biology", t: "Photosynthesis", s: 80, d: "Today" }, { sub: "Mathematics", t: "Quadratic Equations", s: 70, d: "Yesterday" }, { sub: "Chemistry", t: "Periodic Table", s: 60, d: "Jun 10" }].map((r) => (
            <div key={r.t} className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3">
              <div className="min-w-0 flex-1"><p className="fb text-sm font-semibold text-slate-800">{r.sub} — {r.t}</p><p className="fb text-xs text-slate-400">{r.d}</p></div>
              <div className={"fd text-lg font-bold " + (r.s >= 70 ? "text-emerald-600" : r.s >= 50 ? "text-amber-600" : "text-rose-600")}>{r.s}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  if (stage === "results") {
    const pct = Math.round((score / QUIZ_QS.length) * 100);
    return (
      <div className="p-4 pb-28 space-y-6 sm:p-6">
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          <p className="fb text-sm text-slate-400">Biology — Photosynthesis Quiz</p>
          <p className={"mt-4 fd text-6xl font-bold " + (pct >= 70 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-rose-400")}>{pct}%</p>
          <p className="mt-2 fd text-xl font-bold">{score} / {QUIZ_QS.length} correct</p>
          <p className="mt-1 fb text-sm text-slate-400">{pct >= 70 ? "Great work! You are on track." : "Keep practising — you are improving!"}</p>
          <div className="mt-4 flex justify-center"><Bdg ch={<><Star className="h-3.5 w-3.5" />+{pct >= 70 ? 40 : 20} XP earned</>} cls="bg-amber-400/20 text-amber-300" /></div>
        </div>
        <div className="space-y-2">
          {QUIZ_QS.map((qq, i) => {
            const ok = all[i] === qq.ans;
            return (
              <div key={i} className={"rounded-xl border p-4 " + (ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50")}>
                <div className="flex items-start gap-2">
                  {ok ? <CheckCircle2 className="h-5 w-5 flex-none text-emerald-500 mt-0.5" /> : <X className="h-5 w-5 flex-none text-rose-500 mt-0.5" />}
                  <div><p className="fb text-sm font-medium text-slate-800">{qq.q}</p><p className="mt-1 fb text-xs text-slate-600"><span className="font-semibold">Correct: </span>{qq.opts[qq.ans]}</p><p className="mt-1 fb text-xs text-slate-500">{qq.exp}</p></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={restart} className="flex-1 rounded-full bg-slate-900 py-3 fb text-sm font-semibold text-white hover:bg-slate-800">Try again</button>
          <button type="button" className="flex-1 rounded-full border border-stone-200 py-3 fb text-sm font-semibold text-slate-700 hover:bg-stone-50">Study weak topics</button>
        </div>
      </div>
    );
  }
  const prog = (qi / QUIZ_QS.length) * 100;
  const isOk = sel === q.ans;
  return (
    <div className="p-4 pb-28 space-y-5 sm:p-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={restart} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-slate-500 hover:bg-stone-50"><ChevronLeft className="h-4 w-4" /></button>
        <div className="flex-1"><div className="h-2 w-full rounded-full bg-stone-100"><div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: prog + "%" }} /></div></div>
        <span className="fb text-sm font-semibold text-slate-600">{qi + 1}/{QUIZ_QS.length}</span>
        <div className={"flex items-center gap-1 rounded-full px-3 py-1.5 fb text-xs font-semibold " + (tl <= 10 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}><Timer className="h-3.5 w-3.5" />{tl}s</div>
      </div>
      <Bdg ch={q.type === "mcq" ? "Multiple Choice" : q.type === "tf" ? "True / False" : "Fill in the Blank"} cls="bg-indigo-100 text-indigo-700" />
      <div className="rounded-2xl border border-stone-200 bg-white p-6"><p className="fd text-base font-bold text-slate-900 leading-snug">{q.q}</p></div>
      {q.type === "fill" ? (
        <div className="space-y-3">
          <input type="text" value={fill} onChange={(e) => setFill(e.target.value)} placeholder="Type your answer..." className="w-full rounded-xl border border-stone-200 px-4 py-3 fb text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          {!ans && <button type="button" onClick={() => pick(fill.toLowerCase().includes("chlorophyll") ? 0 : 3)} className="w-full rounded-full bg-slate-900 py-3 fb text-sm font-semibold text-white hover:bg-slate-800">Check answer</button>}
        </div>
      ) : (
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            let sty = "border-stone-200 bg-white text-slate-700 hover:border-slate-300";
            if (ans) { if (i === q.ans) sty = "border-emerald-400 bg-emerald-50 text-emerald-800"; else if (i === sel && !isOk) sty = "border-rose-400 bg-rose-50 text-rose-800"; else sty = "border-stone-100 bg-stone-50 text-slate-400 opacity-50"; }
            return (
              <button key={opt} type="button" onClick={() => pick(i)} disabled={ans} className={"flex w-full items-center gap-3 rounded-xl border p-4 text-left fb text-sm font-medium transition " + sty}>
                <span className={"flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs font-bold " + (ans && i === q.ans ? "border-emerald-500 bg-emerald-500 text-white" : ans && i === sel ? "border-rose-500 bg-rose-500 text-white" : "border-stone-300")}>{String.fromCharCode(65 + i)}</span>{opt}
              </button>
            );
          })}
        </div>
      )}
      {ans && <div className={"rounded-xl p-4 " + (isOk ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200")}><p className={"fb text-sm font-semibold " + (isOk ? "text-emerald-700" : "text-rose-700")}>{isOk ? "Correct!" : "Not quite."}</p><p className="mt-1 fb text-sm text-slate-600">{q.exp}</p></div>}
      {ans && <button type="button" onClick={next} className="w-full rounded-full bg-slate-900 py-3 fb text-sm font-semibold text-white hover:bg-slate-800">{qi < QUIZ_QS.length - 1 ? "Next question" : "See results"}</button>}
    </div>
  );
}

/* ─ PROGRESS CENTER ─ */
function ProgressCenter() {
  const [period, setPeriod] = useState("week");
  const streak = [true, true, true, false, true, true, true];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6">
      <div className="flex gap-2">
        {[{ k: "week", l: "This week" }, { k: "month", l: "This month" }, { k: "all", l: "All time" }].map(({ k, l }) => (
          <button key={k} type="button" onClick={() => setPeriod(k)} className={"rounded-full border px-4 py-2 fb text-xs font-semibold transition " + (period === k ? "border-slate-900 bg-slate-900 text-white" : "border-stone-200 text-slate-600 hover:bg-stone-50")}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ label: "Study time", value: "4h 50m", icon: Clock, c: "text-indigo-500 bg-indigo-100" }, { label: "Lessons done", value: "18", icon: BookOpen, c: "text-emerald-500 bg-emerald-100" }, { label: "Quiz average", value: "76%", icon: Target, c: "text-amber-500 bg-amber-100" }, { label: "XP earned", value: "680", icon: Zap, c: "text-rose-500 bg-rose-100" }].map((s) => (
          <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div>
            <p className="mt-3 fd text-xl font-bold text-slate-900">{s.value}</p>
            <p className="fb text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="fd text-base font-bold text-slate-900">Study time (minutes/day)</h3>
        <div className="mt-4" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={STUDY_TIME}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} name="Minutes" /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="fd text-base font-bold text-slate-900">Quiz scores by subject</h3>
        <div className="mt-4" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={QUIZ_BARS} barSize={28}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="sub" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Bar dataKey="s" fill="#6366f1" radius={[6, 6, 0, 0]} name="Score %" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="fd text-base font-bold text-slate-900">Subject mastery</h3>
        <div className="mt-4 space-y-4">
          {MASTERY.map((m) => {
            const bc = m.s >= 75 ? "bg-emerald-500" : m.s >= 50 ? "bg-amber-400" : "bg-rose-400";
            const lbl = m.s >= 75 ? "Strong" : m.s >= 50 ? "Improving" : "Needs work";
            const lc = m.s >= 75 ? "bg-emerald-100 text-emerald-700" : m.s >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
            return (
              <div key={m.sub}><div className="flex items-center justify-between mb-1"><span className="fb text-sm text-slate-700">{m.sub}</span><div className="flex items-center gap-2"><Bdg ch={lbl} cls={lc} /><span className="fb text-sm font-bold text-slate-900">{m.s}%</span></div></div><div className="h-2 w-full rounded-full bg-stone-100"><div className={"h-2 rounded-full " + bc} style={{ width: m.s + "%" }} /></div></div>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">12-day streak</h3><Bdg ch={<><Flame className="h-3.5 w-3.5" />On fire!</>} cls="bg-orange-100 text-orange-600" /></div>
        <div className="mt-4 flex gap-2">
          {days.map((d, i) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={"flex h-9 w-9 items-center justify-center rounded-full " + (streak[i] ? "bg-emerald-500 text-white" : "bg-stone-100 text-slate-300")}>{streak[i] ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</div>
              <span className="fb text-[10px] text-slate-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Achievements</h3><p className="fb text-xs text-slate-500">4 of 8 earned</p></div>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {BDGS.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1.5">
              <div className={"flex h-12 w-12 items-center justify-center rounded-2xl " + b.c + (!b.ok ? " opacity-40" : "")}><b.icon className="h-5 w-5" /></div>
              <p className="text-center fb text-[9px] leading-tight text-slate-500">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Class leaderboard</h3><Bdg ch="SS2 Sciences" cls="bg-indigo-100 text-indigo-700" /></div>
        <div className="mt-4 space-y-2">
          {BOARD.map((l) => (
            <div key={l.rank} className={"flex items-center gap-3 rounded-xl px-3 py-2.5 " + (l.me ? "bg-amber-50 border border-amber-200" : "border border-stone-100")}>
              <span className={"flex h-7 w-7 flex-none items-center justify-center rounded-full fd text-sm font-bold " + (l.rank === 1 ? "bg-amber-400 text-slate-900" : l.rank === 2 ? "bg-slate-200 text-slate-700" : l.rank === 3 ? "bg-orange-200 text-orange-800" : "bg-stone-100 text-slate-500")}>{l.rank}</span>
              <span className="flex-1 fb text-sm font-medium text-slate-800">{l.name}{l.me && <span className="ml-1 text-amber-600">(you)</span>}</span>
              <span className="fb text-xs text-slate-500"><Flame className="inline h-3 w-3 text-orange-400" />{l.st}</span>
              <span className="fd text-sm font-bold text-slate-900">{l.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─ STUDY PLANNER ─ */
function StudyPlanner() {
  const [day, setDay] = useState("Thu");
  const sessions = WEEKLY.find((d) => d.day === day)?.s ?? [];
  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6">
      <section>
        <h2 className="fd text-lg font-bold text-slate-900">Exam countdowns</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {EXAMS2.map((e) => (
            <div key={e.name} className={e.color + " rounded-2xl p-5 text-white"}>
              <div className="flex items-start justify-between">
                <div><p className="fb text-xs text-white/70">Exam</p><h3 className="fd text-xl font-bold">{e.name}</h3><p className="fb text-sm text-white/80">{e.subjects} subjects · {e.date}</p></div>
                <div className="text-right"><p className="fd text-4xl font-bold">{e.days}</p><p className="fb text-xs text-white/70">days</p></div>
              </div>
              <button type="button" className="mt-4 w-full rounded-full bg-white/20 py-2 fb text-sm font-semibold hover:bg-white/30">View revision plan</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">This week's schedule</h2><Bdg ch={<><Zap className="h-3 w-3" />AI-generated</>} cls="bg-indigo-100 text-indigo-700" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {WEEKLY.map((d) => (
            <button key={d.day} type="button" onClick={() => setDay(d.day)} className={"flex-none rounded-full px-4 py-2.5 fb text-xs font-semibold transition " + (day === d.day ? "bg-slate-900 text-white" : d.day === "Thu" ? "border-2 border-emerald-500 bg-white text-emerald-700" : "border border-stone-200 bg-white text-slate-600")}>
              {d.day}<span className="ml-1.5 text-[10px] opacity-70">{d.s.length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex w-12 flex-col items-center justify-center border-r border-stone-100 pr-3"><Clock className="h-4 w-4 text-slate-400" /><p className="mt-1 fb text-xs text-slate-400">{s.dur}</p></div>
              <div className="min-w-0 flex-1"><p className="fb text-sm font-semibold text-slate-800">{s.sub}</p><p className="fb text-xs text-slate-500">{s.t}</p></div>
              <Bdg ch={s.type} cls={TYPE_C[s.type] ?? "bg-stone-100 text-slate-600"} />
            </div>
          ))}
          {sessions.length === 0 && <div className="rounded-xl border border-stone-200 bg-white p-8 text-center"><p className="fb text-sm text-slate-500">No sessions planned — rest and recharge!</p></div>}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">Smart revision alerts</h2><Bdg ch="Urgent" cls="bg-rose-100 text-rose-600" /></div>
        <div className="mt-3 space-y-2">
          {[{ sub: "Physics", t: "Forces & Motion", r: "Scored 41% — urgent revision needed", w: "Today" }, { sub: "Chemistry", t: "Periodic Table", r: "Not studied in 12 days", w: "This week" }, { sub: "Biology", t: "Genetics", r: "Exam in 42 days, low mastery", w: "This week" }].map((r) => (
            <div key={r.t} className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 flex-none text-rose-500 mt-0.5" />
              <div className="flex-1"><p className="fb text-sm font-semibold text-slate-800">{r.sub} — {r.t}</p><p className="fb text-xs text-slate-500">{r.r}</p></div>
              <span className="fb text-xs font-semibold text-rose-600">{r.w}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-center">
          <Plus className="mx-auto h-8 w-8 text-stone-300" /><p className="mt-2 fb text-sm font-semibold text-slate-700">Add a study goal</p><p className="fb text-xs text-slate-500">Set a target and StudyPilot will plan your sessions.</p>
          <button type="button" className="mt-4 rounded-full bg-slate-900 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800">Set goal</button>
        </div>
      </section>
    </div>
  );
}

/* ─ RESOURCE GENERATOR ─ */
function ResourceGenerator() {
  const [rtype, setRtype] = useState("flashcards");
  const [ci, setCi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [depth, setDepth] = useState("standard");
  const [gen, setGen] = useState(false);
  const [ready, setReady] = useState(true);
  function generate() { setGen(true); setReady(false); setTimeout(() => { setGen(false); setReady(true); }, 1800); }
  const card = CARDS[ci];
  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
      <h2 className="fd text-lg font-bold text-slate-900">Generate study resources</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label><select className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"><option>Biology</option><option>Mathematics</option><option>Chemistry</option><option>Physics</option></select></div>
          <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Topic</label><input type="text" defaultValue="Photosynthesis" className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
        <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Explanation depth</label>
          <div className="mt-1 grid grid-cols-4 gap-1 rounded-full bg-stone-100 p-1">{DEPTHS.map((d) => <button key={d.k} type="button" onClick={() => setDepth(d.k)} className={"rounded-full py-2 fb text-xs font-semibold transition " + (depth === d.k ? (d.k === "pidgin" ? "bg-amber-400 text-slate-900" : "bg-slate-900 text-white") : "text-slate-500")}>{d.l}</button>)}</div>
        </div>
        <button type="button" onClick={generate} disabled={gen} className="w-full rounded-full bg-emerald-500 py-3 fb text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60">{gen ? "Generating with AI..." : "Generate resources"}</button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {RTYPES.map((r) => <button key={r.k} type="button" onClick={() => setRtype(r.k)} className={"flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 fb text-xs font-semibold transition " + (rtype === r.k ? "border-slate-900 bg-slate-900 text-white" : "border-stone-200 bg-white text-slate-600 hover:bg-stone-50")}><r.icon className="h-3.5 w-3.5" />{r.l}</button>)}
      </div>
      {gen && <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-stone-100 animate-pulse" />)}</div>}
      {ready && !gen && <>
        {rtype === "flashcards" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Flashcards Photosynthesis</h3><p className="fb text-sm text-slate-500">{ci + 1} / {CARDS.length}</p></div>
            <div style={{ perspective: 1000, height: 200, cursor: "pointer" }} onClick={() => setFlipped((f) => !f)}>
              <div style={{ transformStyle: "preserve-3d", transition: "transform 0.6s", transform: flipped ? "rotateY(180deg)" : "none", position: "relative", height: "100%" }}>
                <div style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 text-center"><p className="fb text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-3">Question tap to flip</p><p className="fd text-lg font-bold text-slate-900">{card.front}</p></div>
                <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }} className="flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center"><p className="fb text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-3">Answer</p><p className="fb text-base leading-relaxed text-slate-800 whitespace-pre-line">{card.back}</p></div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => { setCi((i) => Math.max(i - 1, 0)); setFlipped(false); }} disabled={ci === 0} className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-slate-500 disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => setFlipped((f) => !f)} className="flex items-center gap-2 rounded-full border border-stone-200 px-6 py-2.5 fb text-sm font-semibold text-slate-700 hover:bg-stone-50"><RotateCw className="h-4 w-4" />Flip card</button>
              <button type="button" onClick={() => { setCi((i) => Math.min(i + 1, CARDS.length - 1)); setFlipped(false); }} disabled={ci === CARDS.length - 1} className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-slate-500 disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        )}
        {rtype === "notes" && <div className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="fd text-base font-bold text-slate-900">Study Notes Photosynthesis</h3><pre className="mt-4 whitespace-pre-wrap fb text-sm leading-relaxed text-slate-700">{NOTES}</pre></div>}
        {rtype === "cheatsheet" && <div className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="fd text-base font-bold text-slate-900">Cheat Sheet Photosynthesis</h3><div className="mt-4 space-y-2">{CHEAT.map((c) => <div key={c.t} className="flex gap-3 rounded-xl bg-stone-50 px-4 py-3"><span className="w-36 flex-none fd text-sm font-bold text-slate-900">{c.t}</span><span className="fb text-sm text-slate-600">{c.d}</span></div>)}</div></div>}
        {rtype === "mindmap" && (
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="fd text-base font-bold text-slate-900">Mind Map Photosynthesis</h3>
            <div className="mt-6 flex flex-col items-center gap-6">
              <div className="rounded-2xl bg-indigo-600 px-6 py-3 text-white fd text-base font-bold">Photosynthesis</div>
              <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-4">
                {[{ node: "Inputs", ch: ["CO2", "H2O", "Light"] }, { node: "Outputs", ch: ["Glucose", "Oxygen"] }, { node: "Location", ch: ["Chloroplast", "Thylakoid", "Stroma"] }, { node: "Factors", ch: ["Light intensity", "CO2 level", "Temperature"] }].map((b) => (
                  <div key={b.node} className="rounded-xl border border-indigo-100 bg-indigo-50 p-3"><p className="fd text-xs font-bold text-indigo-700 mb-2">{b.node}</p>{b.ch.map((c) => <p key={c} className="fb text-xs text-slate-600 py-0.5"> {c}</p>)}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {rtype === "questions" && <div className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="fd text-base font-bold text-slate-900">Revision Questions Photosynthesis</h3><div className="mt-4 space-y-3">{REVQS.map((q, i) => <div key={i} className="rounded-xl bg-stone-50 p-4"><p className="fb text-sm text-slate-800">{q}</p></div>)}</div></div>}
        <div className="flex gap-3">
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 py-3 fb text-sm font-semibold text-slate-700 hover:bg-stone-50"><FileDown className="h-4 w-4" />Export PDF</button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 py-3 fb text-sm font-semibold text-slate-700 hover:bg-stone-50"><FileText className="h-4 w-4" />Export DOCX</button>
        </div>
      </>}
    </div>
  );
}


/* HOMEWORK ASSISTANT */
function HomeworkAssistant() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    setHintIndex(0);
    setUserAnswer("");
    setAnswerResult(null);
    
    setTimeout(() => {
      setLoading(false);
      setResponse({
        concept: "Law of Conservation of Mass",
        conceptExplanation: "The total mass of reactants in a chemical reaction must equal the total mass of the products. Mass can neither be created nor destroyed.",
        hints: [
          "Count the number of Carbon (C) atoms on both sides of the equation.",
          "Check how many Oxygen (O) atoms are in one molecule of CO2 versus O2.",
          "Balance the equations by matching the ratio of Carbon to Oxygen atoms."
        ],
        workedExample: {
          problem: "Balance: H2 + O2 -> H2O",
          steps: [
            "Reactants side: 2 Hydrogen atoms, 2 Oxygen atoms.",
            "Products side: 2 Hydrogen atoms, 1 Oxygen atom.",
            "Multiply H2O by 2 to balance Oxygen: H2 + O2 -> 2H2O (4 H, 2 O)",
            "Multiply H2 by 2 to balance Hydrogen: 2H2 + O2 -> 2H2O (4 H, 2 O - Balanced!)"
          ]
        },
        followUp: {
          question: "If 12g of Carbon reacts completely with 32g of Oxygen, what will be the total mass of Carbon Dioxide (CO2) produced?",
          choices: ["22g", "44g", "32g", "12g"],
          correctAnswer: 1,
          explanation: "According to the Law of Conservation of Mass: Reactant Mass (12g Carbon + 32g Oxygen) = Product Mass (CO2). Therefore, 12 + 32 = 44g."
        }
      });
    }, 1500);
  };

  const handleVerifyAnswer = () => {
    if (userAnswer === "") return;
    const isCorrect = parseInt(userAnswer) === response.followUp.correctAnswer;
    setAnswerResult({
      correct: isCorrect,
      explanation: response.followUp.explanation
    });
  };

  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6 max-w-4xl mx-auto">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <Lightbulb className="h-5 w-5" />
          <h2 className="fd text-lg font-bold text-slate-900">AI Homework Assistant</h2>
        </div>
        <p className="fb text-sm text-slate-500">
          Paste a difficult question, specify your homework problem, or upload a query. The AI will explain the concepts and give you hints to solve it, keeping the focus on real learning!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type or paste your homework question here... (e.g., How do I balance the chemical equation C + O2 -> CO2?)"
            className="w-full h-32 rounded-xl border border-stone-200 p-4 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 fb text-xs font-semibold text-slate-600 hover:bg-stone-50"
            >
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </button>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-full bg-slate-900 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Analyzing concept..." : "Get Concept & Hints"}
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="space-y-4">
          <div className="h-28 rounded-2xl bg-stone-100 animate-pulse border border-stone-200" />
          <div className="h-40 rounded-2xl bg-stone-100 animate-pulse border border-stone-200" />
        </div>
      )}

      {response && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <Brain className="h-5 w-5" />
              <h3 className="fd text-base font-bold">Concept: {response.concept}</h3>
            </div>
            <p className="fb text-sm leading-relaxed text-slate-700">{response.conceptExplanation}</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="fd text-base font-bold text-slate-900">Step-by-Step Hints</h3>
              <span className="fb text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                Hint {hintIndex + 1} of {response.hints.length}
              </span>
            </div>
            <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
              <p className="fb text-sm text-slate-700 leading-relaxed italic">
                "{response.hints[hintIndex]}"
              </p>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setHintIndex((i) => Math.max(0, i - 1))}
                disabled={hintIndex === 0}
                className="fb text-xs font-bold text-emerald-600 disabled:opacity-40"
              >
                Previous Hint
              </button>
              <button
                type="button"
                onClick={() => setHintIndex((i) => Math.min(response.hints.length - 1, i + 1))}
                disabled={hintIndex === response.hints.length - 1}
                className="fb text-xs font-bold text-emerald-600 disabled:opacity-40"
              >
                Next Hint
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
            <h3 className="fd text-base font-bold text-slate-900">Worked Example of Similar Problem</h3>
            <div className="rounded-xl border border-dashed border-stone-200 p-4 bg-stone-50/50">
              <p className="fb text-sm font-semibold text-slate-800 mb-2">{response.workedExample.problem}</p>
              <ul className="space-y-1.5">
                {response.workedExample.steps.map((s, idx) => (
                  <li key={idx} className="fb text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-5 space-y-4">
            <h3 className="fd text-base font-bold text-slate-900">Check Your Understanding</h3>
            <p className="fb text-sm text-slate-700 leading-relaxed">{response.followUp.question}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {response.followUp.choices.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserAnswer(idx.toString());
                    setAnswerResult(null);
                  }}
                  className={`text-left p-3.5 rounded-xl border fb text-sm transition ${
                    userAnswer === idx.toString()
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleVerifyAnswer}
                disabled={userAnswer === ""}
                className="rounded-full bg-emerald-600 px-6 py-2 fb text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Submit Answer
              </button>
            </div>
            {answerResult && (
              <div className={`p-4 rounded-xl border ${
                answerResult.correct ? "bg-emerald-100 border-emerald-200 text-emerald-800" : "bg-rose-100 border-rose-200 text-rose-800"
              }`}>
                <p className="fb text-sm font-semibold mb-1">
                  {answerResult.correct ? "Excellent! Correct." : "Incorrect. Try looking over the hints again!"}
                </p>
                <p className="fb text-xs leading-relaxed opacity-90">{answerResult.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* EXAM SIMULATOR */
function ExamSimulator() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [questions, setQuestions] = useState([]);
  const [curIdx, setCurIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const EXAMS_LIST = [
    { id: "waec-bio", name: "WAEC Biology Mock 2026", duration: 1200, count: 5, category: "Sciences" },
    { id: "jamb-math", name: "JAMB Mathematics Prep", duration: 1800, count: 5, category: "Core" },
    { id: "neco-govt", name: "NECO Government Mock", duration: 1500, count: 5, category: "Arts & Humanities" }
  ];

  const MOCK_QUESTIONS = [
    { q: "What is the function of the ribosome in a cell?", opts: ["Synthesize proteins", "Store DNA", "Produce lipids", "Generate ATP"], ans: 0 },
    { q: "Which of the following is a product of anaerobic respiration in yeast?", opts: ["Lactic acid", "Ethanol and CO2", "Water and oxygen", "Glucose and ATP"], ans: 1 },
    { q: "Which organ system is responsible for transporting oxygen and nutrients throughout the body?", opts: ["Circulatory System", "Respiratory System", "Nervous System", "Digestive System"], ans: 0 },
    { q: "What role do guard cells play in plant leaves?", opts: ["Protect stomatal pores", "Store carbohydrates", "Absorb carbon dioxide", "Regulate gas exchange and transpiration"], ans: 3 },
    { q: "Which molecule stores genetic information in all living organisms?", opts: ["RNA", "DNA", "ATP", "Glucose"], ans: 1 }
  ];

  useEffect(() => {
    let timer;
    if (started && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  const handleStart = (exam) => {
    setSelectedExam(exam);
    setQuestions(MOCK_QUESTIONS);
    setTimeLeft(exam.duration);
    setAnswers({});
    setCurIdx(0);
    setStarted(true);
    setSubmitted(false);
  };

  const handleSelectOption = (optIdx) => {
    setAnswers({ ...answers, [curIdx]: optIdx });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.ans) correct++;
    });
    setScore(correct);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  if (started && !submitted) {
    return (
      <div className="p-4 pb-28 space-y-6 sm:p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 bg-white p-4 rounded-xl shadow-sm">
            <div>
              <span className="fb text-xs bg-slate-900 text-amber-400 font-semibold px-3 py-1 rounded-full uppercase tracking-wider">{selectedExam.name.split(" ")[0]} Mode</span>
              <h2 className="fd text-lg font-bold text-slate-900 mt-2">{selectedExam.name}</h2>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-2xl">
              <Clock className="h-5 w-5 animate-pulse" />
              <span className="fd text-lg font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="fb text-xs font-bold text-slate-400 uppercase tracking-wide">Question {curIdx + 1} of {questions.length}</span>
            </div>
            <p className="fd text-base font-bold text-slate-800 leading-relaxed">{questions[curIdx].q}</p>
            <div className="grid gap-3">
              {questions[curIdx].opts.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`text-left p-4 rounded-xl border fb text-sm transition ${
                    answers[curIdx] === idx
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded-full border text-center leading-6 text-xs mr-3 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurIdx((i) => Math.max(0, i - 1))}
              disabled={curIdx === 0}
              className="rounded-full border border-stone-200 px-6 py-2.5 fb text-sm font-semibold text-slate-700 hover:bg-stone-50 disabled:opacity-40"
            >
              Previous Question
            </button>
            {curIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurIdx((i) => i + 1)}
                className="rounded-full bg-slate-900 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800"
              >
                Next Question
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-emerald-600 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-64 flex-none space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
            <h3 className="fd text-sm font-bold text-slate-900">Question Grid</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurIdx(idx)}
                  className={`h-10 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    curIdx === idx
                      ? "bg-slate-900 text-white"
                      : answers[idx] !== undefined
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-stone-50 text-slate-500 border border-stone-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-full border border-rose-200 py-2.5 fb text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              Force Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="p-4 pb-28 space-y-6 sm:p-6 max-w-3xl mx-auto text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6 shadow-sm">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Trophy className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="fd text-2xl font-bold text-slate-900">Exam Scorecard</h2>
            <p className="fb text-sm text-slate-500">{selectedExam.name}</p>
          </div>
          <div className="py-4 border-y border-stone-100 flex justify-around">
            <div>
              <p className="fd text-4xl font-extrabold text-slate-900">{score} / {questions.length}</p>
              <p className="fb text-xs text-slate-400 uppercase font-semibold">Correct Answers</p>
            </div>
            <div>
              <p className="fd text-4xl font-extrabold text-indigo-600">{pct}%</p>
              <p className="fb text-xs text-slate-400 uppercase font-semibold">Overall Grade</p>
            </div>
          </div>
          <div className="text-left space-y-3">
            <h3 className="fd text-sm font-bold text-slate-800">Exam Analysis</h3>
            <div className="p-4 rounded-xl bg-stone-50 text-xs fb text-slate-600 leading-relaxed space-y-1">
              <p>• Strong performance in cell biology structure questions.</p>
              <p>• Area needing improvement: Anaerobic respiration chemical equations.</p>
              <p>• Speed: Completed with {formatTime(timeLeft)} remaining.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="w-full rounded-full bg-slate-900 py-3 fb text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Exams List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6 max-w-4xl mx-auto">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="fd text-lg font-bold text-slate-900">Exam Preparation Simulator</h2>
        <p className="fb text-sm text-slate-500">
          Prepare under realistic exam conditions for WAEC, JAMB, NECO, and other secondary school milestones. These mocks are fully timed and match standard curriculum boards.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMS_LIST.map((e) => (
          <div key={e.id} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition">
            <div>
              <span className="fb text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">{e.category}</span>
              <h3 className="fd text-base font-bold text-slate-900 mt-2">{e.name}</h3>
              <p className="fb text-xs text-slate-400 mt-1">{e.count} questions · {e.duration / 60} minutes</p>
            </div>
            <button
              type="button"
              onClick={() => handleStart(e)}
              className="w-full mt-4 rounded-full bg-slate-900 py-2 fb text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start Simulator
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* OFFLINE SYNC QUEUE MANAGER */
function SyncQueueManager() {
  const [syncing, setSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const pendingQuizzes = [
    { id: 101, sub: "Biology", topic: "Genetics", score: "80%", date: "Offline (2h ago)" },
    { id: 102, sub: "Mathematics", topic: "Quadratic Equations", score: "70%", date: "Offline (1d ago)" }
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedCount(pendingQuizzes.length);
    }, 2000);
  };

  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6 max-w-4xl mx-auto">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <RefreshCw className="h-5 w-5" />
            <h2 className="fd text-lg font-bold text-slate-900">Offline Sync Queue</h2>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing || syncedCount > 0}
            className="rounded-full bg-slate-900 px-6 py-2 fb text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
        <p className="fb text-sm text-slate-500">
          Manage local learning data gathered while studying without internet connection. Reconnect when possible to sync achievements, streak updates, and quiz scorecards.
        </p>
      </section>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <h3 className="fd text-sm font-bold text-slate-900">Pending Sync Items</h3>
        {syncedCount > 0 ? (
          <div className="text-center py-6 text-slate-400 fb text-xs">
            All offline activities successfully synced! You are up to date.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingQuizzes.map((pq) => (
              <div key={pq.id} className="flex justify-between items-center p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                <div>
                  <p className="fb text-sm font-semibold text-slate-800">{pq.sub} — {pq.topic}</p>
                  <p className="fb text-xs text-slate-400">{pq.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="fb text-xs font-bold text-slate-700 bg-amber-100 text-amber-800 px-3 py-1 rounded-full">Score: {pq.score}</span>
                  <span className="fb text-xs text-slate-400">Waiting Sync</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
        <h3 className="fd text-sm font-bold text-slate-900">Offline Conflict Resolution</h3>
        <p className="fb text-xs text-slate-500">
          In case of version differences between the server database and local device files (e.g. downloaded study notes modified elsewhere):
        </p>
        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 space-y-3">
          <p className="fb text-xs font-semibold text-slate-700">Conflict found: biology-ss2-photosynthesis (Notes)</p>
          <div className="flex gap-2">
            <button type="button" className="rounded-full bg-slate-900 px-4 py-1.5 fb text-[10px] text-white font-semibold">Keep Local</button>
            <button type="button" className="rounded-full border border-stone-200 bg-white px-4 py-1.5 fb text-[10px] text-slate-600 font-semibold">Keep Server</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SETTINGS */
function SettingsPage() {
  const [lang, setLang] = useState("standard");
  const [notifs, setNotifs] = useState({ daily: true, streak: true, parent: false, weekly: true });
  const [acc, setAcc] = useState({ large: false, contrast: false });
  const [retain, setRetain] = useState(false);
  return (
    <div className="p-4 pb-28 space-y-6 sm:p-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
        <h2 className="fd text-base font-bold text-slate-900">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-amber-400 fd text-xl font-bold text-slate-900">T</div>
          <button type="button" className="fb text-sm font-semibold text-emerald-600 hover:text-emerald-700">Change photo</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[{ label: "Full name", val: "Tunde Adekunle" }, { label: "Email address", val: "tunde@example.com" }, { label: "School", val: "Birnin Kebbi High School" }, { label: "Class level", val: "SS2" }].map((f) => (
            <div key={f.label}><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">{f.label}</label><input type="text" defaultValue={f.val} className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          ))}
        </div>
        <button type="button" className="rounded-full bg-slate-900 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800">Save changes</button>
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
        <h2 className="fd text-base font-bold text-slate-900">Language & learning</h2>
        <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Default explanation mode</label>
          <div className="mt-2 grid grid-cols-4 gap-1 rounded-full bg-stone-100 p-1">{DEPTHS.map((d) => <button key={d.k} type="button" onClick={() => setLang(d.k)} className={"rounded-full py-2 fb text-xs font-semibold transition " + (lang === d.k ? (d.k === "pidgin" ? "bg-amber-400 text-slate-900" : "bg-slate-900 text-white") : "text-slate-500")}>{d.l}</button>)}</div>
        </div>
        {[{ k: "tts", l: "Voice learning (TTS)", d: "Read lessons and questions aloud", on: true }, { k: "lbw", l: "Low-bandwidth mode", d: "Reduce data no images, smaller responses", on: false }].map((s) => (
          <div key={s.k} className="flex items-center justify-between"><div><p className="fb text-sm font-semibold text-slate-800">{s.l}</p><p className="fb text-xs text-slate-500">{s.d}</p></div><Tog on={s.on} fn={() => {}} label={s.l} /></div>
        ))}
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
        <h2 className="fd text-base font-bold text-slate-900">Accessibility</h2>
        {[{ k: "large", l: "Large text", d: "Increase font size across the app" }, { k: "contrast", l: "High contrast", d: "Stronger colour contrast for low vision" }].map((a) => (
          <div key={a.k} className="flex items-center justify-between"><div><p className="fb text-sm font-semibold text-slate-800">{a.l}</p><p className="fb text-xs text-slate-500">{a.d}</p></div><Tog on={acc[a.k]} fn={(v) => setAcc((p) => ({ ...p, [a.k]: v }))} label={a.l} /></div>
        ))}
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
        <h2 className="fd text-base font-bold text-slate-900">Notifications</h2>
        {[{ k: "daily", l: "Daily study reminder", d: "Get a reminder to study each day" }, { k: "streak", l: "Streak alerts", d: "Alert before your streak breaks" }, { k: "weekly", l: "Weekly progress report", d: "Summary sent every Sunday" }, { k: "parent", l: "Share report with parent", d: "Send weekly report to a parent/guardian" }].map((n) => (
          <div key={n.k} className="flex items-center justify-between"><div><p className="fb text-sm font-semibold text-slate-800">{n.l}</p><p className="fb text-xs text-slate-500">{n.d}</p></div><Tog on={notifs[n.k]} fn={(v) => setNotifs((p) => ({ ...p, [n.k]: v }))} label={n.l} /></div>
        ))}
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-slate-500" /><h2 className="fd text-base font-bold text-slate-900">Offline storage</h2></div>
        <div><div className="flex justify-between fb text-sm"><span className="text-slate-600">Used</span><span className="font-semibold text-slate-800">134 MB / 2 GB</span></div><div className="mt-2 h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "6.7%" }} /></div></div>
        <button type="button" className="fb text-sm font-semibold text-rose-600 hover:text-rose-700">Clear all downloads</button>
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-slate-500" /><h2 className="fd text-base font-bold text-slate-900">Privacy & data</h2></div>
        <div className="flex items-center justify-between"><div><p className="fb text-sm font-semibold text-slate-800">Keep answers beyond 30 days</p><p className="fb text-xs text-slate-500">By default answers are deleted after 30 days (GDPR)</p></div><Tog on={retain} fn={setRetain} label="Retain answers" /></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="flex-1 rounded-full border border-stone-200 py-2.5 fb text-sm font-semibold text-slate-700 hover:bg-stone-50">Export my data</button>
          <button type="button" className="flex-1 rounded-full border border-rose-200 py-2.5 fb text-sm font-semibold text-rose-600 hover:bg-rose-50">Delete account</button>
        </div>
        <div className="rounded-xl bg-stone-50 p-3"><p className="fb text-xs text-slate-500">StudyPilot AI complies with GDPR and COPPA. Users under 13 require parent/guardian consent. <span className="text-emerald-600 underline cursor-pointer">Read our privacy policy</span></p></div>
      </section>
      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 py-4 fb text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" />Sign out</button>
    </div>
  );
}

/* ROOT */
export default function StudyPilotApp() {
  const [active, setActive] = useState("dashboard");
  const [online, setOnline] = useState(true);
  const cur = NAV.find((n) => n.key === active);
  return (
    <div className="fb">
      <style>{FONTS}</style>
      <div className="flex min-h-screen bg-stone-50">
        <Sidebar active={active} setActive={setActive} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar online={online} setOnline={setOnline} title={cur.label} />
          <main className="flex-1">
            {active === "dashboard" && <Dashboard setActive={setActive} />}
            {active === "tutor" && <TutorChat setActive={setActive} />}
            {active === "homework" && <HomeworkAssistant />}
            {active === "library" && <StudyLibrary />}
            {active === "quiz" && <QuizCenter />}
            {active === "exam" && <ExamSimulator />}
            {active === "progress" && <ProgressCenter />}
            {active === "planner" && <StudyPlanner />}
            {active === "resources" && <ResourceGenerator />}
            {active === "sync" && <SyncQueueManager />}
            {active === "settings" && <SettingsPage />}
          </main>
        </div>
        <BotNav active={active} setActive={setActive} />
      </div>
    </div>
  );
}
