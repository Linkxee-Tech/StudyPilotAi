"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check, X, GraduationCap, Users, BookOpen, ShieldCheck, Wifi, WifiOff, AlertCircle, Mail, Lock, User, Building, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../src/lib/auth-context";
import { StudyPilotLogo } from "../src/components/StudyPilotLogo";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');.fd{font-family:'Lexend',system-ui,sans-serif}.fb{font-family:'Inter',system-ui,sans-serif}`;

const GRADES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const EXAM_BOARDS = ["WAEC", "JAMB", "NECO", "NABTEB", "GCSE", "SAT"];
const STUDY_TIMES = ["Less than 1 hour", "1–2 hours", "2–3 hours", "3–4 hours", "4+ hours"];
const CORE_SUBJECTS = ["English Language", "Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Government", "Geography", "Literature in English", "Financial Accounting", "Civic Education", "Agricultural Science", "Computer Science", "History", "Further Mathematics"];
const ROLES = [
  { key: "student", label: "Student", icon: GraduationCap, desc: "Learn, practise and track your progress", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { key: "parent", label: "Parent / Guardian", icon: Users, desc: "Monitor your child's learning and performance", color: "border-indigo-300 bg-indigo-50 text-indigo-700" },
  { key: "teacher", label: "Teacher", icon: BookOpen, desc: "Manage classrooms and track student progress", color: "border-amber-300 bg-amber-50 text-amber-700" },
  { key: "admin", label: "Administrator", icon: ShieldCheck, desc: "Manage the platform, users and curriculum", color: "border-rose-300 bg-rose-50 text-rose-700" },
];

function Card({ children, className = "" }) {
  return <div className={"rounded-2xl border border-stone-200 bg-white shadow-sm " + className}>{children}</div>;
}

function Btn({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  const base = "flex items-center justify-center gap-2 rounded-full px-6 py-3 fb text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ";
  const styles = { primary: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-amber-400", secondary: "border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 focus-visible:outline-emerald-500", google: "border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 shadow-sm" };
  return <button type={type} onClick={onClick} disabled={disabled} className={base + (styles[variant] || styles.primary) + " " + className}>{children}</button>;
}

function Input({ label, type = "text", value, onChange, placeholder, icon: Icon, error, hint }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="space-y-1">
      {label && <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input type={isPass && show ? "text" : type} value={value} onChange={onChange} placeholder={placeholder}
          className={"h-12 w-full rounded-xl border px-4 fb text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition " + (Icon ? "pl-10 " : "") + (error ? "border-rose-400 bg-rose-50" : "border-stone-200 bg-white")} />
        {isPass && <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </div>
      {error && <p className="fb text-xs text-rose-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
      {hint && !error && <p className="fb text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/* STAGES */
function LoginPage({ goTo }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !pass) { setErr("Please fill in all fields."); return; }
    setLoading(true); setErr("");
    const res = await login(email, pass);
    if (!res.ok) {
      setErr(res.error || "Login failed.");
      setLoading(false);
    } else {
      window.location.href = "/student"; // Redirect on success
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4"><StudyPilotLogo size={64} priority /></div>
          <h1 className="fd text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 fb text-sm text-slate-500">Sign in to your StudyPilot AI account</p>
        </div>
        <Card className="p-6 space-y-4">
          {err && <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 fb text-sm text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4 flex-none" />{err}</div>}
          <Input label="Email address" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="you@example.com" icon={Mail} />
          <Input label="Password" type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} placeholder="Enter your password" icon={Lock} />
          <div className="flex justify-end"><button type="button" onClick={() => goTo("forgot")} className="fb text-xs font-semibold text-emerald-600 hover:text-emerald-700">Forgot password?</button></div>
          <Btn onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            {!loading && <ChevronRight className="h-4 w-4" />}
          </Btn>
          <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-stone-200" /><span className="fb text-xs text-slate-400">or</span><div className="flex-1 h-px bg-stone-200" /></div>
          <Btn variant="google" onClick={() => window.location.href = "/api/auth/google"} className="w-full">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </Btn>
        </Card>
        <p className="text-center fb text-sm text-slate-500">New to StudyPilot? <button type="button" onClick={() => goTo("signup")} className="font-semibold text-emerald-600 hover:text-emerald-700">Create a free account</button></p>
        <p className="text-center fb text-xs text-slate-400">Works offline · Pidgin English · 60+ subjects</p>
      </div>
    </div>
  );
}

function SignupPage({ goTo, signupData, updateData }) {
  const [form, setForm] = useState({ name: signupData.name || "", email: signupData.email || "", pass: signupData.pass || "", confirm: signupData.confirm || "" });
  const [err, setErr] = useState({});
  function handleSubmit() {
    const e = {};
    if (!form.name) e.name = "Full name is required.";
    if (!form.email) e.email = "Email is required.";
    if (form.pass.length < 8) e.pass = "Password must be at least 8 characters.";
    if (form.pass !== form.confirm) e.confirm = "Passwords do not match.";
    if (Object.keys(e).length) { setErr(e); return; }
    updateData({ name: form.name, email: form.email, pass: form.pass, confirm: form.confirm });
    goTo("role");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4"><StudyPilotLogo size={64} priority /></div>
          <h1 className="fd text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 fb text-sm text-slate-500">Free forever. No card required.</p>
        </div>
        <Card className="p-6 space-y-4">
          <Input label="Full name" value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErr(p => ({ ...p, name: "" })); }} placeholder="Tunde Adekunle" icon={User} error={err.name} />
          <Input label="Email address" type="email" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErr(p => ({ ...p, email: "" })); }} placeholder="you@example.com" icon={Mail} error={err.email} />
          <Input label="Password" type="password" value={form.pass} onChange={e => { setForm(p => ({ ...p, pass: e.target.value })); setErr(p => ({ ...p, pass: "" })); }} placeholder="At least 8 characters" icon={Lock} error={err.pass} hint={!err.pass ? "Use a mix of letters and numbers" : ""} />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={e => { setForm(p => ({ ...p, confirm: e.target.value })); setErr(p => ({ ...p, confirm: "" })); }} placeholder="Repeat your password" icon={Lock} error={err.confirm} />
          <Btn onClick={handleSubmit} className="w-full">Continue <ChevronRight className="h-4 w-4" /></Btn>
          <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-stone-200" /><span className="fb text-xs text-slate-400">or</span><div className="flex-1 h-px bg-stone-200" /></div>
          <Btn variant="google" className="w-full"><svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>Sign up with Google</Btn>
          <p className="fb text-xs text-slate-400 text-center">By signing up you agree to our <span className="text-emerald-600 underline cursor-pointer">Terms</span> and <span className="text-emerald-600 underline cursor-pointer">Privacy Policy</span></p>
        </Card>
        <p className="text-center fb text-sm text-slate-500">Already have an account? <button type="button" onClick={() => goTo("login")} className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</button></p>
      </div>
    </div>
  );
}

function RolePage({ goTo, signupData, updateData }) {
  const [role, setRole] = useState(signupData.role || null);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4"><StudyPilotLogo size={56} priority /></div>
          <h1 className="fd text-2xl font-bold text-slate-900">I am a...</h1>
          <p className="mt-1 fb text-sm text-slate-500">Choose your role to personalise your experience</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <button key={r.key} type="button" onClick={() => setRole(r.key)}
              className={"rounded-2xl border-2 p-5 text-left transition " + (role === r.key ? r.color + " shadow-md" : "border-stone-200 bg-white hover:border-stone-300")}>
              <div className="flex items-start gap-3">
                <div className={"flex h-10 w-10 flex-none items-center justify-center rounded-xl " + (role === r.key ? r.color.split(" ").slice(1).join(" ") : "bg-stone-100 text-slate-500")}><r.icon className="h-5 w-5" /></div>
                <div className="min-w-0"><p className="fd text-sm font-bold text-slate-900">{r.label}</p><p className="fb text-xs text-slate-500 mt-0.5">{r.desc}</p></div>
                {role === r.key && <div className="flex-none ml-auto"><Check className="h-5 w-5 text-emerald-500" /></div>}
              </div>
            </button>
          ))}
        </div>
        <Btn onClick={() => { updateData({ role }); if (role === "student") goTo("grade"); else if (role) goTo("complete"); }} disabled={!role} className="w-full">
          Continue <ChevronRight className="h-4 w-4" />
        </Btn>
      </div>
    </div>
  );
}

