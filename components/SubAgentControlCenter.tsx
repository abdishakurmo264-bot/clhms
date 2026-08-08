"use client";

import React, { useState } from "react";
import {
  Palette,
  Database,
  Cpu,
  BrainCircuit,
  Activity,
  Terminal,
  Layers,
  Send,
  Copy,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  FolderGit2,
  Lock,
} from "lucide-react";

export interface SubAgentDef {
  id: string;
  tag: "UIX" | "DB" | "CORE" | "AI" | "DEVOPS";
  alias: string;
  name: string;
  badgeColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  icon: React.ElementType;
  specialization: string;
  systemPrompt: string;
  managedPaths: string[];
  sampleTasks: string[];
}

export const SUB_AGENTS: SubAgentDef[] = [
  {
    id: "agent-01-uix",
    tag: "UIX",
    alias: "@UIX-Master",
    name: "UIX-Master-Agent",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    bgGradient: "from-cyan-950/40 to-blue-950/20",
    borderColor: "border-cyan-500/40",
    textColor: "text-cyan-400",
    icon: Palette,
    specialization: "Next.js 14 App Router, Tailwind CSS, Shadcn UI, Responsive Design Specialist",
    systemPrompt:
      "You are UIX-Master-Agent, an elite Frontend Architect specializing in Next.js 14 App Router, Tailwind CSS, and Shadcn UI. Your sole job is to design modern, responsive, and highly usable UI components for the College Lab Management System (CLHMS). Always deliver clean, production-ready TSX code.",
    managedPaths: ["components/DailyAuditModal.tsx", "components/", "app/(dashboard)/"],
    sampleTasks: [
      "Iiga samee DailyAuditModal.tsx oo leh COMPLETE/INCOMPLETE toggle iyo conditional textarea.",
      "Samee LabAttendanceTable.tsx oo leh real-time status badges iyo search filter.",
      "U samee HardwareConditionCard.tsx muuqaal casri ah oo animated ah.",
    ],
  },
  {
    id: "agent-02-db",
    tag: "DB",
    alias: "@Database-Auth",
    name: "Database-Auth-Agent",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    bgGradient: "from-emerald-950/40 to-teal-950/20",
    borderColor: "border-emerald-500/40",
    textColor: "text-emerald-400",
    icon: Database,
    specialization: "PostgreSQL Schema, Supabase Auth, Row Level Security (RLS) Policies, RPC Functions",
    systemPrompt:
      "You are Database-Auth-Agent, a Principal Database Architect specializing in PostgreSQL, Supabase Auth, and Row Level Security (RLS) policies. Your sole job is to design secure, optimized schemas and writing strict RLS policies for the CLHMS project.",
    managedPaths: ["supabase/migrations/20260808000000_clhms_schema_and_rls.sql"],
    sampleTasks: [
      "Qor migration tables-ka profiles, hardware, daily_audits, lab_sessions, announcements.",
      "U samee RLS Policy hubinaysa in Macallinku arko kaliya Audit-kiisa, halka Admin-ku arko dhammaan.",
      "Qor PostgreSQL function rpc_complete_lab_session oo dhimaya active_load_count.",
    ],
  },
  {
    id: "agent-03-core",
    tag: "CORE",
    alias: "@Core-Logic",
    name: "Core-Logic-Agent",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    bgGradient: "from-amber-950/40 to-orange-950/20",
    borderColor: "border-amber-500/40",
    textColor: "text-amber-400",
    icon: Cpu,
    specialization: "Next.js Server Actions ('use server'), Zod Schema Validation, Workload Business Logic",
    systemPrompt:
      "You are Core-Logic-Agent, a Backend Systems Engineer specializing in Next.js Server Actions, TypeScript, Zod validation, and business logic enforcement. Your job is to process data mutations securely and enforce all business constraints for CLHMS.",
    managedPaths: ["actions/lab-sessions.ts", "lib/validators/"],
    sampleTasks: [
      "actions/lab-sessions.ts: submitDailyAudit() oo Zod validation ku hubiya incomplete_reason.",
      "actions/lab-sessions.ts: completeLabSession() oo status COMPLETED u beddelaya dhimayana -1 load count.",
      "Samee assignInstructorToSession() oo xaqiijinaya in macallinku uusan dhaafin max_daily_capacity.",
    ],
  },
  {
    id: "agent-04-ai",
    tag: "AI",
    alias: "@AI-Semantic",
    name: "AI-Semantic-Agent",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    bgGradient: "from-purple-950/40 to-indigo-950/20",
    borderColor: "border-purple-500/40",
    textColor: "text-purple-400",
    icon: BrainCircuit,
    specialization: "Pinecone Vector Indexing, OpenAI Embeddings, Natural Language Matchmaking & Semantic Search",
    systemPrompt:
      "You are AI-Semantic-Agent, an AI Integration Engineer specializing in Vector Databases (Pinecone), Embeddings, and Semantic Search. Your job is to enable intelligent matching and search features within the CLHMS system.",
    managedPaths: ["app/api/search-instructors/route.ts", "lib/ai/"],
    sampleTasks: [
      "app/api/search-instructors/route.ts: Raadi macallinka ku habboon 'Cisco BGP afternoon instructor'.",
      "Samee vector embeddings generation pipeline profiles iyo skills macalimiinta loogu kaydiyo Pinecone.",
      "Ku dar reranking algorithm ku salaysan active_load_count iyo rating.",
    ],
  },
  {
    id: "agent-05-devops",
    tag: "DEVOPS",
    alias: "@DevOps-Telemetry",
    name: "DevOps-Telemetry-Agent",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    bgGradient: "from-rose-950/40 to-pink-950/20",
    borderColor: "border-rose-500/40",
    textColor: "text-rose-400",
    icon: Activity,
    specialization: "GitHub Actions, pg_dump Scheduled Backups, Google Drive API, Sentry & PostHog Telemetry",
    systemPrompt:
      "You are DevOps-Telemetry-Agent, a Systems & Infrastructure Engineer specializing in GitHub Actions, Sentry error monitoring, PostHog analytics, and automated cloud backup pipelines.",
    managedPaths: [".github/workflows/daily-backup.yml"],
    sampleTasks: [
      ".github/workflows/daily-backup.yml: Maalin kasta 00:00 UTC pg_dump ku dir Google Drive API.",
      "Ku dar Sentry failure alert iyo PostHog analytics telemetry marka backup-ku dhamaado.",
      "Qor retention script tirtiraya backup-yada ka weyn 30 maalmood.",
    ],
  },
];

