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
  Layers,
  ArrowRight,
  TrendingUp,
  Shield,
  UserCheck,
  Link2,
  ExternalLink,
} from "lucide-react";
import {
  UserAccount,
  LabCourseRequest,
  HardwareToolItem,
  CampusAnnouncement,
} from "@/types/kaabe";

interface DashboardViewProps {
  currentUser: UserAccount;
  sessions: LabCourseRequest[];
  teachers: UserAccount[];
  hardware: HardwareToolItem[];
  announcements: CampusAnnouncement[];
  onNavigate: (viewName: string) => void;
  onOpenAuditModal: () => void;
  onOpenNewLabModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  sessions,
  teachers,
  hardware,
  announcements,
  onNavigate,
  onOpenAuditModal,
  onOpenNewLabModal,
}) => {
  const pendingSessions = sessions.filter((s) => s.status === "PENDING");
  const inProgressSessions = sessions.filter((s) => s.status === "IN_PROGRESS");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  const operationalHardware = hardware.filter((h) => h.status === "OPERATIONAL");
  const maintenanceHardware = hardware.filter((h) => h.status !== "OPERATIONAL");

  const availableTeachers = teachers.filter((t) => (t.activeLoadCount || 0) < 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kaabe Academic & Lab Portal • Live Operational System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Role: <strong className="text-cyan-300">{currentUser.role.replace("_", " ")}</strong> • Department: {currentUser.department} • Active Shift: {currentUser.shift}
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentUser.role === "SUBJECT_TEACHER" && (
              <button
                onClick={onOpenNewLabModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Publish New Lab Class</span>
              </button>
            )}

            {currentUser.role === "LAB_TEACHER" && (
              <button
                onClick={onOpenAuditModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Launch Daily Audit Form</span>
              </button>
            )}

            {currentUser.role === "LAB_CHAIRMAN" && (
              <button
                onClick={() => onNavigate("assignments")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-950/60 flex items-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>Assign Lab Teachers ({pendingSessions.length} Pending)</span>
              </button>
            )}

            {currentUser.role === "SUPER_ADMIN" && (
              <button
                onClick={() => onNavigate("users")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/60 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>Manage Staff Users</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Tile 1 */}
        <div
          onClick={() => onNavigate("requests")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Course Requests</span>
            <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingSessions.length}</div>
          <p className="text-slate-400 text-[11px] mt-1">Awaiting instructor assignment</p>
        </div>

        {/* Tile 2 */}
        <div
          onClick={() => onNavigate("my-labs")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Active Labs In-Progress</span>
            <Layers className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">{inProgressSessions.length}</div>
          <p className="text-slate-400 text-[11px] mt-1">Currently running in campus rooms</p>
        </div>

        {/* Tile 3 */}
        <div
          onClick={() => onNavigate("hardware")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Hardware Operational Health</span>
            <Cpu className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{operationalHardware.length}</span>
            <span className="text-emerald-400 font-bold text-xs">Active</span>
            {maintenanceHardware.length > 0 && (
              <span className="text-rose-400 font-bold text-xs">({maintenanceHardware.length} Alert)</span>
            )}
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Dell PCs, Cisco Routers, Switches</p>
        </div>

        {/* Tile 4 */}
        <div
          onClick={() => onNavigate("profile")}
          className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/60 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">My Account Load</span>
            <UserCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {currentUser.activeLoadCount || 0} <span className="text-sm font-normal text-slate-400">/ 4 Classes</span>
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Max capacity 4 concurrent classes</p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Active Lab Sessions & Resources */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>Recent Lab Sessions & Resource Data</span>
              </h2>
              <p className="text-xs text-slate-400">Classes with syllabus links and hardware assignments</p>
            </div>

            <button
              onClick={() => onNavigate("requests")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{session.courseTitle}</span>
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
                      Lecturer: <strong className="text-slate-200">{session.lecturerName}</strong> • Room: {session.labRoom} • Shift: {session.shift}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                    {session.category}
                  </span>
                </div>

                {session.resourceLink && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs flex items-center justify-between">
                    <span className="text-slate-300 text-[11px] font-mono truncate max-w-xs flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>{session.resourceLink}</span>
                    </span>
                    <a
                      href={session.resourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline text-[10px] font-bold flex items-center gap-1 shrink-0"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1-Col: Campus Noticeboard Feed */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Campus Announcements</span>
              </h3>
              <button
                onClick={() => onNavigate("announcements")}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{ann.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px] font-bold">
                      {ann.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{ann.content}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                    By: {ann.authorName}
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

export default DashboardView;
