"use client";

import React, { useState, useTransition } from "react";
import {
  Wrench,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Terminal,
  Cpu,
  HelpCircle,
} from "lucide-react";

export const AITroubleshooter: React.FC = () => {
  const [symptom, setSymptom] = useState<string>("");
  const [solution, setSolution] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleTroubleshoot = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || symptom;
    if (!query.trim()) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/ai-troubleshoot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ issueDescription: query.trim() }),
        });
        const data = await response.json();
        if (data.solution) {
          setSolution(data.solution);
        }
      } catch (err) {
        console.error("Troubleshooter error:", err);
      }
    });
  };

  const sampleSymptoms = [
    "Switch ports are blinking amber and no network connection",
    "Cisco 2901 router is stuck in boot loop ROMMON prompt",
    "Dell OptiPlex power button blinking amber with black screen",
    "RJ45 LAN patch cable not getting gigabit speed",
  ];

  return (
    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>AI-Semantic-Agent: Diagnostic Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-400" />
            <span>Khabiirka Caqliga leh ee Cilad-bixinta Hardware-ka (AI Troubleshooter)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Qor waxa ku dhacay kombuyuutarka, router-ka, ama switch-ka si aad u hesho xalka tallaabo-tallaabo ah.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-600/40">
          NLP Knowledge Base
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleTroubleshoot} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Tusaale: 'Switch-ka lab 204 nalalka port-yadu waxay u libiqsanayaan hurdi (amber)...'"
            className="w-full pl-4 pr-28 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>Baadh Xalka</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Tusaalooyin degdeg ah:</span>
          {sampleSymptoms.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSymptom(sample);
                handleTroubleshoot(undefined, sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-[10px] text-slate-300 transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Solution Display Card */}
      {solution && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/40">
                  {solution.category}
                </span>
                <span className="text-xs font-bold text-white">{solution.title}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tallaabooyinka lagu xallinayo dhibaatadan (Confidence: {solution.confidenceScore}%):
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700">
              Action: {solution.recommendedAction}
            </span>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200">
            {solution.diagnosticSteps.map((step: string, sIdx: number) => (
              <div key={sIdx} className="leading-relaxed flex items-start gap-2">
                <span className="text-amber-400 font-bold">›</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITroubleshooter;
