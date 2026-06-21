"use client";

import { useState } from 'react';
import {
  Sparkles, ArrowRight, WifiOff, BookOpen, GraduationCap, Mic, Brain,
  Languages, BarChart3, Download, Globe2, CheckCircle2, X, Quote,
  Trophy, Users2,
} from 'lucide-react';
import { StudyPilotLogo } from "../src/components/StudyPilotLogo";

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
  .font-display { font-family: 'Lexend', system-ui, sans-serif; }
  .font-body { font-family: 'Inter', system-ui, sans-serif; }
`;

const lessonContent = {
  english: {
    label: 'English',
    text: 'Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to make their own food, releasing oxygen as a by-product.',
  },
  pidgin: {
    label: 'Pidgin',
    text: 'Photosynthesis na how green plant dey use sunlight, water and carbon dioxide make their own food — and as dem dey do am, oxygen go come out.',
  },
};

const FEATURES = [
  {
    icon: Brain,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'AI Tutor Engine',
    desc: 'Every topic explained three ways — beginner, standard, advanced — with examples and real-life analogies, until it clicks.',
  },
  {
    icon: BarChart3,
    color: 'bg-amber-100 text-amber-600',
    title: 'Adaptive Quizzes',
    desc: 'Quizzes that get harder or easier based on what a student actually knows, with instant feedback on every answer.',
  },
  {
    icon: Languages,
    color: 'bg-rose-100 text-rose-600',
    title: 'Pidgin Mode',
    desc: 'Any lesson, mid-explanation, switches into Naija Pidgin with one tap — for the moment a concept just isn\u2019t landing.',
  },
  {
    icon: Mic,
    color: 'bg-indigo-100 text-indigo-600',
    title: 'Voice Lessons',
    desc: 'Lessons, summaries and quiz questions read aloud, so students can learn while doing chores or on the go.',
  },
  {
    icon: WifiOff,
    color: 'bg-teal-100 text-teal-600',
    title: 'Offline Packs',
    desc: 'Download a subject or exam pack on Wi-Fi once, then read, quiz and revise all week without spending data.',
  },
  {
    icon: GraduationCap,
    color: 'bg-orange-100 text-orange-600',
    title: 'Exam Prep',
    desc: 'Timed mock exams, past-question style practice and revision plans for WAEC, JAMB, NECO, NABTEB, GCSE and SAT.',
  },
];

const SUBJECT_GROUPS = [
  { label: 'Core', subjects: ['English Language', 'Mathematics', 'Basic Science', 'Civic Education'] },
  { label: 'Sciences', subjects: ['Biology', 'Chemistry', 'Physics', 'Agricultural Science'] },
  { label: 'Arts & Commercial', subjects: ['Government', 'Economics', 'Literature in English', 'Financial Accounting'] },
  { label: 'Trade & Vocational', subjects: ['Catering Craft Practice', 'GSM Phone Repairs', 'Solar Installation', 'Auto Mechanics'] },
];

const STEPS = [
  { n: '01', title: 'Pick your subjects & exam', desc: 'Choose your class level — JSS1 to SS3 — and the exam you\u2019re preparing for: WAEC, JAMB, NECO, NABTEB, GCSE or SAT.' },
  { n: '02', title: 'AI tutor teaches at your pace', desc: 'Get lessons in plain English or Pidgin, at beginner, standard or advanced depth — repeat any part as many times as you need.' },
  { n: '03', title: 'Practice with adaptive quizzes', desc: 'Multiple choice, fill-in-the-blank, short answer and more, auto-marked with explanations for every question.' },
  { n: '04', title: 'Track progress & revise smart', desc: 'StudyPilot spots your weak topics and builds a revision plan and countdown for exam day.' },
];

const EXAMS = ['WAEC', 'JAMB', 'NECO', 'NABTEB', 'GCSE', 'SAT'];

const PRICING = [
  {
    name: 'Free',
    price: '\u20a60',
    period: '/forever',
    desc: 'Everything a student needs to start learning today.',
    features: ['AI tutor — 3 lessons a day', 'Adaptive quizzes', 'English & Pidgin mode', '1 offline subject pack'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '\u20a61,500',
    period: '/month',
    desc: 'Unlimited tutoring and full exam prep for one student.',
    features: ['Unlimited AI tutor & quizzes', 'All offline packs', 'Voice lessons (TTS)', 'Full exam mode + revision plans', 'Progress reports for parents'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    name: 'School',
    price: 'Custom',
    period: ' pricing',
    desc: 'Classroom tools for teachers and school administrators.',
    features: ['Everything in Pro, per student', 'Teacher & classroom dashboards', 'Class analytics & rankings', 'Admin & curriculum controls', 'Onboarding support'],
    cta: 'Talk to us',
    highlight: false,
  },
];

function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function LessonCard({ mode, setMode, content }) {
  return (
    <div className="relative">
      <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-3xl border-2 border-dashed border-slate-700 sm:block" aria-hidden="true" />
      <div className="relative rounded-3xl bg-white p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">Biology · SS2 · Topic</p>
            <h3 className="font-display text-xl font-bold text-slate-900">Photosynthesis</h3>
          </div>
          <div role="group" aria-label="Explanation language" className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
            <button
              type="button"
              aria-pressed={mode === 'english'}
              onClick={() => setMode('english')}
              className={`rounded-full px-3 py-2 font-body text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${mode === 'english' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
            >
              English
            </button>
            <button
              type="button"
              aria-pressed={mode === 'pidgin'}
              onClick={() => setMode('pidgin')}
              className={`rounded-full px-3 py-2 font-body text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${mode === 'pidgin' ? 'bg-amber-400 text-slate-900' : 'text-slate-500'}`}
            >
              Pidgin
            </button>
          </div>
        </div>
        <p key={mode} className="mt-4 min-h-[120px] font-body text-base leading-relaxed text-slate-700">
          {content.text}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-body text-xs font-medium text-slate-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
              <Brain className="h-4 w-4 text-emerald-600" />
            </div>
            StudyPilot Tutor
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-2 font-body text-xs font-semibold text-slate-600 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <Mic className="h-3.5 w-3.5" /> Listen
          </button>
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const NAV_LINKS = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
          <StudyPilotLogo size={36} priority />
          <span className="font-display text-lg font-bold text-white">
            StudyPilot <span className="text-amber-400">AI</span>
          </span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 font-body text-sm font-medium text-slate-300 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="transition hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.location.href = '/auth'} className="hidden font-body text-sm font-semibold text-slate-300 transition hover:text-white sm:inline-block">
            Log in
          </button>
          <button type="button" onClick={() => window.location.href = '/auth'} className="rounded-full bg-amber-400 px-5 py-2.5 font-body text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">
            Get started free
          </button>
          {/* Mobile hamburger */}
          <button type="button" onClick={() => setMobileOpen(v => !v)} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 md:hidden" aria-label="Open menu">
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-slate-300" />
              <span className="block h-0.5 w-5 bg-slate-300" />
              <span className="block h-0.5 w-5 bg-slate-300" />
            </div>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-900 px-6 py-4 md:hidden">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="flex w-full items-center justify-between py-3 font-body text-sm font-medium text-slate-300 border-b border-slate-800 last:border-0 hover:text-white">
              {label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" onClick={() => window.location.href = '/auth'} className="w-full rounded-full border border-slate-600 py-2.5 font-body text-sm font-semibold text-slate-300 hover:bg-slate-800">Log in</button>
            <button type="button" onClick={() => window.location.href = '/auth'} className="w-full rounded-full bg-amber-400 py-2.5 font-body text-sm font-semibold text-slate-900 hover:bg-amber-300">Get started free</button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const [mode, setMode] = useState('english');
  const content = lessonContent[mode];

  return (
    <section className="bg-slate-900 pb-20 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Badge className="border border-slate-700 bg-slate-800/60 text-amber-300">
            <Globe2 className="h-3.5 w-3.5" />
            Built for students across Africa — online or off
          </Badge>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            One AI tutor.
            <br />
            Every subject.
            <br />
            <span className="text-amber-400">E sabi Pidgin too.</span>
          </h1>
          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-slate-300">
            StudyPilot explains every topic until it clicks, builds quizzes around your weak spots, and keeps working when your data runs out.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => window.location.href = '/auth'} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-body text-base font-semibold text-slate-900 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">
              Start learning free <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => window.location.href = '/auth'} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-7 py-3.5 font-body text-base font-semibold text-white transition hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400">
              For schools & teachers
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-body text-sm text-slate-400">
            <span className="flex items-center gap-2"><WifiOff className="h-4 w-4 text-emerald-400" /> Works without internet</span>
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-400" /> 60+ subjects, JSS\u2013SSS</span>
            <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-emerald-400" /> 6 exam boards</span>
          </div>
        </div>
        <LessonCard mode={mode} setMode={setMode} content={content} />
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: '3', label: 'explanation levels per topic' },
    { value: '2', label: 'languages: English & Pidgin' },
    { value: '6', label: 'exam boards supported' },
    { value: '0', label: 'data needed once downloaded' },
  ];
  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{s.value}</p>
            <p className="mt-1 font-body text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, color, title, desc }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-emerald-600">What\u2019s inside</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">A full learning system, not a chatbot</h2>
          <p className="mt-4 font-body text-lg text-slate-600">
            Six tools work together so a student never has to leave the app to understand a topic, practice it, and get ready for the exam.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function Subjects() {
  return (
    <section id="subjects" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-amber-600">Curriculum</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">Covers the Nigerian secondary curriculum, end to end</h2>
            <p className="mt-4 font-body text-lg text-slate-600">
              From JSS1 core subjects to SS3 trade and vocational options — over 60 subjects in total, organised by level and category.
            </p>
          </div>
          <Badge className="self-start bg-amber-100 text-amber-700 sm:self-auto">
            <BookOpen className="h-3.5 w-3.5" /> JSS1 \u2013 SS3
          </Badge>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECT_GROUPS.map((group) => (
            <div key={group.label} className="rounded-2xl border border-stone-200 p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slate-400">{group.label}</h3>
              <ul className="mt-4 space-y-3">
                {group.subjects.map((s) => (
                  <li key={s} className="font-body text-sm text-slate-700">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 font-body text-sm text-slate-500">
          ...plus 45+ more subjects, including Computer Science, Marketing, History, French, and a full range of technical and vocational trades.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-emerald-600">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">From first lesson to exam day</h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step) => (
            <div key={step.n} className="relative rounded-2xl bg-white p-6">
              <p className="font-display text-sm font-bold text-amber-500">{step.n}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExamPrep() {
  return (
    <section id="exams" className="bg-slate-900 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Badge className="border border-slate-700 bg-slate-800/60 text-amber-300">
            <GraduationCap className="h-3.5 w-3.5" /> Exam mode
          </Badge>
          <h2 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">Built around the exams that actually matter</h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-slate-300">
            Timed mock exams, past-question style assessments, and a revision plan that targets exactly the topics a student keeps getting wrong.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {EXAMS.map((e) => (
              <span key={e} className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 font-body text-sm font-semibold text-slate-200">{e}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-400">WAEC \u2014 Biology Mock</p>
              <h3 className="font-display text-xl font-bold text-slate-900">42 days to go</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { topic: 'Photosynthesis', status: 'Mastered', color: 'text-emerald-600 bg-emerald-100' },
              { topic: 'Cell division', status: 'Needs revision', color: 'text-amber-700 bg-amber-100' },
              { topic: 'Genetics & inheritance', status: 'Needs revision', color: 'text-amber-700 bg-amber-100' },
              { topic: 'Ecology', status: 'Not started', color: 'text-slate-500 bg-stone-100' },
            ].map((row) => (
              <div key={row.topic} className="flex items-center justify-between rounded-xl border border-stone-100 px-4 py-3">
                <span className="font-body text-sm font-medium text-slate-700">{row.topic}</span>
                <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${row.color}`}>{row.status}</span>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 w-full rounded-full bg-slate-900 py-3 font-body text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            Start today\u2019s revision plan
          </button>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  const before = ['No internet at home', 'One textbook shared by 6 students', 'Lessons only in English'];
  const after = ['Lessons downloaded at school, studied at home', 'A full AI tutor on one phone', 'Pidgin mode when English explanations don\u2019t land'];
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-rose-500">Real-world impact</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">Tunde, SS2, Birnin Kebbi</h2>
            <div className="mt-6 flex gap-3 rounded-2xl bg-stone-50 p-5">
              <Quote className="h-5 w-5 flex-none text-stone-300" />
              <p className="font-body text-base leading-relaxed text-slate-700">
                Tunde\u2019s school has one shared computer and patchy network. He downloads a Chemistry pack whenever he gets Wi-Fi at the cyber caf\u00e9, then studies all week offline — switching to Pidgin mode whenever an explanation does not click in English.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 p-6">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-slate-400">
                <X className="h-4 w-4 text-rose-400" /> Before
              </h3>
              <ul className="mt-4 space-y-3">
                {before.map((b) => <li key={b} className="font-body text-sm text-slate-600">{b}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> With StudyPilot
              </h3>
              <ul className="mt-4 space-y-3">
                {after.map((a) => <li key={a} className="font-body text-sm text-slate-700">{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-emerald-600">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">Free to start. Affordable to keep.</h2>
          <p className="mt-4 font-body text-lg text-slate-600">A freemium model for individual students, with school-wide plans for classrooms and administrators.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING.map((tier) => (
            <div key={tier.name} className={`rounded-2xl border p-8 ${tier.highlight ? 'border-amber-400 bg-slate-900 text-white shadow-xl' : 'border-stone-200 bg-white'}`}>
              {tier.highlight && (
                <Badge className="bg-amber-400 text-slate-900">Most popular</Badge>
              )}
              <h3 className={`mt-4 font-display text-xl font-bold ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
              <p className={`mt-3 font-display text-3xl font-bold ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                {tier.price}<span className={`font-body text-sm font-medium ${tier.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{tier.period}</span>
              </p>
              <p className={`mt-2 font-body text-sm ${tier.highlight ? 'text-slate-300' : 'text-slate-600'}`}>{tier.desc}</p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 font-body text-sm ${tier.highlight ? 'text-slate-200' : 'text-slate-700'}`}>
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-none ${tier.highlight ? 'text-amber-400' : 'text-emerald-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => window.location.href = '/auth'}
                className={`mt-8 w-full rounded-full py-3 font-body text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tier.highlight ? 'bg-amber-400 text-slate-900 hover:bg-amber-300 focus-visible:outline-amber-200' : 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-400'}`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Ready to start learning?</h2>
        <p className="mt-4 font-body text-lg text-slate-600">It\u2019s free, it works in Pidgin, and it works offline. No card needed.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => window.location.href = '/auth'} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 font-body text-base font-semibold text-slate-900 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">
            Create my free account <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => window.location.href = '/auth'} className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-8 py-3.5 font-body text-base font-semibold text-slate-700 transition hover:border-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
            <Users2 className="h-4 w-4" /> Set up a classroom
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const badges = [
    { icon: WifiOff, label: 'Offline-ready' },
    { icon: Languages, label: 'Pidgin supported' },
    { icon: Mic, label: 'Voice lessons' },
    { icon: CheckCircle2, label: 'WCAG 2.1 AA' },
  ];
  const FOOTER_LINKS = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
  ];
  return (
    <footer className="bg-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <StudyPilotLogo size={36} />
            <span className="font-display text-lg font-bold text-white">
              StudyPilot <span className="text-amber-400">AI</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <Badge key={b.label} className="border border-slate-700 bg-slate-800/60 text-slate-300">
                <b.icon className="h-3.5 w-3.5" /> {b.label}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 border-b border-slate-800 pb-8 sm:grid-cols-4">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Platform</p>
            <div className="space-y-2">
              {FOOTER_LINKS.slice(0, 3).map(({ label, href }) => (
                <a key={label} href={href} className="block font-body text-sm text-slate-400 hover:text-white transition">{label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Support</p>
            <div className="space-y-2">
              <a href="/contact" className="block font-body text-sm text-slate-400 hover:text-white transition">Contact us</a>
              <a href="mailto:Linkxeetech@gmail.com" className="block font-body text-sm text-slate-400 hover:text-white transition">Email support</a>
              <a href="https://wa.me/2347084607844" target="_blank" rel="noopener noreferrer" className="block font-body text-sm text-slate-400 hover:text-white transition">WhatsApp</a>
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Legal</p>
            <div className="space-y-2">
              <a href="/privacy" className="block font-body text-sm text-slate-400 hover:text-white transition">Privacy Policy</a>
              <a href="/privacy" className="block font-body text-sm text-slate-400 hover:text-white transition">Terms of Service</a>
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Exams</p>
            <div className="space-y-2">
              {['WAEC', 'JAMB', 'NECO', 'NABTEB', 'GCSE', 'SAT'].map(e => (
                <a key={e} href="/auth" className="block font-body text-sm text-slate-400 hover:text-white transition">{e} Prep</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 font-body text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudyPilot AI · Linkxee Tech · Abuja, Nigeria</p>
          <div className="flex gap-5">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="transition hover:text-white">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function StudyPilotLanding() {
  return (
    <div id="top" className="font-body">
      <style>{fontStyles}</style>
      <Nav />
      <Hero />
      <StatsStrip />
      <Features />
      <Subjects />
      <HowItWorks />
      <ExamPrep />
      <Impact />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
