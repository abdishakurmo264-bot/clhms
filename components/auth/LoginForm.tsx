"use client";

import React, { useState } from "react";
import { Shield, Layers, Lock, Mail, ArrowRight, CheckCircle2, UserCheck, BookOpen, Crown } from "lucide-react";
import { UserRole } from "@/types/clhms";

interface LoginFormProps {
  onLoginSuccess: (role: UserRole, email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("ROLE_LAB_TEACHER");
  const [email, setEmail] = useState<string>("teacher.sacdiya@college.edu");
  const [password, setPassword] = useState<string>("••••••••••••");

  const rolesList: {
    role: UserRole;
    title: string;
    badge: string;
    icon: React.ElementType;
    demoEmail: string;
  }[] = [
    {
      role: "ROLE_LAB_TEACHER",
      title: "Lab Teacher / Instructor",
      badge: "Daily Audits & Hardware Checks",
      icon: UserCheck,
      demoEmail: "teacher.sacdiya@college.edu",
    },
    {
      role: "ROLE_LAB_HEAD",
      title: "Director of Labs (Lab Head)",
      badge: "Assignment Workflows & Approvals",
      icon: Shield,
      demoEmail: "head.director@college.edu",
    },
    {
      role: "ROLE_ADMIN",
      title: "Super Admin",
      badge: "Full System Analytics & RLS Audit",
      icon: Crown,
      demoEmail: "admin.super@college.edu",
    },
    {
      role: "ROLE_LECTURER",
      title: "Academic Lecturer",
      badge: "Publish Course & Vector Match",
      icon: BookOpen,
      demoEmail: "lecturer.ahmed@college.edu",
    },
  ];

  const handleRoleSelect = (r: UserRole, demoMail: string) => {
    setSelectedRole(r);
    setEmail(demoMail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole, email);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl text-slate-100 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-950/60 mb-3">
          <Layers className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Galitaanka CLHMS</h1>
        <p className="text-xs text-slate-400 mt-1">
          College Lab & Hardware Management System (Version 1.0)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Quick Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            Dooro Doorkaada (Select RBAC Role)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {rolesList.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item.role, item.demoEmail)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-950/30 text-white ring-1 ring-cyan-500/50 shadow-md shadow-cyan-950/40"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                    <div>
                      <div className="font-bold text-xs">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.badge}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Gal Nidaamka ({selectedRole.replace("ROLE_", "")})</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="text-center text-[11px] text-slate-500 pt-2">
          $0/Month Free Tier Cloud Architecture • Supabase JWT & RLS Protected
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
