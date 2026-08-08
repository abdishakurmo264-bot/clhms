"use client";

import React, { useState, useTransition } from "react";
import {
  Shield,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Sliders,
  AlertTriangle,
  Link2,
  Loader2,
} from "lucide-react";
import { CourseSessionRequest, InstructorProfile } from "@/types/clhms";

interface LabHeadAssignmentSuiteProps {
  sessions: CourseSessionRequest[];
  teachers: InstructorProfile[];
  onAssignTeacher: (sessionId: string, teacherId: string, resourceLink?: string) => void;
}

export const LabHeadAssignmentSuite: React.FC<LabHeadAssignmentSuiteProps> = ({
  sessions,
  teachers,
  onAssignTeacher,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [customResourceLink, setCustomResourceLink] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pendingSessions = sessions.filter((s) => s.status === "PENDING");
  const assignedSessions = sessions.filter((s) => s.status !== "PENDING");

  // Sort teachers so those with LOW load (<2) appear at the TOP for assignment!
  const sortedTeachers = [...teachers].sort((a, b) => a.activeLoadCount - b.activeLoadCount);

  const handleAssign = (sessionId: string, teacherId: string) => {
    startTransition(() => {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (!teacher) return;

      if (teacher.activeLoadCount >= 4) {
        alert("Macallinkani wuxuu gaadhay xadka ugu sarreeya ee culayska (4 Classes Max)!");
        return;
      }

      onAssignTeacher(sessionId, teacherId, customResourceLink.trim() || undefined);
      setSelectedSessionId(null);
      setCustomResourceLink("");
      setFeedback(`Fadhiga waxaa si guul leh loogu xilsaaray ${teacher.fullName} (+1 Load)!`);
      setTimeout(() => setFeedback(null), 4000);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Shield className="h-4 w-4" />
            <span>Lab Head Control & Workload Balancing Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Qaybinta & Wareejinta Fadhiyada Macalimiinta Lab-ka
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Dooro fadhiga loo baahan yahay oo u xilsaar macallinka xorta ah ee haysta culayska ugu yar (Available).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          <span>Pending Requests: {pendingSessions.length}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Incoming Pending Requests & Action Assign Drawer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Codsiyada Sugaya in Macallin loo Xilsaaro (Pending Requests)</span>
            </h3>
            <span className="text-xs font-mono text-amber-300">{pendingSessions.length} Classes</span>
          </div>

          {pendingSessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
              Ma jiraan codsiyo cusub oo sugaya xilsaaris. Dhammaan fadhiyada macalimiin ayaa loo xilsaaray!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{session.courseName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40 animate-pulse">
                          PENDING ASSIGNMENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Lecturer: <strong className="text-slate-200">{session.lecturerName}</strong> • Lab Room: {session.labRoom} • Shift: {session.shift}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                      {session.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Qalabka Loo Baahan Yahay:</span>
                    <p>{session.hardwareRequirements}</p>
                  </div>

                  {session.resourceLink && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
                      <span className="text-[11px] flex items-center gap-1 font-mono truncate max-w-xs">
                        <Link2 className="h-3 w-3" />
                        <span>Link: {session.resourceLink}</span>
                      </span>
                      <a
                        href={session.resourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline text-[10px] font-bold"
                      >
                        Furo
                      </a>
                    </div>
                  )}

                  {/* Assign Button / Drawer Trigger */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                    <button
                      onClick={() =>
                        setSelectedSessionId(
                          selectedSessionId === session.id ? null : session.id
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>{selectedSessionId === session.id ? "Xidh Qaybta" : "Xilsaar Macallin (Assign)"}</span>
                    </button>
                  </div>

                  {/* Inline Assignment Drawer */}
                  {selectedSessionId === session.id && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-cyan-300">
                          Dooro Macallinka Xorta ah ee Loo Xilsaarayo (Low Load First):
                        </label>
                        <p className="text-[10px] text-slate-400">
                          Macalimiinta ugu culayska yar waxay ku jiraan xagga sare si loo ilaaliyo sinnaanta shaqada.
                        </p>
                      </div>

                      {/* Add extra resource link if needed */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Ku dar Resource Link dheeraad ah ama data la galinayo (Optional):
                        </label>
                        <input
                          type="url"
                          value={customResourceLink}
                          onChange={(e) => setCustomResourceLink(e.target.value)}
                          placeholder="https://drive.google.com/... ama Syllabus lab link"
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Teachers Selection Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sortedTeachers.map((teacher) => {
                          const isFull = teacher.activeLoadCount >= 4;
                          return (
                            <button
                              key={teacher.id}
                              disabled={isFull}
                              onClick={() => handleAssign(session.id, teacher.id)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                                isFull
                                  ? "border-rose-900/50 bg-rose-950/20 text-slate-500 cursor-not-allowed"
                                  : "border-slate-800 bg-slate-900 hover:border-cyan-500 hover:bg-cyan-950/20 text-white cursor-pointer"
                              }`}
                            >
                              <div>
                                <div className="font-bold text-slate-200">{teacher.fullName}</div>
                                <div className="text-[10px] text-slate-400">{teacher.category} • Shift: {teacher.shift}</div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isFull
                                    ? "bg-rose-950 text-rose-400"
                                    : teacher.activeLoadCount >= 2
                                    ? "bg-amber-950 text-amber-300"
                                    : "bg-emerald-950 text-emerald-300"
                                }`}
                              >
                                {teacher.activeLoadCount} / 4 Load
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1-Col: Live Teacher Load Capacity Ranking */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Teacher Capacity</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Available Low-Load</span>
            </div>

            <div className="space-y-3">
              {sortedTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{teacher.fullName}</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        teacher.activeLoadCount >= 3
                          ? "text-rose-400"
                          : teacher.activeLoadCount >= 2
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {teacher.activeLoadCount} / 4 Classes
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        teacher.activeLoadCount >= 3
                          ? "bg-rose-500"
                          : teacher.activeLoadCount >= 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(teacher.activeLoadCount / 4) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{teacher.category}</span>
                    <span className="text-cyan-400">{teacher.shift}</span>
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

export default LabHeadAssignmentSuite;