export const SubAgentControlCenter: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<SubAgentDef["tag"]>("UIX");
  const [customTaskInput, setCustomTaskInput] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"task" | "prompt" | "paths">("task");

  const currentAgent = SUB_AGENTS.find((a) => a.tag === selectedTag) || SUB_AGENTS[0];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Zap className="h-4 w-4" />
            <span>CLHMS Multi-Agent Orchestration Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            5 Sub-Agents Control & Dispatch Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Kala saaridda shaqooyinka (Zero Context Overload): Dooro agent-ka si toos ah hawshiisa ugu dhiib.
          </p>
        </div>

        {/* Global Dispatch Tag Indicator */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Chat Prefix: [{selectedTag}] ama {currentAgent.alias}</span>
        </div>
      </div>

      {/* Sub-Agent Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 bg-slate-900/40 border-b border-slate-800/80">
        {SUB_AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isSelected = agent.tag === selectedTag;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedTag(agent.tag)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `border-cyan-500 bg-slate-800/90 shadow-lg shadow-cyan-950/30 text-white ring-1 ring-cyan-500/50`
                  : `border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-200`
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isSelected ? agent.textColor : "text-slate-400"}`} />
                  <span className="font-bold text-xs font-mono">[{agent.tag}]</span>
                </div>
                {isSelected && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <span className="text-xs font-semibold truncate w-full">{agent.name.split("-")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Agent Details & Workspace */}
      <div className="p-6 space-y-6">
        {/* Agent Header Card */}
        <div className={`p-5 rounded-2xl border ${currentAgent.borderColor} bg-gradient-to-br ${currentAgent.bgGradient}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${currentAgent.badgeColor}`}>
                  [{currentAgent.tag}] {currentAgent.alias}
                </span>
                <span className="text-xs text-slate-400">Context Isolation: 100% Active</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-2 flex items-center gap-2">
                {currentAgent.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {currentAgent.specialization}
              </p>
            </div>

            {/* Quick Copy System Prompt */}
            <button
              onClick={() => handleCopy(currentAgent.systemPrompt, "sys-prompt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              {copiedField === "sys-prompt" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Prompt-ka waa la koobiyay!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Koobi System Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-medium">
          <button
            onClick={() => setActiveTab("task")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "task" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📋 Task Execution & Dispatch
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "prompt" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📜 Isolated System Prompt
          </button>
          <button
            onClick={() => setActiveTab("paths")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "paths" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📁 Managed Files ({currentAgent.managedPaths.length})
          </button>
        </div>

        {/* Tab Content: Task Dispatch */}
        {activeTab === "task" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Hawlaha Tooska ah ee aad u dhiibi karto Agent-kan (Sample Tasks):</span>
            </h3>

            <div className="grid gap-2.5">
              {currentAgent.sampleTasks.map((sampleTask, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all text-xs"
                >
                  <span className="text-slate-200 font-mono pr-4">
                    <span className="text-cyan-400 font-bold">[{currentAgent.tag}]</span> {sampleTask}
                  </span>
                  <button
                    onClick={() => handleCopy(`[${currentAgent.tag}] ${sampleTask}`, `task-${idx}`)}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    {copiedField === `task-${idx}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Kala bax</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Kala bax</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Task Composer */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Qor Hawl Cusub oo aad toos ugu dhiibayso {currentAgent.alias}:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-xs font-mono font-bold text-cyan-400 select-none">
                    [{currentAgent.tag}]
                  </span>
                  <input
                    type="text"
                    value={customTaskInput}
                    onChange={(e) => setCustomTaskInput(e.target.value)}
                    placeholder="Tusaale: Ii samee component-ka..."
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    const formatted = `[${currentAgent.tag}] ${customTaskInput}`;
                    handleCopy(formatted, "custom-dispatch");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Koobi & Dhiibo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Isolated System Prompt */}
        {activeTab === "prompt" && (
          <div className="space-y-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentAgent.systemPrompt}
            </div>
          </div>
        )}

        {/* Tab Content: Managed Paths */}
        {activeTab === "paths" && (
          <div className="space-y-2">
            <div className="grid gap-2">
              {currentAgent.managedPaths.map((path, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300"
                >
                  <FolderGit2 className="h-4 w-4 text-slate-400" />
                  <span>{path}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Protocol Notice */}
      <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Zero Overload Protocol: Mid kasta wuxuu ku shaqaynayaa Context gooni ah.</span>
        </div>
        <div className="font-mono text-slate-500">
          CLI: <span className="text-slate-300">python3 orchestrator/run.py --interactive</span>
        </div>
      </div>
    </div>
  );
};

export default SubAgentControlCenter;
