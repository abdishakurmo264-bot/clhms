"use client";

import React, { useState } from "react";
import {
  Shield,
  UserCheck,
  CheckCircle2,
  Clock,
  Link2,
  ExternalLink,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { LabCourseRequest, UserAccount } from "@/types/kaabe";

interface AssignmentsViewProps {
  sessions: LabCourseRequest[];
  teachers: UserAccount[];
  onAssignTeacher: (sessionId: string, teacherId: string, customResourceLink?: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  sessions,
  teachers,
  onAssignTeacher,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [customLink, setCustomLink] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingSessions = sessions.filter((s) => s.status === "PENDING");
  const inProgressSessions = sessions.filter((s) => s.status === "IN_PROGRESS");

  const sortedTeachers = [...teachers].sort((a, b) => (a.activeLoadCount || 0) - (b.activeLoadCount || 0));

  const handleAssign = (sessionId: string, teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    if ((teacher.activeLoadCount || 0) >= 4) {
      alert("This instructor has reached maximum workload capacity (4 Classes Max)!");
      return;
    }

    onAssignTeacher(sessionId, teacherId, customLink.trim() || undefined);
    setSelectedSessionId(null);
    setCustomLink("");
    setFeedback(`Lab session successfully assigned to ${teacher.fullName} (+1 Load Count)!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Shield className="h-4 w-4" />
            <span>Lab Chairman Operations & Workload Balancing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Assign Lab Instructors & Balance Capacity
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Review incoming course requests from subject teachers and assign available instructors with low class workload.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          Pending Requests: {pendingSessions.length}
        </span>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Pending Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Pending Assignment Queue ({pendingSessions.length})</span>
            </h3>
          </div>

          {pendingSessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
              No pending course requests. All classes have been assigned to instructors!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 space-y-4 shadow-xl"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{session.courseTitle}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40 animate-pulse">
                          PENDING ASSIGNMENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Lecturer: <strong className="text-slate-200">{session.lecturerName}</strong> • Room: {session.labRoom} • Shift: {session.shift}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                      {session.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Required Equipment & Tools:</span>
                    <p>{session.hardwareNeeds}</p>
                  </div>

                  {session.resourceLink && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs flex items-center justify-between">
                      <span className="text-[11px] font-mono text-indigo-300 truncate max-w-xs flex items-center gap-1">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>Link: {session.resourceLink}</span>
                      </span>
                      <a href={session.resourceLink} target="_blank" rel="noreferrer" className="text-cyan-400 text-[10px] font-bold hover:underline">
                        Open Link
                      </a>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() =>
                        setSelectedSessionId(
                          selectedSessionId === session.id ? null : session.id
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>{selectedSessionId === session.id ? "Close Drawer" : "Assign Lab Teacher"}</span>
                    </button>
                  </div>

                  {/* Inline Assignment Drawer */}
                  {selectedSessionId === session.id && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-in fade-in text-xs">
                      <div className="font-semibold text-cyan-300">
                        Select Available Lab Teacher (Low-Load Capacity First):
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Attach Additional Resource URL or Instructions (Optional):
                        </label>
                        <input
                          type="url"
                          value={customLink}
                          onChange={(e) => setCustomLink(e.target.value)}
                          placeholder="https://drive.google.com/... or GitHub lab sheet"
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sortedTeachers.map((teacher) => {
                          const isFull = (teacher.activeLoadCount || 0) >= 4;
                          return (
                            <button
                              key={teacher.id}
                              disabled={isFull}
                              onClick={() => handleAssign(session.id, teacher.id)}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                                isFull
                                  ? "border-rose-900/40 bg-rose-950/20 text-slate-500 cursor-not-allowed"
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
                                    : (teacher.activeLoadCount || 0) >= 2
                                    ? "bg-amber-950 text-amber-300"
                                    : "bg-emerald-950 text-emerald-300"
                                }`}
                              >
                                {teacher.activeLoadCount || 0} / 4 Load
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

        {/* Right 1-Col: Teacher Workload Balancer */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Teacher Workload Balance</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Available</span>
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
                        (teacher.activeLoadCount || 0) >= 3
                          ? "text-rose-400"
                          : (teacher.activeLoadCount || 0) >= 2
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {teacher.activeLoadCount || 0} / 4 Load
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (teacher.activeLoadCount || 0) >= 3
                          ? "bg-rose-500"
                          : (teacher.activeLoadCount || 0) >= 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${((teacher.activeLoadCount || 0) / 4) * 100}%` }}
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

export default AssignmentsView;
