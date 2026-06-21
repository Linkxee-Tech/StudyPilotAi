"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, BookOpen, BarChart3, Settings, Bell, ChevronRight, CheckCircle2, AlertTriangle, Flame, Star, Trophy, TrendingUp, Plus, Search, Filter, MoreVertical, Wifi, WifiOff, Mail, Phone, MapPin, Clock, Target, Zap, GraduationCap, Shield, Eye, Trash2, Edit3, Download, RefreshCw, Check, X, UserPlus, BookMarked, ClipboardList } from "lucide-react";
import { StudyPilotLogo } from "../src/components/StudyPilotLogo";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');.fd{font-family:'Lexend',system-ui,sans-serif}.fb{font-family:'Inter',system-ui,sans-serif}`;

const PARENT_CHILDREN = [{ name: "Tunde Adekunle", grade: "SS2", school: "Birnin Kebbi High School", avatar: "T" }, { name: "Kemi Adekunle", grade: "JSS3", school: "Birnin Kebbi High School", avatar: "K" }];
const PARENT_SUBJECTS = [{ sub: "Mathematics", s: 88, delta: +4 }, { sub: "Biology", s: 82, delta: +7 }, { sub: "English Language", s: 70, delta: -2 }, { sub: "Chemistry", s: 64, delta: +3 }, { sub: "Government", s: 55, delta: -5 }, { sub: "Physics", s: 41, delta: +9 }];
const PARENT_ACTIVITY = [{ day: "Mon", min: 25 }, { day: "Tue", min: 40 }, { day: "Wed", min: 15 }, { day: "Thu", min: 55 }, { day: "Fri", min: 30 }, { day: "Sat", min: 70 }, { day: "Sun", min: 45 }];
const PARENT_FEED = [{ time: "2h ago", text: "Completed Biology — Photosynthesis (80%)" }, { time: "Yesterday", text: "Earned '7-Day Streak' badge" }, { time: "Yesterday", text: "Quiz: Mathematics — Quadratic Equations (70%)" }, { time: "2 days ago", text: "Downloaded WAEC Mock Pack 2026" }, { time: "3 days ago", text: "Started Government — Legislature lesson" }];
const TEACHER_STUDENTS = [
  { name: "Amaka Okonkwo", avg: 85, streak: 18, status: "Active", grade: "SS2" },
  { name: "Tunde Adekunle", avg: 76, streak: 12, status: "Active", grade: "SS2" },
  { name: "Chisom Ezeh", avg: 71, streak: 9, status: "Active", grade: "SS2" },
  { name: "Fatima Musa", avg: 68, streak: 14, status: "Active", grade: "SS2" },
  { name: "Emeka Ibe", avg: 62, streak: 7, status: "Active", grade: "SS2" },
  { name: "Ngozi Okafor", avg: 59, streak: 3, status: "Inactive", grade: "SS2" },
  { name: "Abdul Yusuf", avg: 55, streak: 0, status: "Inactive", grade: "SS2" },
  { name: "Blessing Eze", avg: 48, streak: 1, status: "At risk", grade: "SS2" },
];
const TEACHER_PERF = [{ sub: "Math", avg: 75 }, { sub: "Bio", avg: 68 }, { sub: "Chem", avg: 61 }, { sub: "Phy", avg: 54 }, { sub: "Gov", avg: 63 }, { sub: "Eng", avg: 72 }];
const ADMIN_GROWTH = [{ mo: "Jan", u: 1200 }, { mo: "Feb", u: 1800 }, { mo: "Mar", u: 2400 }, { mo: "Apr", u: 3100 }, { mo: "May", u: 4200 }, { mo: "Jun", u: 5800 }];
const ADMIN_SUBJECTS = [{ sub: "Biology", sessions: 4820 }, { sub: "Math", sessions: 4650 }, { sub: "Chemistry", sessions: 3980 }, { sub: "Physics", sessions: 3210 }, { sub: "English", sessions: 2940 }, { sub: "Gov", sessions: 2100 }];
const ADMIN_USERS = [
  { name: "Tunde Adekunle", email: "tunde@example.com", role: "Student", status: "Active", joined: "Jun 1, 2026" },
  { name: "Mrs. Adekunle", email: "mrs.adekunle@example.com", role: "Parent", status: "Active", joined: "Jun 1, 2026" },
  { name: "Mr. Okoye", email: "okoye@bkhigh.edu.ng", role: "Teacher", status: "Active", joined: "May 15, 2026" },
  { name: "Amaka Okonkwo", email: "amaka@example.com", role: "Student", status: "Active", joined: "May 28, 2026" },
  { name: "Ngozi Okafor", email: "ngozi@example.com", role: "Student", status: "Inactive", joined: "May 20, 2026" },
  { name: "Dr. Eze", email: "eze@admin.sp.ai", role: "Admin", status: "Active", joined: "Jan 1, 2026" },
];
const MODERATION = [
  { type: "Inappropriate content", user: "Unknown student", subject: "Chemistry", time: "1h ago", action: "Auto-filtered" },
  { type: "Off-topic question", user: "Emeka Ibe", subject: "Biology", time: "3h ago", action: "Flagged" },
  { type: "Spam prompt detected", user: "Unknown student", subject: "English", time: "5h ago", action: "Blocked" },
];

