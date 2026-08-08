"use client";

import React, { useState } from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Link2,
  ExternalLink,
  Clock,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { CourseSessionRequest } from "@/types/clhms";
import DailyAuditModal from "@/components/DailyAuditModal";

interface InstructorSessionsAuditProps {
  sessions: CourseSessionRequest[];
  currentInstructorId?: string;
  onCompleteSession: (sessionId: string) => void;
}

export const InstructorSessionsAudit: React.FC<InstructorSessionsAuditProps> = ({
  sessions,
  currentInstructorId = "inst-tech-02",
  onCompleteSession,
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [selectedSessionForAudit, setSelectedSessionForAudit] = useState<CourseSessionRequest | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const assignedSessions = sessions.filter((s) => s.status === "IN_PROGRESS");
  const historySessions = sessions.filter((s) => s.status === "COMPLETED");

  const handleLaunchAudit = (session: CourseSessionRequest) => {
    setSelectedSessionForAudit(session);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <ClipboardCheck className="h-4 w-4" />
            <span>Instructor Lab Execution & Audit Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Fadhiyadaada Lab-ka & Xaqiijinta Audit-ka Maalinlaha ah
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Halkan ka arag links-ka duruusta, fuli hubinta qalabka (Daily Audit), oo dhammee fadhiga (-1 Load).
          </p>
        </div>

        <button
          onClick={() => {
            if (assignedSessions.length > 0) {
              handleLaunchAudit(assignedSessions[0]);
            } else {
              setIsAuditModalOpen(true);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Fuli Daily Hardware Audit</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active In-Progress Sessions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Fadhiyada Hadda Kuu Xilsaaran ee Socda ({assignedSessions.length} Active)</span>
        </h3>

        {assignedSessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            Ma jiraan fadhiyo hadda kuu socda. Marka Lab Head-ku fadhi cusub kuu xilsaaro halkan ayuu kaaga soo muuqanayaa!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/40 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-base text-white">{session.courseName}</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Lab Room: <strong className="text-slate-200">{session.labRoom}</strong> • Shift: {session.shift}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/40">
                      IN-PROGRESS
                    </span>
                  </div>

                  {/* Resource Link Provided by Lecturer / Head */}
                  {session.resourceLink ? (
                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                          <Link2 className="h-3.5 w-3.5" />
                          <span>Resource Data Link (Lab Sheet):</span>
                        </span>
                        <a
                          href={session.resourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                        >
                          <span>Furo Link-ga</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="font-mono text-[11px] text-slate-300 truncate">{session.resourceLink}</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      Link: Default campus lab manual.
                    </div>
                  )}

                  {session.instructorInstructions && (
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-cyan-300">Fariin ka timid Lecturer-ka:</strong> {session.instructorInstructions}
                    </div>
                  )}
                </div>

                {/* Actions: Daily Audit + Mark Complete */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleLaunchAudit(session)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ClipboardCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Fuli Audit-ka</span>
                  </button>

                  <button
                    onClick={() => {
                      onCompleteSession(session.id);
                      setFeedback(`Fadhiga ${session.courseName} waa la dhammaystiray (-1 Load)!`);
                      setTimeout(() => setFeedback(null), 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Dhammee Fadhiga (-1 Load)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Session History */}
      {historySessions.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fadhiyadii Hore ee La Dhammaystiray (Completed History)
          </h3>

          <div className="space-y-2 text-xs">
            {historySessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white">{session.courseName}</span>
                  <div className="text-[10px] text-slate-400">Lab: {session.labRoom} • Shift: {session.shift}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Audit Modal */}
      <DailyAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        labSessionId={selectedSessionForAudit?.id || "session-demo-01"}
        labName={selectedSessionForAudit?.labRoom || "LAB-204 (Cisco Networking Lab)"}
        instructorId={currentInstructorId}
        instructorName="Eng. Sacdiya Maxamuud"
        onSubmitSuccess={(data) => {
          setFeedback(`Audit-ka waxaa loo gudbiyay si guul leh (${data.status})!`);
          setTimeout(() => setFeedback(null), 4000);
        }}
      />
    </div>
  );
};

export default InstructorSessionsAudit;
