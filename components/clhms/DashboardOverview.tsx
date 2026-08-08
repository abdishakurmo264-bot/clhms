"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Cpu,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Send,
  Wrench,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { UserRole, CourseSessionRequest, InstructorProfile, EquipmentTool } from "@/types/clhms";

interface DashboardOverviewProps {
  activeRole: UserRole;
  sessions: CourseSessionRequest[];
  teachers: InstructorProfile[];
  hardware: EquipmentTool[];
  onNavigateTab: (tab: string) => void;
  onOpenAuditModal: () => void;
  onOpenNewCourseModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activeRole,
  sessions,
  teachers,
  hardware,
  onNavigateTab,
  onOpenAuditModal,
  onOpenNewCourseModal,
}) => {
  const pendingSessions = sessions.filter((s) => s.status === "PENDING");
  const inProgressSessions = sessions.filter((s) => s.status === "IN_PROGRESS");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  const operationalHardware = hardware.filter((h) => h.isOperational);
  const maintenanceHardware = hardware.filter((h) => !h.isOperational);

  const availableTeachers = teachers.filter((t) => t.activeLoadCount < 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HERO WELCOME & LIVE ROLE BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kuliyadda IT & Computer Science • Live Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              College Lab & Hardware Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Nidaamka isku xidhka Macalimiinta Maadooyinka (Lecturers), Guddoomiyaha Labs-ka (Lab Head), iyo Macalimiinta Lab-ka (Instructors).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewCourseModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Daabac Fadhi Cusub (Lecturer)</span>
            </button>

            <button
              onClick={onOpenAuditModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Daily Audit Form (Teacher)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Course Requests */}
        <div
          onClick={() => onNavigateTab("lab-head")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-amber-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Codsiyada Cusub (Pending)</span>
            <BookOpen className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingSessions.length}</div>
          <p className="text-xs text-slate-400 mt-1">Fadhiyo u baahan in macallin loo xilsaaro</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
            <span>U wareeji macallin haysta load yar ›</span>
          </div>
        </div>

        {/* Metric 2: In-Progress Active Labs */}
        <div
          onClick={() => onNavigateTab("sessions")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cyan-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Fadhiyada Socda (In-Progress)</span>
            <Layers className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">{inProgressSessions.length}</div>
          <p className="text-xs text-slate-400 mt-1">Kulamada hadda ka socda lab-yada</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
            <span>Eeg xogta fadhiyada & links-kooda ›</span>
          </div>
        </div>

        {/* Metric 3: Available Lab Teachers */}
        <div
          onClick={() => onNavigateTab("teachers")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Macalimiinta Xorta ah (Available)</span>
            <Users className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {availableTeachers.length} <span className="text-sm font-normal text-slate-400">/ {teachers.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Macalimiin haysta culays yar (&lt;3 classes)</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
            <span>Eeg profiles-ka macalimiinta ›</span>
          </div>
        </div>

        {/* Metric 4: Hardware Operational Status */}
        <div
          onClick={() => onNavigateTab("hardware")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-300">Qalabka & Tools-ka</span>
            <Cpu className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{operationalHardware.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Active</span>
            {maintenanceHardware.length > 0 && (
              <span className="text-xs text-rose-400 font-semibold">
                ({maintenanceHardware.length} Dayactir)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Kombuyuutarada, Routers & Tools</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
            <span>Maamul qalabka & categories-ka ›</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN DUAL SECTION (PENDING SESSIONS VS TEACHER LOAD BALANCER) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Recent Lab Session Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <span>Codsiyada Fadhiyada ee Dhawaan la Soo Daabacay</span>
              </h2>
              <p className="text-xs text-slate-400">Lecturers waxay soo gudbiyeen baahida fadhiyadooda</p>
            </div>

            <button
              onClick={() => onNavigateTab("lecturer")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Dhammaan eeg</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{session.courseName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          session.status === "PENDING"
                            ? "bg-amber-950 text-amber-300 border-amber-600/40 animate-pulse"
                            : session.status === "IN_PROGRESS"
                            ? "bg-cyan-950 text-cyan-300 border-cyan-600/40"
                            : "bg-emerald-950 text-emerald-300 border-emerald-600/40"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Lecturer: <strong className="text-slate-200">{session.lecturerName}</strong> • Lab: {session.labRoom}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                    {session.category}
                  </span>
                </div>

                {/* Resource link preview */}
                {session.resourceLink && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Resource Link / Lab Sheet:</span>
                    <a
                      href={session.resourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-cyan-400 hover:underline text-[11px] truncate max-w-xs"
                    >
                      {session.resourceLink}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400">
                  <span>Shift: {session.shift}</span>
                  {session.assignedTeacherName ? (
                    <span className="text-emerald-400 font-medium">
                      Macallinka: {session.assignedTeacherName}
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigateTab("lab-head")}
                      className="text-amber-400 hover:underline font-bold"
                    >
                      + Xilsaar Macallin (Assign Now)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1-Col: Teacher Load Balancer Overview */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Teacher Workload Balance</h3>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">Max 4 Classes</span>
            </div>

            <p className="text-xs text-slate-400">
              Guddoomiyuhu wuxuu si toos ah u arkayaa macallinka haysta culayska ugu yar (Available).
            </p>

            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  onClick={() => onNavigateTab("teachers")}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{teacher.fullName}</div>
                      <div className="text-[10px] text-slate-400">{teacher.category}</div>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs ${
                        teacher.activeLoadCount >= 3
                          ? "text-rose-400"
                          : teacher.activeLoadCount === 2
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {teacher.activeLoadCount} / 4 Load
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        teacher.activeLoadCount >= 3
                          ? "bg-rose-500"
                          : teacher.activeLoadCount === 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(teacher.activeLoadCount / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
