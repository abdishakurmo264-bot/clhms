"use client";

import React, { useState, useTransition } from "react";
import {
  BrainCircuit,
  Search,
  Sparkles,
  UserCheck,
  Code2,
  Network,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Sliders,
  Layers,
} from "lucide-react";
import { InstructorSearchResult } from "@/app/api/search-instructors/route";

interface AISemanticSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstructor?: (instructor: InstructorSearchResult) => void;
}

const SAMPLE_QUERIES = [
  "Cisco BGP afternoon instructor",
  "SQL and Python Web Development teacher",
  "Hardware switch maintenance and patch cabling",
  "HTML CSS and WordPress introductory lab",
  "Linux Kernel and Shell scripting assistant",
];

export const AISemanticSearchModal: React.FC<AISemanticSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectInstructor,
}) => {
  const [query, setQuery] = useState<string>("Cisco BGP afternoon instructor");
  const [results, setResults] = useState<InstructorSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSearch = (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    if (!q.trim()) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/search-instructors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q.trim(),
            topK: 5,
            departmentFilter: selectedDept !== "ALL" ? selectedDept : undefined,
          }),
        });
        const data = await response.json();
        if (data.instructors) {
          setResults(data.instructors);
          setHasSearched(true);
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
      role="dialog"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-800/50 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Top Decorative Vector Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

        <div className="p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                <BrainCircuit className="h-4 w-4" />
                <span>Pinecone Vector Matchmaking Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Raadinta Caqliga leh ee Macalimiinta (AI Semantic Match)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kala raadi macallinka ku habboon maaddada adiga oo adeegsanaya weedho dabiici ah (Natural Language).
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-purple-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tusaale: 'Cisco BGP afternoon instructor', 'Python and SQL lab'..."
                className="w-full pl-11 pr-28 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isPending}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Raadi</span>
              </button>
            </div>

            {/* Sample Prompts / Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-mono">Tusaalooyin:</span>
              {SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(sample);
                    handleSearch(sample);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-purple-500 text-[10px] text-slate-300 transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {isPending ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                <span>Generating OpenAI Embeddings & Querying Pinecone Vector Index...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((teacher, idx) => (
                <div
                  key={teacher.instructorId || idx}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{teacher.fullName}</span>
                      {/* Match Score Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                        {teacher.matchScore}% Match Score
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{teacher.snippet}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-mono text-cyan-400">
                        {teacher.specializations.join(" • ")}
                      </span>
                      <span>|</span>
                      <span>Shifts: {teacher.preferredShifts.join(", ")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectInstructor) onSelectInstructor(teacher);
                      onClose();
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Xulo Macallinkan
                  </button>
                </div>
              ))
            ) : hasSearched ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-slate-800 rounded-2xl bg-slate-900/40">
                Lama helin macallin toos ugu beegan weedhaada. Fadlan beddel weedha raadinta.
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                Qor waxaad u baahan tahay ama guji mid ka mid ah tusaalooyinka kore.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISemanticSearchModal;