function Bdg({ ch, cls = "" }) { return <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 fb text-xs font-semibold " + cls}>{ch}</span>; }

function DashHeader({ logo, title, subtitle, role, tabs, activeTab, setTab }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3"><StudyPilotLogo size={32} /><div><p className="fd text-sm font-bold text-slate-900">{title}</p><p className="fb text-xs text-slate-400">{subtitle}</p></div></div>
        <div className="flex items-center gap-2">
          <Bdg ch={role} cls="bg-indigo-100 text-indigo-700" />
          <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-stone-100"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" /></button>
        </div>
      </div>
      {tabs && <div className="flex gap-6 px-4 fb text-sm font-semibold sm:px-6">{tabs.map((t) => <button key={t.key} type="button" onClick={() => setTab(t.key)} className={"border-b-2 py-3 transition " + (activeTab === t.key ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500")}>{t.label}</button>)}</div>}
    </header>
  );
}

/* ═══════════════ PARENT DASHBOARD ═══════════════ */
function ParentDashboard() {
  const [child, setChild] = useState(0);
  const [notifs, setNotifs] = useState({ daily: true, weekly: true, weakAlert: true });
  const c = PARENT_CHILDREN[child];
  return (
    <div className="min-h-screen bg-stone-50">
      <DashHeader title="Parent Portal" subtitle="StudyPilot AI" role="Parent" />
      <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-5xl mx-auto">
        {/* Child selector */}
        <section>
          <h2 className="fd text-lg font-bold text-slate-900">Your children</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {PARENT_CHILDREN.map((ch, i) => (
              <button key={ch.name} type="button" onClick={() => setChild(i)} className={"flex items-center gap-3 rounded-2xl border-2 bg-white p-4 transition flex-none " + (child === i ? "border-emerald-500 shadow-sm" : "border-stone-200 hover:border-stone-300")}>
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-amber-400 fd text-sm font-bold text-slate-900">{ch.avatar}</div>
                <div className="text-left"><p className="fb text-sm font-semibold text-slate-900">{ch.name}</p><p className="fb text-xs text-slate-400">{ch.grade}</p></div>
                {child === i && <Check className="h-4 w-4 text-emerald-500 ml-2" />}
              </button>
            ))}
          </div>
        </section>
        {/* Stats */}
        <section>
          <div className="flex items-center justify-between"><h2 className="fd text-lg font-bold text-slate-900">{c.name}</h2><Bdg ch={c.grade + " · " + c.school.split(" ")[0]} cls="bg-stone-100 text-slate-600" /></div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ icon: Flame, label: "Day streak", value: "12", c: "text-orange-500 bg-orange-100" }, { icon: Trophy, label: "Quiz avg", value: "76%", c: "text-emerald-500 bg-emerald-100" }, { icon: Clock, label: "Study time/wk", value: "4h 50m", c: "text-indigo-500 bg-indigo-100" }, { icon: BookOpen, label: "Active subjects", value: "5", c: "text-amber-500 bg-amber-100" }].map((s) => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4"><div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div><p className="mt-3 fd text-xl font-bold text-slate-900">{s.value}</p><p className="fb text-xs text-slate-500">{s.label}</p></div>
            ))}
          </div>
        </section>
        {/* Study time chart */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="fd text-base font-bold text-slate-900">Study time this week (minutes)</h3>
          <div className="mt-4" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PARENT_ACTIVITY} barSize={24}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Bar dataKey="min" fill="#10b981" radius={[6, 6, 0, 0]} name="Minutes" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Subject performance */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="fd text-base font-bold text-slate-900">Subject performance</h3>
          <div className="mt-4 space-y-3">
            {PARENT_SUBJECTS.map((m) => {
              const bc = m.s >= 75 ? "bg-emerald-500" : m.s >= 50 ? "bg-amber-400" : "bg-rose-400";
              const dc = m.delta > 0 ? "text-emerald-600" : "text-rose-600";
              return (
                <div key={m.sub}><div className="flex items-center justify-between mb-1"><span className="fb text-sm text-slate-700">{m.sub}</span><div className="flex items-center gap-2"><span className={"fb text-xs font-semibold " + dc}>{m.delta > 0 ? "+" : ""}{m.delta}%</span><span className="fd text-sm font-bold text-slate-900">{m.s}%</span></div></div><div className="h-2 w-full rounded-full bg-stone-100"><div className={"h-2 rounded-full " + bc} style={{ width: m.s + "%" }} /></div></div>
              );
            })}
          </div>
        </div>
        {/* Weak areas */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Areas needing attention</h3><Bdg ch="AI insights" cls="bg-indigo-100 text-indigo-700" /></div>
          <div className="mt-4 space-y-2">
            {[{ sub: "Physics", issue: "Scored 41% — consistently below target", pri: "High" }, { sub: "Government", issue: "Score dropped 5% this week", pri: "Medium" }, { sub: "English Language", issue: "Minor regression — needs encouragement", pri: "Low" }].map((w) => (
              <div key={w.sub} className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                <AlertTriangle className={"h-4 w-4 flex-none mt-0.5 " + (w.pri === "High" ? "text-rose-500" : w.pri === "Medium" ? "text-amber-500" : "text-slate-400")} />
                <div className="flex-1"><p className="fb text-sm font-semibold text-slate-800">{w.sub}</p><p className="fb text-xs text-slate-500">{w.issue}</p></div>
                <Bdg ch={w.pri} cls={w.pri === "High" ? "bg-rose-100 text-rose-700" : w.pri === "Medium" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-slate-600"} />
              </div>
            ))}
          </div>
        </div>
        {/* Activity feed */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="fd text-base font-bold text-slate-900">Recent activity</h3>
          <div className="mt-4 space-y-3">
            {PARENT_FEED.map((f, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2 flex-none" />
                <div className="flex-1"><p className="fb text-sm text-slate-700">{f.text}</p><p className="fb text-xs text-slate-400">{f.time}</p></div>
              </div>
            ))}
          </div>
        </div>
        {/* Notifications */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
          <h3 className="fd text-base font-bold text-slate-900">Report preferences</h3>
          {[{ k: "daily", l: "Daily study summaries", d: "Receive a brief summary each evening" }, { k: "weekly", l: "Weekly performance report", d: "Full report every Sunday morning" }, { k: "weakAlert", l: "Weak area alerts", d: "Immediate alert when a subject drops below 50%" }].map((n) => (
            <div key={n.k} className="flex items-center justify-between">
              <div><p className="fb text-sm font-semibold text-slate-800">{n.l}</p><p className="fb text-xs text-slate-500">{n.d}</p></div>
              <button type="button" onClick={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))} role="switch" aria-checked={notifs[n.k]} className={"relative inline-flex h-6 w-11 items-center rounded-full transition " + (notifs[n.k] ? "bg-emerald-500" : "bg-stone-300")}><span className={"inline-block h-4 w-4 rounded-full bg-white shadow transition-transform " + (notifs[n.k] ? "translate-x-6" : "translate-x-1")} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white py-4 fb text-sm font-semibold text-slate-700 hover:bg-stone-50"><Download className="h-4 w-4" />Download full report (PDF)</button>
      </div>
    </div>
  );
}

/* ═══════════════ TEACHER DASHBOARD ═══════════════ */
function TeacherDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [search, setSrch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assigningGoal, setAssigningGoal] = useState(false);
  
  const filtered = TEACHER_STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen bg-stone-50">
      <DashHeader title="Teacher Portal" subtitle="SS2 Sciences · 8 students" role="Teacher" tabs={[{ key: "dashboard", label: "Dashboard" }, { key: "classroom", label: "Classroom" }, { key: "goals", label: "Learning Goals" }]} activeTab={tab} setTab={setTab} />
      {tab === "dashboard" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ icon: Users, label: "Students", value: "28", c: "text-indigo-500 bg-indigo-100" }, { icon: Target, label: "Class avg", value: "68%", c: "text-emerald-500 bg-emerald-100" }, { icon: BookOpen, label: "Lessons assigned", value: "12", c: "text-amber-500 bg-amber-100" }, { icon: CheckCircle2, label: "Completion rate", value: "74%", c: "text-rose-500 bg-rose-100" }].map(s => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4"><div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div><p className="mt-3 fd text-xl font-bold text-slate-900">{s.value}</p><p className="fb text-xs text-slate-500">{s.label}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="fd text-base font-bold text-slate-900">Class performance by subject</h3>
            <div className="mt-4" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TEACHER_PERF} barSize={28}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="sub" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} name="Class avg %" /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="fd text-base font-bold text-slate-900">Student rankings</h3>
              <button type="button" onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 fb text-xs font-semibold text-white hover:bg-slate-800"><UserPlus className="h-3.5 w-3.5" />Invite student</button>
            </div>
            <div className="relative mb-3"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={e => setSrch(e.target.value)} placeholder="Search students..." className="h-10 w-full rounded-full border border-stone-200 pl-10 pr-4 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div className="space-y-2">
              {filtered.map((s, i) => (
                <div key={s.name} onClick={() => setSelectedStudent(s)} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-white px-4 py-3 cursor-pointer hover:border-emerald-300 transition">
                  <span className={"flex h-7 w-7 flex-none items-center justify-center rounded-full fd text-sm font-bold " + (i === 0 ? "bg-amber-400 text-slate-900" : i === 1 ? "bg-slate-200 text-slate-700" : i === 2 ? "bg-orange-200 text-orange-800" : "bg-stone-100 text-slate-500")}>{i + 1}</span>
                  <div className="flex-1 min-w-0"><p className="fb text-sm font-medium text-slate-800 truncate">{s.name}</p><p className="fb text-xs text-slate-400">{s.grade}</p></div>
                  <div className="flex items-center gap-3">
                    <Bdg ch={s.status} cls={s.status === "Active" ? "bg-emerald-100 text-emerald-700" : s.status === "At risk" ? "bg-rose-100 text-rose-700" : "bg-stone-100 text-slate-500"} />
                    <span className="fd text-sm font-bold text-slate-900 w-10 text-right">{s.avg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showInvite && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between"><h3 className="fd text-lg font-bold text-slate-900">Invite a student</h3><button type="button" onClick={() => setShowInvite(false)}><X className="h-5 w-5 text-slate-400" /></button></div>
                <div className="space-y-3">
                  <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Student email</label><input type="email" placeholder="student@school.edu.ng" className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Classroom</label><select className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"><option>SS2 Sciences</option><option>SS1 Sciences</option></select></div>
                </div>
                <div className="flex gap-3"><button type="button" onClick={() => setShowInvite(false)} className="flex-1 rounded-full border border-stone-200 py-2.5 fb text-sm font-semibold text-slate-700">Cancel</button><button type="button" onClick={() => setShowInvite(false)} className="flex-1 rounded-full bg-slate-900 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800">Send invite</button></div>
              </div>
            </div>
          )}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between">
                  <h3 className="fd text-lg font-bold text-slate-900">Student Profile</h3>
                  <button type="button" onClick={() => setSelectedStudent(null)}>
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 fd text-base font-bold">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h4 className="fd text-base font-bold text-slate-800">{selectedStudent.name}</h4>
                    <p className="fb text-xs text-slate-400">{selectedStudent.grade} Sciences · Birnin Kebbi</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/50">
                    <p className="fb text-xs text-slate-400">Class Average</p>
                    <p className="fd text-lg font-extrabold text-slate-800 mt-1">{selectedStudent.avg}%</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/50">
                    <p className="fb text-xs text-slate-400">Learning Streak</p>
                    <p className="fd text-lg font-extrabold text-orange-500 mt-1">{selectedStudent.streak} Days</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="fd text-sm font-bold text-slate-800">Subject Performance</h5>
                  <div className="space-y-2 text-xs">
                    {[{ sub: "Mathematics", score: selectedStudent.avg + 4 }, { sub: "Biology", score: selectedStudent.avg - 2 }, { sub: "Chemistry", score: selectedStudent.avg - 6 }].map((sp) => (
                      <div key={sp.sub}>
                        <div className="flex justify-between mb-1">
                          <span className="fb text-slate-600">{sp.sub}</span>
                          <span className="font-semibold text-slate-900">{sp.score}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-stone-100">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: sp.score + "%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAssigningGoal(true)}
                    className="flex-1 rounded-full bg-slate-900 py-2.5 fb text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Assign Special Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="flex-1 rounded-full border border-stone-200 py-2.5 fb text-xs font-semibold text-slate-600 hover:bg-stone-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {assigningGoal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="fd text-base font-bold text-slate-900">Assign Learning Goal</h3>
                  <button type="button" onClick={() => setAssigningGoal(false)}>
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Target Student</label>
                    <input
                      type="text"
                      disabled
                      value={selectedStudent ? selectedStudent.name : "All Students"}
                      className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm bg-stone-50 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label>
                    <select className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Biology</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Learning Goal / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Complete Cell Division quiz with 80%+"
                      className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAssigningGoal(false)}
                    className="flex-1 rounded-full border border-stone-200 py-2 fb text-xs font-semibold text-slate-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssigningGoal(false);
                      setSelectedStudent(null);
                    }}
                    className="flex-1 rounded-full bg-emerald-600 py-2 fb text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Assign Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {tab === "classroom" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <h3 className="fd text-base font-bold text-slate-900">My classrooms</h3>
            {[{ name: "SS2 Sciences", students: 28, avg: 68, code: "SP-SS2SC" }, { name: "SS1 Sciences", students: 22, avg: 61, code: "SP-SS1SC" }].map(c => (
              <div key={c.name} className="flex items-center gap-4 rounded-xl border border-stone-200 p-4">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-indigo-100 text-indigo-600"><BookOpen className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0"><p className="fb text-sm font-semibold text-slate-900">{c.name}</p><p className="fb text-xs text-slate-400">{c.students} students · Avg: {c.avg}%</p></div>
                <Bdg ch={"Code: " + c.code} cls="bg-stone-100 text-slate-600 font-mono" />
              </div>
            ))}
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 py-4 fb text-sm font-semibold text-slate-500 hover:bg-stone-50"><Plus className="h-4 w-4" />Create new classroom</button>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Assign learning content</h3><Bdg ch="AI-suggested" cls="bg-indigo-100 text-indigo-700" /></div>
            <div className="space-y-2">
              {[{ sub: "Biology", topic: "Cell Division", due: "Jun 20" }, { sub: "Chemistry", topic: "Chemical Bonding", due: "Jun 22" }, { sub: "Physics", topic: "Waves & Sound", due: "Jun 25" }].map(a => (
                <div key={a.topic} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3">
                  <div className="flex-1"><p className="fb text-sm font-medium text-slate-800">{a.sub} — {a.topic}</p><p className="fb text-xs text-slate-400">Due: {a.due}</p></div>
                  <button type="button" className="rounded-full bg-slate-900 px-3 py-1.5 fb text-xs font-semibold text-white hover:bg-slate-800">Assign</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "goals" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Active learning goals</h3><button type="button" className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 fb text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" />New goal</button></div>
            {[{ goal: "Complete WAEC Biology syllabus", progress: 68, due: "Jul 31", assigned: "All students" }, { goal: "Score 70%+ in weekly Physics quiz", progress: 45, due: "Ongoing", assigned: "All students" }, { goal: "Revise Periodic Table (Chemistry)", progress: 82, due: "Jun 20", assigned: "At-risk group" }].map(g => (
              <div key={g.goal} className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-3"><p className="fb text-sm font-semibold text-slate-800">{g.goal}</p><Bdg ch={g.assigned} cls="bg-stone-100 text-slate-600 flex-none" /></div>
                <div className="mt-2 h-2 w-full rounded-full bg-stone-100"><div className={"h-2 rounded-full " + (g.progress >= 70 ? "bg-emerald-500" : g.progress >= 40 ? "bg-amber-400" : "bg-rose-400")} style={{ width: g.progress + "%" }} /></div>
                <div className="mt-1 flex justify-between fb text-xs text-slate-400"><span>{g.progress}% complete</span><span>Due: {g.due}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ ADMIN DASHBOARD ═══════════════ */
function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [search, setSrch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const ROLES_F = ["All", "Student", "Teacher", "Parent", "Admin"];
  const filtered = ADMIN_USERS.filter(u => (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) && (roleFilter === "All" || u.role === roleFilter));
  return (
    <div className="min-h-screen bg-stone-50">
      <DashHeader title="Admin Panel" subtitle="StudyPilot AI Platform" role="Admin" tabs={[{ key: "dashboard", label: "Dashboard" }, { key: "users", label: "User Management" }, { key: "moderation", label: "Moderation" }, { key: "analytics", label: "Analytics" }, { key: "curriculum", label: "Curriculum" }, { key: "config", label: "Configuration" }]} activeTab={tab} setTab={setTab} />
      {tab === "dashboard" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ icon: Users, label: "Total users", value: "5,842", delta: "+138 today", c: "text-indigo-500 bg-indigo-100" }, { icon: Zap, label: "Daily active", value: "2,341", delta: "+12%", c: "text-emerald-500 bg-emerald-100" }, { icon: BookOpen, label: "Sessions today", value: "8,920", delta: "+5%", c: "text-amber-500 bg-amber-100" }, { icon: Target, label: "Avg quiz score", value: "72%", delta: "+2pts", c: "text-rose-500 bg-rose-100" }].map(s => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4"><div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div><p className="mt-3 fd text-xl font-bold text-slate-900">{s.value}</p><p className="fb text-xs text-slate-500">{s.label}</p><p className="mt-1 fb text-xs text-emerald-600">{s.delta}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="fd text-base font-bold text-slate-900">User growth (Jan–Jun 2026)</h3>
            <div className="mt-4" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADMIN_GROWTH}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="mo" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Line type="monotone" dataKey="u" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} name="Users" /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Students", value: "5,182", pct: "89%", c: "text-emerald-600 bg-emerald-100" }, { label: "Teachers", value: "487", pct: "8%", c: "text-indigo-600 bg-indigo-100" }, { label: "Parents", value: "173", pct: "3%", c: "text-amber-600 bg-amber-100" }].map(r => (
              <div key={r.label} className="rounded-2xl border border-stone-200 bg-white p-5"><div className={"inline-flex rounded-full px-3 py-1 fb text-xs font-semibold " + r.c}>{r.label}</div><p className="mt-3 fd text-3xl font-bold text-slate-900">{r.value}</p><p className="fb text-xs text-slate-400">{r.pct} of total users</p></div>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="fd text-base font-bold text-slate-900">Top subjects by sessions</h3>
            <div className="mt-4" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADMIN_SUBJECTS} barSize={28} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} /><XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="sub" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={55} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Bar dataKey="sessions" fill="#10b981" radius={[0, 6, 6, 0]} name="Sessions" /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      {tab === "users" && (
        <div className="p-4 pb-12 space-y-5 sm:p-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={e => setSrch(e.target.value)} placeholder="Search by name or email..." className="h-10 w-full rounded-full border border-stone-200 pl-10 pr-4 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div className="flex gap-2 overflow-x-auto">{ROLES_F.map(r => <button key={r} type="button" onClick={() => setRoleFilter(r)} className={"rounded-full border px-3 py-2 fb text-xs font-semibold transition " + (roleFilter === r ? "border-slate-900 bg-slate-900 text-white" : "border-stone-200 text-slate-600 hover:bg-stone-50")}>{r}</button>)}</div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>{["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left fb text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map(u => (
                    <tr key={u.email} className="hover:bg-stone-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-200 fd text-xs font-bold text-slate-700">{u.name[0]}</div><span className="fb text-sm font-medium text-slate-800">{u.name}</span></div></td>
                      <td className="px-4 py-3 fb text-sm text-slate-500">{u.email}</td>
                      <td className="px-4 py-3"><Bdg ch={u.role} cls={u.role === "Student" ? "bg-emerald-100 text-emerald-700" : u.role === "Teacher" ? "bg-amber-100 text-amber-700" : u.role === "Admin" ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"} /></td>
                      <td className="px-4 py-3"><Bdg ch={u.status} cls={u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-slate-500"} /></td>
                      <td className="px-4 py-3 fb text-sm text-slate-500">{u.joined}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><button type="button" title="View" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-stone-100 hover:text-slate-700"><Eye className="h-4 w-4" /></button><button type="button" title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-stone-100 hover:text-slate-700"><Edit3 className="h-4 w-4" /></button><button type="button" title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">
              <p className="fb text-sm text-slate-500">Showing {filtered.length} of {ADMIN_USERS.length} users</p>
              <div className="flex items-center gap-2"><button type="button" className="rounded-lg border border-stone-200 px-3 py-1.5 fb text-xs font-semibold text-slate-600 hover:bg-stone-50">Previous</button><button type="button" className="rounded-lg border border-stone-200 px-3 py-1.5 fb text-xs font-semibold text-slate-600 hover:bg-stone-50">Next</button></div>
            </div>
          </div>
        </div>
      )}
      {tab === "moderation" && (
        <div className="p-4 pb-12 space-y-5 sm:p-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between"><h3 className="fd text-base font-bold text-slate-900">Content moderation queue</h3><Bdg ch="3 items" cls="bg-rose-100 text-rose-700" /></div>
            <div className="space-y-3">
              {MODERATION.map((m, i) => (
                <div key={i} className="rounded-xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="fb text-sm font-semibold text-slate-800">{m.type}</p><p className="fb text-xs text-slate-500">{m.user} · {m.subject} · {m.time}</p></div>
                    <Bdg ch={m.action} cls={m.action === "Blocked" ? "bg-rose-100 text-rose-700" : m.action === "Flagged" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"} />
                  </div>
                  <div className="mt-3 flex gap-2"><button type="button" className="rounded-full border border-stone-200 px-3 py-1.5 fb text-xs font-semibold text-slate-600 hover:bg-stone-50">Review content</button><button type="button" className="rounded-full bg-emerald-500 px-3 py-1.5 fb text-xs font-semibold text-white hover:bg-emerald-600">Approve</button><button type="button" className="rounded-full bg-rose-500 px-3 py-1.5 fb text-xs font-semibold text-white hover:bg-rose-600">Remove</button></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
            <h3 className="fd text-base font-bold text-slate-900">Safety configuration</h3>
            {[{ label: "Gemini safety filters", val: "Maximum (ON)", c: "bg-emerald-100 text-emerald-700" }, { label: "Profanity post-filter", val: "Enabled", c: "bg-emerald-100 text-emerald-700" }, { label: "Under-13 content guard", val: "Strict mode", c: "bg-emerald-100 text-emerald-700" }, { label: "Rate limiting", val: "100 prompts/user/day", c: "bg-indigo-100 text-indigo-700" }].map(s => (
              <div key={s.label} className="flex items-center justify-between"><p className="fb text-sm text-slate-700">{s.label}</p><Bdg ch={s.val} cls={s.c} /></div>
            ))}
          </div>
        </div>
      )}
      {tab === "analytics" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ label: "Total sessions", value: "128,450", c: "text-indigo-500 bg-indigo-100", icon: BarChart3 }, { label: "Avg session length", value: "24 min", c: "text-emerald-500 bg-emerald-100", icon: Clock }, { label: "Offline pack downloads", value: "12,840", c: "text-amber-500 bg-amber-100", icon: Download }, { label: "AI prompts (month)", value: "891K", c: "text-rose-500 bg-rose-100", icon: Zap }].map(s => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4"><div className={"flex h-9 w-9 items-center justify-center rounded-lg " + s.c}><s.icon className="h-4 w-4" /></div><p className="mt-3 fd text-xl font-bold text-slate-900">{s.value}</p><p className="fb text-xs text-slate-500">{s.label}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="fd text-base font-bold text-slate-900">Monthly active users</h3>
            <div className="mt-4" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADMIN_GROWTH}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="mo" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} /><Line type="monotone" dataKey="u" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} name="Users" /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2">
              <h3 className="fd text-base font-bold text-slate-900">Top states (Nigeria)</h3>
              {[{ state: "Lagos", pct: 18 }, { state: "FCT Abuja", pct: 12 }, { state: "Kano", pct: 9 }, { state: "Rivers", pct: 8 }, { state: "Oyo", pct: 7 }].map(s => (
                <div key={s.state}><div className="flex justify-between fb text-sm"><span className="text-slate-700">{s.state}</span><span className="font-semibold text-slate-900">{s.pct}%</span></div><div className="mt-1 h-1.5 w-full rounded-full bg-stone-100"><div className="h-1.5 rounded-full bg-indigo-400" style={{ width: s.pct + "%" }} /></div></div>
              ))}
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
              <h3 className="fd text-base font-bold text-slate-900">AI usage breakdown</h3>
              {[{ label: "AI tutor explanations", val: "52%", c: "bg-indigo-400" }, { label: "Quiz generation", val: "28%", c: "bg-emerald-400" }, { label: "Homework assistant", val: "12%", c: "bg-amber-400" }, { label: "Resource generation", val: "8%", c: "bg-rose-400" }].map(a => (
                <div key={a.label}><div className="flex justify-between fb text-sm"><span className="text-slate-700">{a.label}</span><span className="font-semibold text-slate-900">{a.val}</span></div><div className="mt-1 h-1.5 w-full rounded-full bg-stone-100"><div className={"h-1.5 rounded-full " + a.c} style={{ width: a.val }} /></div></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "curriculum" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h3 className="fd text-lg font-bold text-slate-900">Curriculum & Subjects</h3>
              <button type="button" className="rounded-full bg-slate-900 px-4 py-2 fb text-xs font-semibold text-white hover:bg-slate-800">Add Subject</button>
            </div>
            <div className="space-y-3 mt-4">
              {[{ sub: "Mathematics", level: "SS1-SS3", type: "Core", topics: 48 }, { sub: "Biology", level: "SS1-SS3", type: "Elective (Sciences)", topics: 34 }, { sub: "GSM Phone Repairs", level: "SS1-SS3", type: "Trade/Vocational", topics: 14 }, { sub: "Basic Science", level: "JSS1-JSS3", type: "Core", topics: 24 }].map(s => (
                <div key={s.sub} className="flex justify-between items-center p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div>
                    <p className="fb text-sm font-semibold text-slate-800">{s.sub}</p>
                    <p className="fb text-xs text-slate-400">{s.level} · {s.type}</p>
                  </div>
                  <span className="fb text-xs bg-stone-100 text-slate-700 font-semibold px-3 py-1 rounded-full">{s.topics} Topics</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "config" && (
        <div className="p-4 pb-12 space-y-6 sm:p-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
            <h3 className="fd text-lg font-bold text-slate-900 border-b border-stone-100 pb-4">Platform Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Gemini Model Version</label>
                <select className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Gemini 1.5 Flash (Default)</option>
                  <option>Gemini 1.5 Pro</option>
                  <option>Gemini 2.0 Experimental</option>
                </select>
              </div>
              <div>
                <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Content Moderation Sensitivity</label>
                <select className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>High (Strict safety filters)</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="fb text-xs font-semibold uppercase tracking-wide text-slate-500">Rate Limiting (Prompts/User/Day)</label>
                <input type="number" defaultValue={50} className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 fb text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button type="button" className="rounded-full bg-slate-900 px-6 py-2.5 fb text-sm font-semibold text-white hover:bg-slate-800">Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ROOT — Role switcher for demo */
export default function RoleDashboards({ initialRole = "parent" }) {
  const [role, setRole] = useState(initialRole);
  return (
    <div className="fb">
      <style>{FONTS}</style>
      <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center gap-2 border-t border-stone-200 bg-white px-4 py-3 lg:hidden">
        <p className="fb text-xs text-slate-400 self-center">View as:</p>
        {[{ k: "parent", l: "Parent" }, { k: "teacher", l: "Teacher" }, { k: "admin", l: "Admin" }].map(r => (
          <button key={r.k} type="button" onClick={() => setRole(r.k)} className={"rounded-full border px-4 py-2 fb text-xs font-semibold transition " + (role === r.k ? "border-slate-900 bg-slate-900 text-white" : "border-stone-200 text-slate-600")}>{r.l}</button>
        ))}
      </div>
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center gap-3 border-r border-stone-200 bg-white pt-4 z-50">
        <StudyPilotLogo size={36} priority />
        <div className="flex flex-col gap-2 mt-4">
          {[{ k: "parent", l: "Parent", icon: Users }, { k: "teacher", l: "Teacher", icon: BookOpen }, { k: "admin", l: "Admin", icon: Shield }].map(r => (
            <button key={r.k} type="button" onClick={() => setRole(r.k)} className={"flex flex-col items-center gap-1 rounded-xl p-2 transition " + (role === r.k ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-stone-100 hover:text-slate-700")}>
              <r.icon className="h-5 w-5" /><span className="fb text-[10px] font-semibold">{r.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:ml-20 pb-20 lg:pb-0">
        {role === "parent" && <ParentDashboard />}
        {role === "teacher" && <TeacherDashboard />}
        {role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}
