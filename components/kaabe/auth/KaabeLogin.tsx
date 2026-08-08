"use client";

import React, { useState } from "react";
import {
  Shield,
  Layers,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  BookOpen,
  Crown,
  KeyRound,
  Loader2,
  Sparkles,
} from "lucide-react";
import { KaabeRole, UserAccount } from "@/types/kaabe";

interface KaabeLoginProps {
  onLogin: (user: UserAccount) => void;
}

const DEMO_USERS: Record<KaabeRole, UserAccount> = {
  SUPER_ADMIN: {
    id: "user-admin",
    fullName: "Dr. Abdishakur Mohamed",
    email: "admin@college.edu",
    employeeId: "KAB-ADM-01",
    phone: "+252 61 500 0001",
    role: "SUPER_ADMIN",
    department: "Executive Administration",
    category: "Programming Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Super Administrator overseeing faculty operations, role permissions, and academic lab governance.",
    skills: ["System Governance", "Security", "Staff Management", "Analytics"],
    status: "Active",
    createdAt: "2026-01-15",
  },
  LAB_CHAIRMAN: {
    id: "user-chairman",
    fullName: "Dr. Abdirahman Ali (Chairman)",
    email: "chairman@college.edu",
    employeeId: "KAB-CHM-01",
    phone: "+252 61 500 0002",
    role: "LAB_CHAIRMAN",
    department: "Faculty of Computing & IT",
    category: "Technical & Cisco Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Director of Laboratory Operations managing course requests, instructor allocations, and equipment readiness.",
    skills: ["Lab Scheduling", "Workload Balancing", "Cisco Lab Infrastructure", "Syllabus Coordination"],
    status: "Active",
    createdAt: "2026-02-01",
  },
  SUBJECT_TEACHER: {
    id: "user-lecturer",
    fullName: "Prof. Ali Nur (Lecturer)",
    email: "lecturer@college.edu",
    employeeId: "KAB-LEC-01",
    phone: "+252 61 500 0003",
    role: "SUBJECT_TEACHER",
    department: "Software Engineering & Computer Science",
    category: "Programming Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Academic Course Lecturer publishing lab module syllabi, practical sheets, and curriculum requirements.",
    skills: ["Database Architecture", "PostgreSQL", "Full-Stack Development", "Algorithms"],
    status: "Active",
    createdAt: "2026-02-10",
  },
  LAB_TEACHER: {
    id: "user-lab-teacher",
    fullName: "Eng. Sadiya Mohamud",
    email: "labteacher@college.edu",
    employeeId: "KAB-INS-01",
    phone: "+252 61 500 0004",
    role: "LAB_TEACHER",
    department: "Networks & Telecommunications",
    category: "Technical & Cisco Lab",
    shift: "AFTERNOON",
    activeLoadCount: 1, // Low load: available for new assignments!
    maxLoadCapacity: 4,
    bio: "Certified Cisco CCNA/CCNP Lab Instructor executing hands-on lab sessions and daily equipment audits.",
    skills: ["Cisco BGP Routing", "Catalyst Switches", "Patch Cabling", "Hardware Diagnostics"],
    status: "Active",
    createdAt: "2026-03-01",
  },
};

export const KaabeLogin: React.FC<KaabeLoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<KaabeRole>("SUPER_ADMIN");
  const [email, setEmail] = useState<string>("admin@college.edu");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetSent, setResetSent] = useState<boolean>(false);

  const handleRoleSelect = (r: KaabeRole) => {
    setSelectedRole(r);
    setEmail(DEMO_USERS[r].email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(DEMO_USERS[selectedRole]);
    }, 350);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotModalOpen(false);
      setResetEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Container */}
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl animate-in fade-in space-y-6">
        
        {/* Brand Header with Kaabe Logo Style */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/30">
            K
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            KAABE <span className="text-cyan-400">PORTAL</span>
          </h1>
          <p className="text-xs text-slate-400">
            College Laboratory & Academic Operations Management System
          </p>
        </div>

        {/* 4 Dedicated Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Select Account Role (Quick Access):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Super Admin */}
            <button
              type="button"
              onClick={() => handleRoleSelect("SUPER_ADMIN")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "SUPER_ADMIN"
                  ? "border-cyan-500 bg-cyan-950/40 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/40"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-800/50">
                  <Crown className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Super Admin</div>
                  <div className="text-[10px] text-slate-400">Users & System Control</div>
                </div>
              </div>
              {selectedRole === "SUPER_ADMIN" && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            </button>

            {/* 2. Lab Chairman */}
            <button
              type="button"
              onClick={() => handleRoleSelect("LAB_CHAIRMAN")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "LAB_CHAIRMAN"
                  ? "border-cyan-500 bg-cyan-950/40 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/40"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-800/50">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Lab Chairman</div>
                  <div className="text-[10px] text-slate-400">Approvals & Assignments</div>
                </div>
              </div>
              {selectedRole === "LAB_CHAIRMAN" && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            </button>

            {/* 3. Subject Teacher / Lecturer */}
            <button
              type="button"
              onClick={() => handleRoleSelect("SUBJECT_TEACHER")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "SUBJECT_TEACHER"
                  ? "border-cyan-500 bg-cyan-950/40 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/40"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Subject Teacher</div>
                  <div className="text-[10px] text-slate-400">Course & Lab Requests</div>
                </div>
              </div>
              {selectedRole === "SUBJECT_TEACHER" && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            </button>

            {/* 4. Lab Teacher / Instructor */}
            <button
              type="button"
              onClick={() => handleRoleSelect("LAB_TEACHER")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === "LAB_TEACHER"
                  ? "border-cyan-500 bg-cyan-950/40 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/40"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Lab Teacher</div>
                  <div className="text-[10px] text-slate-400">Audits & Execution</div>
                </div>
              </div>
              {selectedRole === "LAB_TEACHER" && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>Sign In to Kaabe Portal ({DEMO_USERS[selectedRole].fullName.split(" ")[0]})</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
          Kaabe Academic Operations Platform • Supabase Auth Protected
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>Password Recovery</span>
              </span>
              <button onClick={() => setIsForgotModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs space-y-1 text-center">
                <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-400" />
                <div className="font-bold">Password reset link dispatched!</div>
                <p className="text-[11px] text-slate-300">
                  Please check your inbox at {resetEmail} to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px]">
                  Enter your registered college email to receive a password reset link:
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsForgotModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KaabeLogin;
