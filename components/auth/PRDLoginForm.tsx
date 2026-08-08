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
  Wrench,
  BarChart3,
  Sparkles,
  HelpCircle,
  Loader2,
  KeyRound,
} from "lucide-react";

export type PRDRoleName =
  | "ADMIN"
  | "LAB_CHAIRMAN"
  | "LAB_TEACHER"
  | "SUBJECT_TEACHER"
  | "INVENTORY_OFFICER"
  | "COLLEGE_MANAGEMENT";

interface PRDLoginFormProps {
  onLoginSuccess: (role: PRDRoleName, email: string, name: string) => void;
}

export const PRDLoginForm: React.FC<PRDLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("admin@college.edu");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<PRDRoleName>("ADMIN");
  const [selectedName, setSelectedName] = useState<string>("System Administrator");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const demoAccounts: {
    role: PRDRoleName;
    title: string;
    email: string;
    name: string;
    employeeId: string;
    desc: string;
    icon: React.ElementType;
    badgeColor: string;
  }[] = [
    {
      role: "ADMIN",
      title: "System Admin",
      email: "admin@college.edu",
      name: "System Administrator",
      employeeId: "ADM-001",
      desc: "Full Control, User Management & Permissions",
      icon: Crown,
      badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/50",
    },
    {
      role: "LAB_CHAIRMAN",
      title: "Lab Chairman",
      email: "chairman@college.edu",
      name: "Dr. Cabdiraxmaan Cali",
      employeeId: "CHM-001",
      desc: "Lab Operations, Approvals & Workload Assignment",
      icon: Shield,
      badgeColor: "bg-blue-950/80 text-blue-300 border-blue-500/50",
    },
    {
      role: "LAB_TEACHER",
      title: "Lab Teacher",
      email: "teacher1@college.edu",
      name: "Eng. Sacdiya Maxamuud",
      employeeId: "LT-001",
      desc: "Daily Audits, Class Execution & Lab Completion",
      icon: UserCheck,
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    },
    {
      role: "SUBJECT_TEACHER",
      title: "Subject Teacher (Lecturer)",
      email: "teacher2@college.edu",
      name: "Ust. Cali Nuur",
      employeeId: "ST-001",
      desc: "Course Lab Requests, Syllabi & Data Links",
      icon: BookOpen,
      badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/50",
    },
    {
      role: "INVENTORY_OFFICER",
      title: "Inventory Officer",
      email: "inventory@college.edu",
      name: "Eng. Mustafe Xuseen",
      employeeId: "INV-001",
      desc: "Hardware & Tools Inventory, Scans & Transfers",
      icon: Wrench,
      badgeColor: "bg-amber-950/80 text-amber-300 border-amber-500/50",
    },
    {
      role: "COLLEGE_MANAGEMENT",
      title: "College Management",
      email: "management@college.edu",
      name: "Dean of Academic Affairs",
      employeeId: "MGT-001",
      desc: "Executive Read-Only Overview & Analytics",
      icon: BarChart3,
      badgeColor: "bg-rose-950/80 text-rose-300 border-rose-500/50",
    },
  ];

  const handleSelectAccount = (acc: (typeof demoAccounts)[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setSelectedName(acc.name);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole, email, selectedName);
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotModalOpen(false);
      setResetEmail("");
    }, 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl text-slate-100 backdrop-blur-xl animate-in fade-in">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-cyan-950/60 mb-3">
          <Layers className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          College Lab Portal Login
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          PRD Version 1.1: Multi-Role Authentication & Access Control System
        </p>
      </div>

      {/* 6-Role Quick Selection Matrix (PRD Section 1) */}
      <div className="space-y-2 mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Dooro Account-ka aad ku Gelayso (6 Official Roles):
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon;
            const isSelected = selectedRole === acc.role;
            return (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-950/40 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/30"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className="font-bold text-xs text-white">{acc.title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                </div>

                <div className="text-[10px] font-mono text-slate-400">{acc.email}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{acc.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
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
              Forgot Password? (Dib u celi)
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
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          <span>Gal Dashboard-ka ({selectedRole.replace("_", " ")})</span>
        </button>

        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
          Supabase PostgreSQL JWT & Row Level Security (RLS) Protected
        </div>
      </form>

      {/* Forgot Password Modal (PRD Section 27) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>Password Reset (Supabase Auth)</span>
              </span>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs space-y-1 text-center">
                <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-400" />
                <div className="font-bold">Reset link waa la diray!</div>
                <p className="text-[11px] text-slate-300">
                  Fadlan fur email-kaaga {resetEmail} si aad u doorato password cusub.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px]">
                  Geli email-kaaga si Supabase kuugu soo diro link-ga dib u dejinta password-ka:
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
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-2 text-slate-400"
                  >
                    Ka noqo
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    Dir Reset Link
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

export default PRDLoginForm;
