"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Cpu,
  Users,
  CalendarDays,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Activity,
  Layers,
  LogOut,
  SlidersHorizontal,
  Clock,
  Radio,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { UserRole, SHIFT_SCHEDULES, ShiftType } from "@/types/clhms";

interface AppShellProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeShift?: ShiftType;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeRole,
  onRoleChange,
  activeShift = "MORNING",
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const [currentShift, setCurrentShift] = useState<ShiftType>(activeShift);

  const roleMeta: Record<
    UserRole,
    { label: string; tag: string; badgeClass: string; desc: string }
  > = {
    ROLE_ADMIN: {
      label: "Super Admin",
      tag: "ADMIN",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      desc: "Full institution oversight, user management & system audits",
    },
    ROLE_LAB_HEAD: {
      label: "Director of Labs (Lab Head)",
      tag: "LAB_HEAD",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      desc: "Lab operational control, teacher assignments & schedule approvals",
    },
    ROLE_LAB_TEACHER: {
      label: "Lab Instructor / Teacher",
      tag: "TEACHER",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      desc: "Daily hardware audits, session executions & equipment monitoring",
    },
    ROLE_LECTURER: {
      label: "Academic Lecturer",
      tag: "LECTURER",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      desc: "Lab module requests, teacher semantic matchmaking & course tracking",
    },
  };

  const currentRoleInfo = roleMeta[activeRole];
  const shiftInfo = SHIFT_SCHEDULES[currentShift];

  const navigationItems = [
    {
      label: "Overview Dashboard",
      icon: LayoutDashboard,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LAB_TEACHER", "ROLE_LECTURER"],
      badge: "Live",
    },
    {
      label: "Daily Hardware Audits",
      icon: ClipboardCheck,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LAB_TEACHER"],
      badge: "Mandatory",
    },
    {
      label: "Hardware Inventory",
      icon: Cpu,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LAB_TEACHER"],
    },
    {
      label: "Teachers & Load Balancer",
      icon: Users,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LECTURER"],
    },
    {
      label: "Lab Course Publishing",
      icon: BookOpen,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LECTURER"],
    },
    {
      label: "Central Noticeboard",
      icon: Bell,
      roles: ["ROLE_ADMIN", "ROLE_LAB_HEAD", "ROLE_LAB_TEACHER", "ROLE_LECTURER"],
      badge: "Realtime",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. TOP GLOBAL NOTIFICATION TICKER / SHIFT BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span className="uppercase tracking-wider">CLHMS Realtime Feed</span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Shift Hadda: <strong className="text-white">{shiftInfo.title}</strong> ({shiftInfo.hoursEAT})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Shift Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900/90 border border-slate-700/80 p-0.5 text-[11px]">
            <button
              onClick={() => setCurrentShift("MORNING")}
              className={`px-2 py-0.5 rounded ${currentShift === "MORNING" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              Morning (Subax)
            </button>
            <button
              onClick={() => setCurrentShift("AFTERNOON")}
              className={`px-2 py-0.5 rounded ${currentShift === "AFTERNOON" ? "bg-indigo-500/20 text-indigo-300 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              Afternoon (Galab)
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>$0/mo SaaS Free Tier</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                CLHMS
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">College Lab & Hardware Management</p>
            </div>
          </div>
        </div>

        {/* Global Search Bar with AI Semantic Cue */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hardware, teachers (e.g. 'Cisco BGP afternoon')..."
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <span className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 border border-slate-700">
              AI Vector
            </span>
          </div>
        </div>

        {/* Header Right Actions & Dynamic RBAC Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${currentRoleInfo.badgeClass}`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{currentRoleInfo.label}</span>
              <span className="sm:hidden">{currentRoleInfo.tag}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400 font-medium">
                  Switch Active RBAC Role:
                </div>
                <div className="space-y-1 mt-1">
                  {(Object.keys(roleMeta) as UserRole[]).map((roleKey) => {
                    const item = roleMeta[roleKey];
                    const isSelected = activeRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          onRoleChange(roleKey);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? "bg-slate-800 text-white font-bold border border-slate-700"
                            : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{item.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{item.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {activeRole === "ROLE_LAB_TEACHER" ? "LT" : activeRole === "ROLE_ADMIN" ? "AD" : "LH"}
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN BODY (COLLAPSIBLE SIDEBAR + CONTENT AREA) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-900/40 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="p-4 flex-1 space-y-1.5">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-2">
              {!isSidebarCollapsed && "Navigation Modules"}
            </div>

            {navigationItems.map((item, idx) => {
              const isAllowed = item.roles.includes(activeRole);
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  disabled={!isAllowed}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    idx === 0
                      ? "bg-gradient-to-r from-cyan-950/60 to-blue-950/30 text-cyan-300 border border-cyan-800/40 font-semibold"
                      : isAllowed
                      ? "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : "text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                  title={!isAllowed ? `Not available for ${activeRole}` : item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${idx === 0 ? "text-cyan-400" : "text-slate-400"}`} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800/80 space-y-2">
            {!isSidebarCollapsed && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
                  <span>Serverless DB</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-1/4 rounded-full" />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in">
            <div className="w-72 bg-slate-900 h-full p-5 border-r border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <span className="font-bold text-white">CLHMS Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navigationItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                Current Role: <strong className="text-white">{currentRoleInfo.label}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