function OnboardingShell({ step, total, title, subtitle, children, onNext, onBack, nextLabel = "Continue", nextDisabled = false }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><StudyPilotLogo size={32} /><span className="fd text-sm font-bold text-slate-900">StudyPilot <span className="text-amber-500">AI</span></span></div>
            <span className="fb text-xs text-slate-400">Step {step} of {total}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-stone-200"><div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: ((step / total) * 100) + "%" }} /></div>
        </div>
        <div><h2 className="fd text-xl font-bold text-slate-900">{title}</h2><p className="mt-1 fb text-sm text-slate-500">{subtitle}</p></div>
        <Card className="p-6">{children}</Card>
        <div className="flex gap-3">
          {onBack && <Btn variant="secondary" onClick={onBack} className="flex-none"><ChevronLeft className="h-4 w-4" />Back</Btn>}
          <Btn onClick={onNext} disabled={nextDisabled} className="flex-1">{nextLabel} <ChevronRight className="h-4 w-4" /></Btn>
        </div>
      </div>
    </div>
  );
}

function GradePage({ goTo, signupData, updateData }) {
  const [grade, setGrade] = useState(signupData.grade || null);
  return (
    <OnboardingShell step={1} total={4} title="What class are you in?" subtitle="We will personalise your subjects and exam prep." onBack={() => goTo("role")} onNext={() => { updateData({ grade }); goTo("subjects"); }} nextDisabled={!grade}>
      <div className="grid grid-cols-3 gap-3">
        {GRADES.map((g) => (
          <button key={g} type="button" onClick={() => setGrade(g)} className={"rounded-xl border-2 py-4 fd text-base font-bold transition " + (grade === g ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-200 bg-white text-slate-700 hover:border-stone-300")}>{g}</button>
        ))}
      </div>
    </OnboardingShell>
  );
}

function SubjectsPage({ goTo, signupData, updateData }) {
  const [subs, setSubs] = useState(signupData.subs || ["Mathematics", "English Language", "Biology"]);
  function toggle(s) { setSubs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); }
  return (
    <OnboardingShell step={2} total={4} title="Which subjects are you studying?" subtitle={"Select all that apply. You can change this later."} onBack={() => goTo("grade")} onNext={() => { updateData({ subs }); goTo("exam"); }} nextDisabled={subs.length === 0}>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {CORE_SUBJECTS.map((s) => {
          const on = subs.includes(s);
          return (
            <button key={s} type="button" onClick={() => toggle(s)} className={"flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition " + (on ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300")}>
              <div className={"flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 " + (on ? "border-emerald-500 bg-emerald-500" : "border-stone-300")}>{on && <Check className="h-3 w-3 text-white" />}</div>
              <span className="fb text-sm font-medium text-slate-800">{s}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 fb text-xs text-slate-400">{subs.length} subject{subs.length !== 1 ? "s" : ""} selected</p>
    </OnboardingShell>
  );
}

function ExamPage({ goTo, signupData, updateData }) {
  const [exams, setExams] = useState(signupData.exams || ["WAEC"]);
  function toggle(e) { setExams(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]); }
  return (
    <OnboardingShell step={3} total={4} title="Which exams are you preparing for?" subtitle="We will generate past-question style practice and revision plans." onBack={() => goTo("subjects")} onNext={() => { updateData({ exams }); goTo("time"); }} nextDisabled={exams.length === 0}>
      <div className="grid gap-3 sm:grid-cols-2">
        {EXAM_BOARDS.map((e) => {
          const on = exams.includes(e);
          return (
            <button key={e} type="button" onClick={() => toggle(e)} className={"flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition " + (on ? "border-indigo-400 bg-indigo-50" : "border-stone-200 bg-white hover:border-stone-300")}>
              <div className={"flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 " + (on ? "border-indigo-500 bg-indigo-500" : "border-stone-300")}>{on && <Check className="h-3 w-3 text-white" />}</div>
              <span className="fd text-sm font-bold text-slate-800">{e}</span>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}

function TimePage({ goTo, signupData, updateData }) {
  const [time, setTime] = useState(signupData.time || "1–2 hours");
  return (
    <OnboardingShell step={4} total={4} title="How long can you study each day?" subtitle="We will build a personalised daily study schedule for you." onBack={() => goTo("exam")} onNext={() => { updateData({ time }); goTo("consent"); }} nextLabel="Finish setup">
      <div className="space-y-2">
        {STUDY_TIMES.map((t) => (
          <button key={t} type="button" onClick={() => setTime(t)} className={"flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition " + (time === t ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300")}>
            <div className="flex items-center gap-3"><Clock className={"h-4 w-4 " + (time === t ? "text-emerald-500" : "text-slate-400")} /><span className="fb text-sm font-medium text-slate-800">{t}</span></div>
            {time === t && <Check className="h-4 w-4 text-emerald-500" />}
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}

function ConsentPage({ goTo, signupData, updateData }) {
  const [parentEmail, setParentEmail] = useState(signupData.parentEmail || "");
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><div className="flex justify-center mb-4"><StudyPilotLogo size={56} priority /></div><h1 className="fd text-2xl font-bold text-slate-900">Parent / Guardian consent</h1><p className="mt-1 fb text-sm text-slate-500">Because you are under 13, we need a parent or guardian to approve your account.</p></div>
        <Card className="p-6 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 fb text-sm text-amber-800">StudyPilot AI protects children's privacy (COPPA & GDPR-aligned). We will email your parent for approval before activating your account.</div>
          <Input label="Parent / Guardian email" type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="parent@example.com" icon={Mail} hint="We will send an approval link to this address." />
          <div className="flex items-start gap-3">
            <button type="button" onClick={() => setAgreed(v => !v)} className={"flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 mt-0.5 " + (agreed ? "border-emerald-500 bg-emerald-500" : "border-stone-300")}>{agreed && <Check className="h-3 w-3 text-white" />}</button>
            <p className="fb text-sm text-slate-600">I confirm that I have permission from my parent or guardian to create this account.</p>
          </div>
          <Btn onClick={() => { updateData({ parentEmail }); goTo("complete"); }} disabled={!parentEmail || !agreed} className="w-full">Send approval request <ChevronRight className="h-4 w-4" /></Btn>
          <button type="button" onClick={() => goTo("complete")} className="w-full text-center fb text-sm text-slate-400 hover:text-slate-600">I am 13 or older — skip this step</button>
        </Card>
      </div>
    </div>
  );
}

function CompletePage({ goTo, signupData }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleComplete() {
    setLoading(true); setErr("");
    const roleKey = signupData.role ? signupData.role.toUpperCase() : "STUDENT";
    // Build payload — only include defined optional fields to avoid Zod errors
    const payload = {
      email: signupData.email,
      password: signupData.pass,
      name: signupData.name,
      role: roleKey,
    };
    if (signupData.grade) payload.gradeLevel = signupData.grade;
    if (signupData.exams && signupData.exams.length > 0) payload.examBoards = signupData.exams;
    if (signupData.parentEmail) payload.parentEmail = signupData.parentEmail;
    const res = await register(payload);
    if (!res.ok) {
      setErr(res.error || "Registration failed.");
      setLoading(false);
    } else {
      // Route to correct dashboard based on role
      const dest = roleKey === "PARENT" ? "/parent" : roleKey === "TEACHER" ? "/teacher" : roleKey === "ADMIN" ? "/admin" : "/student";
      window.location.href = dest;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-4"><StudyPilotLogo size={80} priority /></div>
        <div className="space-y-2">
          <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"><Check className="h-8 w-8 text-emerald-600" /></div></div>
          <h1 className="fd text-2xl font-bold text-slate-900">You are all set!</h1>
          <p className="fb text-sm text-slate-500">Your StudyPilot AI account is ready. Time to start learning.</p>
        </div>
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[{ val: "60+", label: "Subjects" }, { val: "6", label: "Exam boards" }, { val: "0 MB", label: "Data needed offline" }].map((s) => (
              <div key={s.label}><p className="fd text-2xl font-bold text-slate-900">{s.val}</p><p className="fb text-xs text-slate-500">{s.label}</p></div>
            ))}
          </div>
          {err && <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 fb text-sm text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4 flex-none" />{err}</div>}
          <Btn className="w-full" disabled={loading} onClick={handleComplete}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go to my dashboard"} 
            {!loading && <ChevronRight className="h-4 w-4" />}
          </Btn>
          <p className="fb text-xs text-slate-400">Download offline packs on your first session for uninterrupted learning</p>
        </Card>
        <div className="flex items-center justify-center gap-2 fb text-xs text-slate-400"><Wifi className="h-3.5 w-3.5 text-emerald-500" />Works offline · <span className="text-amber-600 font-semibold">Pidgin mode</span> available · WCAG 2.1 AA</div>
      </div>
    </div>
  );
}

function ForgotPasswordPage({ goTo }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><div className="flex justify-center mb-4"><StudyPilotLogo size={56} priority /></div><h1 className="fd text-2xl font-bold text-slate-900">{sent ? "Check your email" : "Reset your password"}</h1><p className="mt-1 fb text-sm text-slate-500">{sent ? "We sent a reset link to " + email : "Enter your account email and we will send you a reset link."}</p></div>
        {!sent ? (
          <Card className="p-6 space-y-4">
            <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={Mail} />
            <Btn onClick={() => setSent(true)} disabled={!email} className="w-full">Send reset link</Btn>
          </Card>
        ) : (
          <Card className="p-6 space-y-4 text-center">
            <div className="flex justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"><Mail className="h-7 w-7 text-emerald-600" /></div></div>
            <p className="fb text-sm text-slate-600">Check your inbox and click the link within 15 minutes.</p>
            <Btn variant="secondary" className="w-full" onClick={() => setSent(false)}>Resend email</Btn>
          </Card>
        )}
        <p className="text-center fb text-sm text-slate-500"><button type="button" onClick={() => goTo("login")} className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mx-auto"><ChevronLeft className="h-3.5 w-3.5" />Back to sign in</button></p>
      </div>
    </div>
  );
}

/* ROOT */
export default function StudyPilotAuth() {
  const [stage, setStage] = useState("login");
  const [signupData, setSignupData] = useState({});
  const goTo = (s) => setStage(s);
  const updateData = (d) => setSignupData(p => ({ ...p, ...d }));

  return (
    <div className="fb">
      <style>{FONTS}</style>
      {stage === "login" && <LoginPage goTo={goTo} />}
      {stage === "signup" && <SignupPage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "role" && <RolePage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "grade" && <GradePage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "subjects" && <SubjectsPage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "exam" && <ExamPage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "time" && <TimePage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "consent" && <ConsentPage goTo={goTo} signupData={signupData} updateData={updateData} />}
      {stage === "complete" && <CompletePage goTo={goTo} signupData={signupData} />}
      {stage === "forgot" && <ForgotPasswordPage goTo={goTo} />}
    </div>
  );
}
