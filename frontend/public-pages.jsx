"use client";

import { useState } from "react";
import { Brain, BookOpen, ListChecks, BarChart3, WifiOff, Mic, Languages, CalendarDays, FileText, Trophy, Users, GraduationCap, ChevronRight, ChevronDown, CheckCircle2, Globe2, Zap, Shield, Heart, Star, MapPin, Mail, Phone, Send, ArrowRight, Sparkles, Target, Clock, TrendingUp } from "lucide-react";
import { StudyPilotLogo } from "../src/components/StudyPilotLogo";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');.fd{font-family:'Lexend',system-ui,sans-serif}.fb{font-family:'Inter',system-ui,sans-serif}`;

const ALL_FEATURES = [
  { icon: Brain, color: "text-indigo-600 bg-indigo-100", title: "AI Tutor Engine", desc: "Every topic explained four ways — Beginner, Standard, Advanced, and Naija Pidgin — with definitions, key concepts, real-life analogies, worked examples and a recap. Powered by Gemini 3.", tag: "Core AI" },
  { icon: ListChecks, color: "text-emerald-600 bg-emerald-100", title: "Adaptive Quiz Center", desc: "Auto-generated MCQ, True/False, Fill-in-the-Blank, Short Answer and Matching questions. Quiz difficulty adjusts to the student's actual level after every session.", tag: "Core AI" },
  { icon: BookOpen, color: "text-amber-600 bg-amber-100", title: "Smart Study Library", desc: "60+ subjects organised by school level (JSS1–SS3) and category (Core, Sciences, Arts, Commercial, Trade & Vocational). Searchable, filterable, and downloadable.", tag: "Content" },
  { icon: WifiOff, color: "text-teal-600 bg-teal-100", title: "Offline Learning Packs", desc: "Download any subject pack, topic pack or exam pack on Wi-Fi once. Read, revise and take quizzes all week with zero data. Automatic sync when back online via IndexedDB.", tag: "Offline-first" },
  { icon: Languages, color: "text-rose-600 bg-rose-100", title: "Pidgin English Mode", desc: "One tap switches any lesson or explanation into Naija Pidgin. 'Photosynthesis na how plant dey use sunlight make food.' Every topic, every level, fully supported.", tag: "Accessibility" },
  { icon: Mic, color: "text-violet-600 bg-violet-100", title: "Voice Learning (TTS)", desc: "Text-to-Speech reads lessons, summaries and quiz questions aloud in English or Pidgin. Voice input lets students ask questions hands-free using the Web Speech API.", tag: "Accessibility" },
  { icon: GraduationCap, color: "text-blue-600 bg-blue-100", title: "Exam Preparation", desc: "Dedicated exam mode for WAEC, JAMB, NECO, NABTEB, GCSE and SAT. Timed mock exams, past-question style practice, smart revision plans and countdown timers.", tag: "Exam Prep" },
  { icon: CalendarDays, color: "text-orange-600 bg-orange-100", title: "AI Study Planner", desc: "AI generates a personalised daily and weekly study schedule based on available time, upcoming exams and weak subjects. Revision reminders keep students on track.", tag: "Core AI" },
  { icon: BarChart3, color: "text-cyan-600 bg-cyan-100", title: "Progress Tracking", desc: "Visual dashboards showing study time, quiz scores, lessons completed, learning streaks and subject mastery — daily, weekly and monthly views with recharts.", tag: "Analytics" },
  { icon: FileText, color: "text-lime-600 bg-lime-100", title: "Resource Generator", desc: "Generate study notes, cheat sheets, flashcards (with 3D flip), mind maps, and revision questions for any topic. Export as PDF or DOCX with one click.", tag: "Core AI" },
  { icon: Trophy, color: "text-yellow-600 bg-yellow-100", title: "Gamification System", desc: "XP points, learning streaks, achievement badges (7-Day Streak, Quiz Master, Pidgin Explorer), and a class leaderboard keep students motivated and engaged.", tag: "Engagement" },
  { icon: Users, color: "text-pink-600 bg-pink-100", title: "Parent & Teacher Tools", desc: "Parents monitor performance, weak areas and activity. Teachers create classrooms, assign goals, track rankings and view class analytics. Admins manage the platform.", tag: "Multi-role" },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Sign up and choose your subjects", desc: "Select your class level (JSS1–SS3), the subjects you study, your target exam board, and how long you can study each day." },
  { n: "02", title: "AI tutor teaches at your pace", desc: "Get any topic explained in Beginner, Standard, Advanced or Pidgin mode. Work through the 6-step lesson until it fully clicks." },
  { n: "03", title: "Practise with adaptive quizzes", desc: "Five question types, auto-marked with instant feedback. The AI adjusts difficulty based on your answers to target your weakest points." },
  { n: "04", title: "Track, plan and revise smartly", desc: "StudyPilot builds your revision schedule, spots weak areas before your exams, and celebrates every milestone with badges and XP." },
];

