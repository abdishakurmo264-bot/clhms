"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Link2,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { CourseSessionRequest, LabCategory, ShiftType } from "@/types/clhms";

interface SubjectTeacherDashboardProps {
  sessions: CourseSessionRequest[];
  onAddSession: (newSession: Partial<CourseSessionRequest>) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SubjectTeacherDashboard: React.FC<SubjectTeacherDashboardProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [courseName, setCourseName] = useState<string>("");
  const [category, setCategory] = useState<LabCategory>("Programming");
  const [shift, setShift] = useState<ShiftType>("MORNING");
  const [labRoom, setLabRoom] = useState<string>("LAB-101");
  const [hardwareReqs, setHardwareReqs] = useState<string>("");
  const [resourceLink, setResourceLink] = useState<string>("");
  const [instructorInstructions, setInstructorInstructions] = useState<string>("");

  const [feedback, setFeedback] = useState<string | null>(null);

  const mySessions = sessions.filter((s) => s.lecturerId === "lec-01" || s.lecturerId === "lec-current" || true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    onAddSession({
      courseName: courseName.trim(),
      category,
      shift,
      labRoom,
      hardwareRequirements: hardwareReqs.trim() || "Standard Lab Workstation Setup",
      resourceLink: resourceLink.trim() || undefined,
      instructorInstructions: instructorInstructions.trim() || undefined,
      lecturerName: "Ust. Cali Nuur (Academic Lecturer)",
      status: "PENDING",
      date: new Date().toLocaleDateString(),
      createdAt: "Hadda",
    });

    setCourseName("");
    setHardwareReqs("");
    setResourceLink("");
    setInstructorInstructions("");
    setIsModalOpen(false);
    setFeedback("Codsigaaga fadhiga lab-ka si guul leh ayaa loo daabacay (PENDING)!");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <BookOpen className="h-4 w-4" />
            <span>PRD Section 21: Subject Teacher (Lecturer) Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Daabacaadda Kulamada & Lifaaqa Duruusta Lab-ka
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Macallinka maaddadu wuxuu halkan ku daabacaa fadhiyada soo socda, wuxuu ku lifaaqaa Resource Links-ka (Google Drive, GitHub), qalabka loo baahan yahay, iyo fariinta macallinka lab-ka.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Daabac Codsi Lab Cusub (New Lab Request)</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of My Published Lab Sessions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Fadhiyadaada Lab-ka ee La Soo Daabacay ({mySessions.length} Classes)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mySessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{session.courseName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          session.status === "PENDING"
                            ? "bg-amber-950 text-amber-300 border-amber-600/40 animate-pulse"
                            : session.status === "IN_PROGRESS"
                            ? "bg-cyan-950 text-cyan-300 border-cyan-600/40"
                            : "bg-emerald-950 text-emerald-300 border-emerald-600/40"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Lab Room: <strong className="text-slate-200">{session.labRoom}</strong> • Shift: {session.shift}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                    {session.category}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Qalabka Loo Baahan Yahay:</span>
                  <p>{session.hardwareRequirements}</p>
                </div>

                {session.resourceLink && (
                  <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        <span>Resource Data Link (Lab Sheet):</span>
                      </span>
                      <a
                        href={session.resourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1 font-mono"
                      >
                        <span>Furo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="font-mono text-[11px] text-slate-300 truncate">{session.resourceLink}</p>
                  </div>
                )}

                {session.instructorInstructions && (
                  <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <strong className="text-slate-300">Hagidda Macallinka Lab-ka:</strong> {session.instructorInstructions}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  {session.assignedTeacherName ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Macallinka Lab-ka: {session.assignedTeacherName}</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">Lama xilsaarin weli (Pending)</span>
                  )}
                </div>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                  title="Tirtir fadhigan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Lab Class Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Daabac Codsi Fadhi Cusub (Subject Teacher)</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Magaca Maaddada (Course Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSC 312: Database Systems & PostgreSQL"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category-ga *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Programming">Programming Lab</option>
                    <option value="Technical">Technical / Cisco Lab</option>
                    <option value="Multimedia">Multimedia & Video Studio</option>
                    <option value="Cybersecurity">Cybersecurity Lab</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shift-ka *</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="MORNING">Morning (07:00 AM – 12:00 PM)</option>
                    <option value="AFTERNOON">Afternoon (04:00 PM – 09:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lab Room</label>
                  <input
                    type="text"
                    value={labRoom}
                    onChange={(e) => setLabRoom(e.target.value)}
                    placeholder="e.g. LAB-101"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resource Link / Lab Sheet URL</label>
                  <input
                    type="url"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    placeholder="https://drive.google.com/... ama GitHub link"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Qalabka Loo Baahan Yahay</label>
                <textarea
                  rows={2}
                  value={hardwareReqs}
                  onChange={(e) => setHardwareReqs(e.target.value)}
                  placeholder="e.g. 25 Workstations with pgAdmin, Projector..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fariinta Macallinka Lab-ka (Instructions)</label>
                <input
                  type="text"
                  value={instructorInstructions}
                  onChange={(e) => setInstructorInstructions(e.target.value)}
                  placeholder="e.g. Ardayda ku hag inay furtaan Lab 3"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Daabac Codsiga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTeacherDashboard;
