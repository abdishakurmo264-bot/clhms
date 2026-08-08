"use client";

import React, { useState } from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Link2,
  ExternalLink,
  Clock,
  ClipboardCheck,
} from "lucide-react";
import { LabCourseRequest, UserAccount } from "@/types/kaabe";
import DailyAuditModal from "@/components/DailyAuditModal";

interface MyLabsViewProps {
  currentUser: UserAccount;
  sessions: LabCourseRequest[];
  onCompleteSession: (sessionId: string) => void;
}

export const MyLabsView: React.FC<MyLabsViewProps> = ({
  currentUser,
  sessions,
  onCompleteSession,
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [selectedSessionForAudit, setSelectedSessionForAudit] = useState<LabCourseRequest | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const myAssignedSessions = sessions.filter((s) => s.status === "IN_PROGRESS");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  const handleLaunchAudit = (session: LabCourseRequest) => {
    setSelectedSessionForAudit(session);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <ClipboardCheck className="h-4 w-4" />
            <span>Lab Instructor Execution & Daily Audit Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            My Assigned Labs & Daily Equipment Verification
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Access course resources provided by lecturers, execute the mandatory daily hardware audit, and mark sessions completed (-1 Load).
          </p>
        </div>

        <button
          onClick={() => {
            if (myAssignedSessions.length > 0) {
              handleLaunchAudit(myAssignedSessions[0]);
            } else {
              setIsAuditModalOpen(true);
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Launch Daily Hardware Audit</span>
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
          <span>Assigned Classes Currently In-Progress ({myAssignedSessions.length} Active)</span>
        </h3>

        {myAssignedSessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            You have no active classes assigned right now. When the Lab Chairman assigns you a session, it will appear here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignedSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/40 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-base text-white">{session.courseTitle}</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Room: <strong className="text-slate-200">{session.labRoom}</strong> • Shift: {session.shift} • Lecturer: {session.lecturerName}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/40">
                      IN-PROGRESS
                    </span>
                  </div>

                  {/* Resource Link */}
                  {session.resourceLink ? (
                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                          <Link2 className="h-3.5 w-3.5" />
                          <span>Course Resource & Lab Sheet Link:</span>
                        </span>
                        <a
                          href={session.resourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="font-mono text-[11px] text-slate-300 truncate">{session.resourceLink}</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      Standard course syllabus attached.
                    </div>
                  )}

                  {session.lecturerNotes && (
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-cyan-300">Lecturer Instructions:</strong> {session.lecturerNotes}
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
                    <span>Run Daily Audit</span>
                  </button>

                  <button
                    onClick={() => {
                      onCompleteSession(session.id);
                      setFeedback(`Session ${session.courseTitle} marked as completed (-1 Load Count Decrement)!`);
                      setTimeout(() => setFeedback(null), 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Completed (-1 Load)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History */}
      {completedSessions.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Completed Laboratory Classes History
          </h3>

          <div className="space-y-2 text-xs">
            {completedSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white">{session.courseTitle}</span>
                  <div className="text-[10px] text-slate-400">Room: {session.labRoom} • Shift: {session.shift}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Audit Modal Component */}
      <DailyAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        labSessionId={selectedSessionForAudit?.id || "session-demo-01"}
        labName={selectedSessionForAudit?.labRoom || "LAB-204 (Cisco Networks)"}
        instructorId={currentUser.id}
        instructorName={currentUser.fullName}
        onSubmitSuccess={(data) => {
          setFeedback(`Daily audit successfully submitted with status: ${data.status}!`);
          setTimeout(() => setFeedback(null), 4000);
        }}
      />
    </div>
  );
};

export default MyLabsView;
