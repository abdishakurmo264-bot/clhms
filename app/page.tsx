"use client";

import React, { useState } from "react";
import { UserRole, ShiftType } from "@/types/clhms";
import AppShell from "@/components/layout/AppShell";
import Phase1Dashboard from "@/components/dashboard/Phase1Dashboard";
import LabCoursePublishingWizard from "@/components/course-publishing/LabCoursePublishingWizard";
import RealtimeNoticeboard from "@/components/announcements/RealtimeNoticeboard";
import AISemanticSearchModal from "@/components/ai/AISemanticSearchModal";
import AITroubleshooter from "@/components/ai/AITroubleshooter";
import UATVerificationSuite from "@/components/uat/UATVerificationSuite";
import SubAgentControlCenter from "@/components/SubAgentControlCenter";
import LoginForm from "@/components/auth/LoginForm";
import {
  Layout,
  BookOpen,
  BrainCircuit,
  ShieldCheck,
  Bot,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>("ROLE_LAB_HEAD");
  const [activeView, setActiveView] = useState<
    "dashboard" | "publishing" | "realtime_ai" | "uat_launch" | "orchestrator"
  >("dashboard");
  const [currentShift, setCurrentShift] = useState<ShiftType>("MORNING");
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const handleLogin = (role: UserRole) => {
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <LoginForm onLoginSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <AppShell
      activeRole={activeRole}
      onRoleChange={(newRole) => setActiveRole(newRole)}
      activeShift={currentShift}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Switcher: Phase 1, Phase 2, Phase 3, Phase 4, & Multi-Agent Control */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Phase 1 Button */}
            <button
              onClick={() => setActiveView("dashboard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Layout className="h-4 w-4" />
              <span>Phase 1: Shift & Hardware</span>
            </button>

            {/* Phase 2 Button */}
            <button
              onClick={() => setActiveView("publishing")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "publishing"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <BookOpen className="h-4 w-4 text-cyan-300" />
              <span>Phase 2: Workload (+1/-1 Load)</span>
            </button>

            {/* Phase 3 Button */}
            <button
              onClick={() => setActiveView("realtime_ai")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "realtime_ai"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <BrainCircuit className="h-4 w-4 text-purple-300" />
              <span>Phase 3: Realtime & AI Engine</span>
            </button>

            {/* Phase 4 Button */}
            <button
              onClick={() => setActiveView("uat_launch")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "uat_launch"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Phase 4: Launch & UAT Suite</span>
            </button>

            {/* Sub-Agents Orchestrator Button */}
            <button
              onClick={() => setActiveView("orchestrator")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "orchestrator"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Bot className="h-4 w-4 text-amber-400" />
              <span>5 Sub-Agents Control Hub</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick AI Search Trigger */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>AI Vector Match</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dynamic View rendering */}
        {activeView === "dashboard" && (
          <Phase1Dashboard activeRole={activeRole} currentShift={currentShift} />
        )}
        {activeView === "publishing" && (
          <LabCoursePublishingWizard activeRole={activeRole} />
        )}
        {activeView === "realtime_ai" && (
          <div className="space-y-6 animate-in fade-in">
            <RealtimeNoticeboard activeRole={activeRole} />
            <AITroubleshooter />
          </div>
        )}
        {activeView === "uat_launch" && (
          <UATVerificationSuite />
        )}
        {activeView === "orchestrator" && (
          <SubAgentControlCenter />
        )}
      </div>

      {/* AI Semantic Search Modal */}
      <AISemanticSearchModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSelectInstructor={(inst) => {
          alert(`Macallin ${inst.fullName} ayaa lagu doortay (${inst.matchScore}% Match)!`);
        }}
      />
    </AppShell>
  );
}