const TEAM = [
  { name: "Abdullahi Ibrahim", role: "Product Architect & Full-Stack Lead", init: "A", color: "bg-amber-400" },
  { name: "Chidinma Okafor", role: "AI Engineer & Prompt Specialist", init: "C", color: "bg-indigo-400" },
  { name: "Emeka Nwosu", role: "Education Technology Specialist", init: "E", color: "bg-emerald-400" },
  { name: "Fatima Bello", role: "UI/UX Designer & Accessibility Lead", init: "F", color: "bg-rose-400" },
];

const FAQ = [
  { q: "Is StudyPilot AI really free?", a: "The Free plan is free forever with no card required. It covers 3 AI lessons per day, adaptive quizzes, and 1 offline subject pack — enough for a student to start learning immediately." },
  { q: "Does it work without internet?", a: "Yes. Download any subject or exam pack on Wi-Fi, then read, revise and take quizzes all week with zero data. Your answers and progress sync automatically when you reconnect." },
  { q: "Which exams does it support?", a: "WAEC, JAMB UTME, NECO, NABTEB, GCSE and SAT are all supported with past-question style practice, timed mocks and personalised revision plans." },
  { q: "How is it different from just using ChatGPT?", a: "StudyPilot is built specifically for Nigerian secondary school students. It knows the full curriculum (JSS1–SS3, 60+ subjects), adapts difficulty after every quiz, speaks Pidgin English, works offline, and tracks exam-specific progress — none of which a generic AI does." },
  { q: "Is my child's data safe?", a: "Yes. Answers are auto-deleted after 30 days (GDPR-aligned) unless you opt in. Users under 13 require parent/guardian consent. Gemini safety filters are set to maximum." },
  { q: "Can my school get a plan?", a: "Yes. The School plan is custom-priced and includes teacher classrooms, class analytics, admin controls, curriculum management and onboarding support. Contact us to discuss." },
];

