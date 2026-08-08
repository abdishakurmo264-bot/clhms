"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Crown,
  BookOpen,
  UserCheck,
  Building,
} from "lucide-react";
import { KaabeRole, UserAccount } from "@/types/kaabe";

interface ZicLoginProps {
  onLogin: (user: UserAccount) => void;
}

const REGISTERED_ACCOUNTS: Record<string, { user: UserAccount; pass: string }> = {
  "admin@college.edu": {
    pass: "Admin2026!",
    user: {
      id: "user-admin",
      fullName: "Dr. Abdishakur Mohamed",
      email: "admin@college.edu",
      employeeId: "ZIC-ADM-01",
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
  },
  "chairman@college.edu": {
    pass: "Chairman2026!",
    user: {
      id: "user-chairman",
      fullName: "Dr. Abdirahman Ali (Chairman)",
      email: "chairman@college.edu",
      employeeId: "ZIC-CHM-01",
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
  },
  "lecturer@college.edu": {
    pass: "Lecturer2026!",
    user: {
      id: "user-lecturer",
      fullName: "Prof. Ali Nur (Lecturer)",
      email: "lecturer@college.edu",
      employeeId: "ZIC-LEC-01",
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
  },
  "labteacher@college.edu": {
    pass: "Teacher2026!",
    user: {
      id: "user-lab-teacher",
      fullName: "Eng. Sadiya Mohamud",
      email: "labteacher@college.edu",
      employeeId: "ZIC-INS-01",
      phone: "+252 61 500 0004",
      role: "LAB_TEACHER",
      department: "Networks & Telecommunications",
      category: "Technical & Cisco Lab",
      shift: "AFTERNOON",
      activeLoadCount: 1,
      maxLoadCapacity: 4,
      bio: "Certified Cisco CCNA/CCNP Lab Instructor executing hands-on lab sessions and daily equipment audits.",
      skills: ["Cisco BGP Routing", "Catalyst Switches", "Patch Cabling", "Hardware Diagnostics"],
      status: "Active",
      createdAt: "2026-03-01",
    },
  },
};

export const ZicLogin: React.FC<ZicLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("admin@college.edu");
  const [password, setPassword] = useState<string>("Admin2026!");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetSent, setResetSent] = useState<boolean>(false);

  const fillCredentials = (userEmail: string) => {
    const acc = REGISTERED_ACCOUNTS[userEmail];
    if (acc) {
      setEmail(userEmail);
      setPassword(acc.pass);
      setErrorMessage(null);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      const match = REGISTERED_ACCOUNTS[normalizedEmail];

      if (match) {
        // Save session to localStorage so browser never asks again until logout
        try {
          localStorage.setItem("zic_auth_session", JSON.stringify(match.user));
        } catch (e) {}

        setIsLoading(false);
        onLogin(match.user);
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid credentials. Please enter a valid registered college email.");
      }
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Container */}
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl animate-in fade-in space-y-6">
        
        {/* Official Zoom International College (ZIC) Crest Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img
              src="/images/zoom_college_logo.jpg"
              alt="Zoom International College (ZIC) Logo"
              className="h-24 w-24 object-contain rounded-full shadow-2xl ring-4 ring-orange-500/50 bg-white p-1"
              onError={(e) => {
                // Fallback circular crest if image loading blocked
                (e.currentTarget as any).style.display = "none";
              }}
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-1.5">
              <span>Zoom International College</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest font-mono">
                ZIC Academic & Lab Portal
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
            </div>
          </div>
        </div>

        {/* Quick Credentials Filler (Helper Bar) */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-400">Demo Staff Accounts (Click to fill):</span>
            <span className="text-[10px] text-orange-400 font-mono">Auto-Fill</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials("admin@college.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-[11px] text-purple-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crown className="h-3 w-3" />
              <span>Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("chairman@college.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/40 text-[11px] text-blue-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="h-3 w-3" />
              <span>Lab Chairman</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("lecturer@college.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-[11px] text-cyan-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="h-3 w-3" />
              <span>Subject Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("labteacher@college.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3 w-3" />
              <span>Lab Teacher</span>
            </button>
          </div>
        </div>

        {/* Real Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@college.edu"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] text-orange-400 hover:underline cursor-pointer"
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
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>Sign In to ZIC Portal</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1">
          <span>Zoom International College</span>
          <span>•</span>
          <span className="text-orange-400 font-mono">ZIC Secure Session</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-orange-400 flex items-center gap-1.5">
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
                  Enter your registered ZIC college email to receive a password reset link:
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
                  <button type="submit" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold">
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

export default ZicLogin;