/* SHARED NAV */
function PublicNav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a href="#" onClick={() => setPage("features")} className="flex items-center gap-2.5">
          <StudyPilotLogo size={36} priority />
          <div className="hidden sm:block"><p className="fd text-base font-bold text-slate-900 leading-tight">StudyPilot AI</p><p className="fb text-xs text-slate-400">Quality education for every student</p></div>
        </a>
        <nav className="hidden items-center gap-8 fb text-sm font-medium text-slate-600 md:flex">
          {[["features", "Features"], ["pricing", "Pricing"], ["about", "About"], ["contact", "Contact"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setPage(k)} className={"transition hover:text-slate-900 " + (page === k ? "text-emerald-600 font-semibold" : "")}>{l}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.location.href = "/auth"} className="hidden fb text-sm font-semibold text-slate-600 hover:text-slate-900 sm:block">Sign in</button>
          <button type="button" onClick={() => window.location.href = "/auth"} className="rounded-full bg-amber-400 px-4 py-2 fb text-sm font-bold text-slate-900 hover:bg-amber-300 transition">Get started free</button>
          <button type="button" onClick={() => setOpen(v => !v)} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-stone-100 md:hidden" aria-label="Menu">
            <div className="space-y-1"><span className="block h-0.5 w-5 bg-slate-600" /><span className="block h-0.5 w-5 bg-slate-600" /><span className="block h-0.5 w-5 bg-slate-600" /></div>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          {[["features", "Features"], ["pricing", "Pricing"], ["about", "About"], ["contact", "Contact"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setPage(k); setOpen(false); }} className="flex w-full items-center justify-between py-3 fb text-sm font-medium text-slate-700 border-b border-stone-100 last:border-0">
              {l}<ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* FEATURES PAGE */
function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 fb text-xs font-semibold text-amber-300"><Sparkles className="h-3.5 w-3.5" />Powered by Google Gemini 3 AI</span>
          <h1 className="mt-6 fd text-4xl font-bold text-white sm:text-5xl">Everything a student needs,<br /><span className="text-amber-400">in one platform</span></h1>
          <p className="mt-6 mx-auto max-w-2xl fb text-lg text-slate-300">Twelve tools working together — AI tutor, quiz engine, offline packs, Pidgin mode, voice learning, exam prep, resource generator and more.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 fd text-base font-bold text-slate-900 hover:bg-amber-300 transition">Start free today <ArrowRight className="h-4 w-4" /></button>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-7 py-3.5 fd text-base font-bold text-white hover:border-slate-500 transition">For schools <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 fb text-sm text-slate-400">
            <span className="flex items-center gap-2"><WifiOff className="h-4 w-4 text-emerald-400" />Works offline</span>
            <span className="flex items-center gap-2"><Languages className="h-4 w-4 text-amber-400" />Pidgin English</span>
            <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-indigo-400" />6 exam boards</span>
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-rose-400" />60+ subjects</span>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-emerald-600">Full feature set</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">Not just a chatbot — a complete learning system</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-md hover:border-stone-300">
                <div className="flex items-start justify-between gap-3">
                  <div className={"flex h-11 w-11 flex-none items-center justify-center rounded-xl " + f.color}><f.icon className="h-5 w-5" /></div>
                  <span className="inline-flex items-center rounded-full border border-stone-200 px-2.5 py-1 fb text-[10px] font-semibold text-slate-500">{f.tag}</span>
                </div>
                <h3 className="mt-4 fd text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 fb text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-amber-600">How it works</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">From first lesson to exam day</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-stone-50 p-6">
                <p className="fd text-sm font-bold text-amber-500">{s.n}</p>
                <h3 className="mt-3 fd text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 fb text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-emerald-600">Pricing</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">Free to start. Affordable to grow.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: "Free", price: "₦0", period: "/forever", features: ["AI tutor — 3 lessons/day", "Adaptive quizzes", "English & Pidgin mode", "1 offline subject pack", "Progress dashboard"], cta: "Start free", highlight: false },
              { name: "Pro", price: "₦1,500", period: "/month", features: ["Unlimited AI tutoring", "All offline packs (60+ subjects)", "Voice lessons (TTS)", "Full exam prep for all 6 boards", "Parent progress reports", "Resource generator"], cta: "Go Pro", highlight: true },
              { name: "School", price: "Custom", period: " pricing", features: ["Everything in Pro per student", "Teacher classroom dashboards", "Class analytics & rankings", "Admin & curriculum management", "Onboarding & training support", "Priority support"], cta: "Contact us", highlight: false },
            ].map((tier) => (
              <div key={tier.name} className={"rounded-2xl border p-8 " + (tier.highlight ? "border-amber-400 bg-slate-900 text-white shadow-xl" : "border-stone-200 bg-white")}>
                {tier.highlight && <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 fb text-xs font-bold text-slate-900">Most popular</span>}
                <h3 className={"mt-4 fd text-xl font-bold " + (tier.highlight ? "text-white" : "text-slate-900")}>{tier.name}</h3>
                <p className={"fd text-3xl font-bold mt-2 " + (tier.highlight ? "text-white" : "text-slate-900")}>{tier.price}<span className={"fb text-sm font-medium " + (tier.highlight ? "text-slate-400" : "text-slate-500")}>{tier.period}</span></p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map(f => <li key={f} className={"flex items-start gap-2 fb text-sm " + (tier.highlight ? "text-slate-200" : "text-slate-700")}><CheckCircle2 className={"mt-0.5 h-4 w-4 flex-none " + (tier.highlight ? "text-amber-400" : "text-emerald-500")} />{f}</li>)}
                </ul>
                <button type="button" className={"mt-8 w-full rounded-full py-3 fd text-sm font-bold transition " + (tier.highlight ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-900 text-white hover:bg-slate-800")}>{tier.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="flex justify-center mb-6"><StudyPilotLogo size={64} priority /></div>
          <h2 className="fd text-3xl font-bold text-white sm:text-4xl">Ready to transform how Nigeria learns?</h2>
          <p className="mt-4 fb text-lg text-slate-300">Free forever. Works in Pidgin. Works without internet.</p>
          <button type="button" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 fd text-base font-bold text-slate-900 hover:bg-amber-300 transition">Create my free account <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
}

/* PRICING PAGE */
function PricingPage() {
  const plans = [
    { name: "Free", price: "₦0", period: "/forever", desc: "Start learning with the essentials.", features: ["AI tutor — 3 lessons/day", "Adaptive quizzes", "English & Pidgin mode", "1 offline subject pack", "Progress dashboard"], cta: "Start free", highlight: false },
    { name: "Pro", price: "₦1,500", period: "/month", desc: "Everything a serious student needs.", features: ["Unlimited AI tutoring", "All offline packs (60+ subjects)", "Voice lessons (TTS)", "Full exam prep for all 6 boards", "Parent progress reports", "Resource generator"], cta: "Go Pro", highlight: true },
    { name: "School", price: "Custom", period: " pricing", desc: "For classrooms, schools and groups.", features: ["Everything in Pro per student", "Teacher classroom dashboards", "Class analytics & rankings", "Admin & curriculum management", "Onboarding & training support", "Priority support"], cta: "Contact us", highlight: false },
  ];

  return (
    <div>
      <section className="bg-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="fb text-sm font-semibold uppercase tracking-wide text-amber-300">Pricing</p>
          <h1 className="mt-4 fd text-4xl font-bold text-white sm:text-5xl">Free to start. Affordable to grow.</h1>
          <p className="mt-4 fb text-lg text-slate-300 max-w-2xl mx-auto">A freemium model for individual students, with school-wide plans for classrooms and administrators.</p>
        </div>
      </section>

      <section className="bg-stone-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((tier) => (
              <div key={tier.name} className={"rounded-2xl border p-8 " + (tier.highlight ? "border-amber-400 bg-slate-900 text-white shadow-xl" : "border-stone-200 bg-white")}>
                {tier.highlight && <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 fb text-xs font-bold text-slate-900">Most popular</span>}
                <h2 className={"mt-4 fd text-xl font-bold " + (tier.highlight ? "text-white" : "text-slate-900")}>{tier.name}</h2>
                <p className={"mt-2 fd text-3xl font-bold " + (tier.highlight ? "text-white" : "text-slate-900")}>{tier.price}<span className={"fb text-sm font-medium " + (tier.highlight ? "text-slate-400" : "text-slate-500")}>{tier.period}</span></p>
                <p className={"mt-2 fb text-sm " + (tier.highlight ? "text-slate-300" : "text-slate-600")}>{tier.desc}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className={"flex items-start gap-2 fb text-sm " + (tier.highlight ? "text-slate-200" : "text-slate-700")}>
                      <CheckCircle2 className={"mt-0.5 h-4 w-4 flex-none " + (tier.highlight ? "text-amber-400" : "text-emerald-500")} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => window.location.href = "/auth"} className={"mt-8 w-full rounded-full py-3 fd text-sm font-bold transition " + (tier.highlight ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-slate-900 text-white hover:bg-slate-800")}>{tier.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ABOUT PAGE */
function AboutPage() {
  return (
    <div>
      {/* Mission Hero */}
      <section className="bg-slate-900 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 fb text-xs font-semibold text-amber-300"><Heart className="h-3.5 w-3.5 mr-1.5" />Our mission</span>
              <h1 className="mt-6 fd text-4xl font-bold text-white sm:text-5xl">Quality education for <span className="text-amber-400">every student</span>, everywhere</h1>
              <p className="mt-6 fb text-lg text-slate-300 leading-relaxed">Too many brilliant students in Nigeria and across Africa are being held back not by lack of intelligence — but by lack of access. Expensive textbooks. No internet. One teacher for 80 students. We built StudyPilot AI to change that.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ val: "60+", label: "Subjects covered", c: "bg-indigo-600" }, { val: "6", label: "Exam boards supported", c: "bg-emerald-600" }, { val: "4", label: "Explanation modes", c: "bg-amber-600" }, { val: "0 MB", label: "Data once offline", c: "bg-rose-600" }].map((s) => (
                <div key={s.label} className={"rounded-2xl p-6 text-white " + s.c}>
                  <p className="fd text-3xl font-bold">{s.val}</p>
                  <p className="mt-1 fb text-sm text-white/80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="fb text-sm font-semibold uppercase tracking-wide text-rose-500">The problem</p>
              <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">Tunde's story — and millions like him</h2>
              <p className="mt-4 fb text-base text-slate-600 leading-relaxed">Tunde is 16. He lives in Birnin Kebbi, Kebbi State. He is one of the smartest students in his class, but his school has one shared computer, one science teacher for three classes, and patchy network.</p>
              <p className="mt-4 fb text-base text-slate-600 leading-relaxed">He wants to pass his WAEC with 8 credits and study Engineering. But he cannot afford extra classes, and the few YouTube videos he finds are in American English — a different world from his textbooks.</p>
              <p className="mt-4 fb text-base text-slate-600 leading-relaxed">StudyPilot AI is built for Tunde. He downloads Biology and Chemistry packs at the cyber cafe on Saturday. He studies all week offline. When a concept does not click in English, he switches to Pidgin. He tracks his WAEC countdown every day.</p>
            </div>
            <div className="space-y-4">
              {[
                { icon: "❌", label: "Without StudyPilot", items: ["One shared computer for 200 students", "English-only explanations", "No internet at home", "No exam-specific practice", "No way to track progress"] },
                { icon: "✅", label: "With StudyPilot", items: ["Full AI tutor on any phone", "Lessons in English and Pidgin", "Offline packs — study anywhere", "WAEC-style mock exams daily", "Personalised revision schedule"] },
              ].map((c) => (
                <div key={c.label} className={"rounded-2xl p-5 " + (c.icon === "❌" ? "bg-rose-50 border border-rose-100" : "bg-emerald-50 border border-emerald-100")}>
                  <p className="fd text-sm font-bold text-slate-900">{c.icon} {c.label}</p>
                  <ul className="mt-3 space-y-1.5">{c.items.map(i => <li key={i} className="fb text-sm text-slate-600">{i}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-indigo-600">Our approach</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">Three principles that guide everything we build</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Zap, c: "text-amber-600 bg-amber-100", title: "AI-native, not AI-wrapped", desc: "StudyPilot does not just put a chatbox on a website. Every workflow — tutoring, quizzes, revision plans, resource generation — is designed around AI from the ground up. The AI adapts to each student." },
              { icon: WifiOff, c: "text-teal-600 bg-teal-100", title: "Offline-first by design", desc: "We optimise for 3G and below. Everything is compressed. Offline packs let students learn without data. We target LCP under 2.5 seconds on a 3G connection and support Opera Mini." },
              { icon: Globe2, c: "text-indigo-600 bg-indigo-100", title: "Culturally grounded", desc: "Pidgin English support is not a gimmick — it is how millions of Nigerian students actually think. Our curriculum maps exactly to the NERDC syllabus. Examples use maize, not maple trees." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl bg-white border border-stone-200 p-6">
                <div className={"flex h-11 w-11 items-center justify-center rounded-xl mb-4 " + p.c}><p.icon className="h-5 w-5" /></div>
                <h3 className="fd text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 fb text-sm leading-relaxed text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-emerald-600">The team</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900 sm:text-4xl">Built by people who love education</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
                <div className={"mx-auto flex h-16 w-16 items-center justify-center rounded-full fd text-xl font-bold text-white " + t.color}>{t.init}</div>
                <h3 className="mt-4 fd text-base font-bold text-slate-900">{t.name}</h3>
                <p className="mt-1 fb text-sm text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & partners */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="fb text-sm font-semibold uppercase tracking-wide text-amber-300">Impact</p>
          <h2 className="mt-3 fd text-3xl font-bold text-white">Built for the next 10 million learners</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[{ val: "10M+", label: "Potential students in Nigeria alone" }, { val: "36", label: "States and FCT covered" }, { val: "₦3B+", label: "Saved vs private tutoring annually" }, { val: "2026", label: "Hackathon launch year" }].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
                <p className="fd text-3xl font-bold text-amber-400">{s.val}</p>
                <p className="mt-1 fb text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 fd text-base font-bold text-slate-900 hover:bg-amber-300">Join us <ArrowRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-7 py-3.5 fd text-base font-bold text-white hover:border-slate-500">Partner with us</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* CONTACT PAGE */
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "Student", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(null);
  function submit() {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(form.subject || "StudyPilot AI contact request");
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nOrganisation: ${form.org || "-"}\nRole: ${form.role}\n\n${form.message}`);
    window.location.href = `mailto:Linkxeetech@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="fd text-4xl font-bold text-white sm:text-5xl">Get in touch</h1>
          <p className="mt-4 fb text-lg text-slate-300 max-w-2xl mx-auto">Whether you are a student, parent, teacher, school administrator or potential partner — we want to hear from you.</p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Form */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8">
              <h2 className="fd text-xl font-bold text-slate-900">Send us a message</h2>
              {sent ? (
                <div className="mt-8 text-center space-y-4">
                  <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"><CheckCircle2 className="h-8 w-8 text-emerald-600" /></div></div>
                  <h3 className="fd text-xl font-bold text-slate-900">Message sent!</h3>
                  <p className="fb text-sm text-slate-500">We will reply to {form.email} within 24 hours.</p>
                  <button type="button" onClick={() => { setSent(false); setForm({ name: "", email: "", org: "", role: "Student", subject: "", message: "" }); }} className="rounded-full border border-stone-200 px-6 py-2.5 fb text-sm font-semibold text-slate-700 hover:bg-stone-50">Send another message</button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Full name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Tunde Adekunle" className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                    <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Email address *</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Organisation (optional)</label><input type="text" value={form.org} onChange={e => setForm(p => ({ ...p, org: e.target.value }))} placeholder="School / company name" className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                    <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">I am a</label>
                      <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        {["Student", "Parent", "Teacher", "School Administrator", "Investor / Partner", "Press / Media", "Other"].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label><input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. School plan enquiry, Bug report, Partnership" className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Message *</label><textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} placeholder="Tell us how we can help..." className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>
                  <button type="button" onClick={submit} disabled={!form.name || !form.email || !form.message} className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 fd text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"><Send className="h-4 w-4" />Send message</button>
                </div>
              )}
            </div>
            {/* Info + School CTA */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-5">
                <h3 className="fd text-base font-bold text-slate-900">Contact information</h3>
                {[{ icon: Mail, label: "Email", val: "Linkxeetech@gmail.com", link: "mailto:Linkxeetech@gmail.com" }, { icon: Phone, label: "WhatsApp", val: "+2347084607844", link: "https://wa.me/2347084607844" }, { icon: MapPin, label: "Headquarters", val: "Abuja, Federal Capital Territory, Nigeria" }, { icon: Clock, label: "Response time", val: "Within 24 hours on business days" }].map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-stone-100 text-slate-500">
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
                      {c.link ? (
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="fb text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-0.5 block">{c.val}</a>
                      ) : (
                        <p className="fb text-sm font-medium text-slate-800 mt-0.5">{c.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-900 p-6 text-white">
                <GraduationCap className="h-8 w-8 text-amber-400" />
                <h3 className="mt-3 fd text-lg font-bold">Is your school interested?</h3>
                <p className="mt-2 fb text-sm text-slate-300 leading-relaxed">We offer custom school plans with teacher classrooms, admin controls, class analytics, and dedicated onboarding support. Get a personalised quote for your school.</p>
                <button type="button" onClick={() => window.location.href = "mailto:Linkxeetech@gmail.com?subject=School%20demo%20request"} className="mt-5 w-full rounded-full bg-amber-400 py-3 fd text-sm font-bold text-slate-900 hover:bg-amber-300 transition">Request school demo</button>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h3 className="fd text-base font-bold text-slate-900 mb-2">Social media</h3>
                <div className="flex gap-3">
                  {[
                    { label: "Twitter / X", href: "https://x.com" },
                    { label: "LinkedIn", href: "https://www.linkedin.com" },
                    { label: "Facebook", href: "https://www.facebook.com" },
                    { label: "Instagram", href: "https://www.instagram.com" },
                  ].map((s) => (
                    <button key={s.label} type="button" title={s.label} onClick={() => window.open(s.href, "_blank", "noopener,noreferrer")} className="rounded-lg border border-stone-200 px-3 py-2 fb text-xs font-semibold text-slate-600 hover:bg-stone-50 transition">{s.label.split(" / ")[0]}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-10">
            <p className="fb text-sm font-semibold uppercase tracking-wide text-emerald-600">FAQ</p>
            <h2 className="mt-3 fd text-3xl font-bold text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                  <span className="fd text-sm font-bold text-slate-900">{f.q}</span>
                  <ChevronDown className={"h-4 w-4 text-slate-400 transition-transform flex-none ml-3 " + (open === i ? "rotate-180" : "")} />
                </button>
                {open === i && <div className="border-t border-stone-100 bg-stone-50/60 px-5 py-4 fb text-sm leading-relaxed text-slate-600">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* PRIVACY PAGE */
function PrivacyPage() {
  return (
    <div>
      <section className="bg-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="fd text-4xl font-bold text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 fb text-lg text-slate-300">Effective Date: June 2026</p>
        </div>
      </section>
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 space-y-8 fb text-slate-700 leading-relaxed">
          <div>
            <h2 className="fd text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us (such as name, email, and grade level) as well as data on your learning progress to personalize your AI tutor experience. For users under 13, we require parent or guardian consent.</p>
          </div>
          <div>
            <h2 className="fd text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Data</h2>
            <p>Your data is strictly used to improve your educational experience. We use AI (via Google Gemini) to generate personalized explanations and quizzes. Student interactions are retained only as long as necessary and are not used for advertising.</p>
          </div>
          <div>
            <h2 className="fd text-2xl font-bold text-slate-900 mb-4">3. GDPR and COPPA Compliance</h2>
            <p>We adhere to GDPR and COPPA guidelines. Parents can request to review, modify, or delete their child's data at any time by contacting us.</p>
          </div>
          <div>
            <h2 className="fd text-2xl font-bold text-slate-900 mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:Linkxeetech@gmail.com" className="text-emerald-600 hover:text-emerald-700">Linkxeetech@gmail.com</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* PUBLIC FOOTER */
function PublicFooter() {
  return (
    <footer className="bg-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 border-b border-slate-800 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3"><StudyPilotLogo size={40} /><div><p className="fd text-base font-bold text-white">StudyPilot AI</p><p className="fb text-xs text-slate-400">Quality education for every student</p></div></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div><p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Product</p><div className="space-y-2">{["Features", "Pricing", "Exam prep", "Offline packs"].map(l => <button key={l} type="button" onClick={() => window.location.href = l === "Pricing" ? "/pricing" : "/features"} className="block fb text-sm text-slate-300 hover:text-white text-left">{l}</button>)}</div></div>
            <div><p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Company</p><div className="space-y-2">{["About", "Contact", "Blog", "Careers"].map(l => <button key={l} type="button" onClick={() => window.location.href = l === "Contact" ? "/contact" : l === "About" ? "/about" : "/contact"} className="block fb text-sm text-slate-300 hover:text-white text-left">{l}</button>)}</div></div>
            <div><p className="fb text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Legal</p><div className="space-y-2">{["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map(l => <button key={l} type="button" onClick={() => window.location.href = l === "Privacy Policy" ? "/privacy" : "/privacy"} className="block fb text-sm text-slate-300 hover:text-white text-left">{l}</button>)}</div></div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between fb text-sm text-slate-400">
          <p>&copy; 2026 StudyPilot AI. Built with love for students across Africa and the world.</p>
          <div className="flex items-center gap-2"><WifiOff className="h-3.5 w-3.5 text-emerald-400" />Offline-ready &middot; <span className="text-amber-400">Pidgin supported</span> &middot; WCAG 2.1 AA</div>
        </div>
      </div>
    </footer>
  );
}

/* ROOT */
export default function PublicPages({ initialPage = "features" }) {
  const [page, setPage] = useState(initialPage);
  return (
    <div className="fb min-h-screen bg-white">
      <style>{FONTS}</style>
      <PublicNav page={page} setPage={setPage} />
      {page === "features" && <FeaturesPage />}
      {page === "pricing" && <PricingPage />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "privacy" && <PrivacyPage />}
      <PublicFooter />
    </div>
  );
}
