"use client";

import React, { useState, useTransition } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Link2,
  FileText,
  Loader2,
} from "lucide-react";
import { CourseSessionRequest, LabCategory, ShiftType } from "@/types/clhms";

interface LecturerPublishingPortalProps {
  sessions: CourseSessionRequest[];
  onAddSession: (newSession: Partial<CourseSessionRequest>) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const LecturerPublishingPortal: React.FC<LecturerPublishingPortalProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Form State
  const [courseName, setCourseName] = useState<string>("");
  const [category, setCategory] = useState<LabCategory>("Programming");
  const [shift, setShift] = useState<ShiftType>("MORNING");
  const [labRoom, setLabRoom] = useState<string>("LAB-101");
  const [hardwareReqs, setHardwareReqs] = useState<string>("");
  const [resourceLink, setResourceLink] = useState<string>("");
  const [instructorInstructions, setInstructorInstructions] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    startTransition(() => {
      onAddSession({
        courseName: courseName.trim(),
        category,
        shift,
        labRoom,
        hardwareRequirements: hardwareReqs.trim() || "Standard Lab PC Setup",
        resourceLink: resourceLink.trim() || undefined,
        instructorInstructions: instructorInstructions.trim() || undefined,
        lecturerName: "Ust. Cali Nuur (Academic Lecturer)",
        status: "PENDING",
        date: new Date().toLocaleDateString(),
        createdAt: "Hadda",
      });

      // Reset form
      setCourseName("");
      setHardwareReqs("");
      setResourceLink("");
      setInstructorInstructions("");
      setIsModalOpen(false);
    });
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.labRoom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <BookOpen className="h-4 w-4" />
            <span>Lecturer Lab Publishing Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Daabacaadda & Maamulka Kulamada Lab-ka
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Macallimiinta maadooyinku waxay halkan ku soo daabacaan fadhiyada cusub, qalabka loo baahan yahay, iyo link-ga duruusta.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Daabac Fadhi Cusub (New Class)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Raadi maaddo ama qolka lab-ka (e.g. 'Database', 'LAB-204')..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["ALL", "Programming", "Technical", "Multimedia", "Cybersecurity", "AI & Robotics"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  categoryFilter === cat
                    ? "bg-cyan-600 text-white font-bold"
                    : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid of Published Sessions with Full CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Badge */}
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

              {/* Hardware Requirements */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Qalabka Loo Baahan Yahay:</span>
                <p>{session.hardwareRequirements}</p>
              </div>

              {/* Resource Link & Instructions */}
              {session.resourceLink && (
                <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      <span>Resource Link / Lab Sheet:</span>
                    </span>
                    <a
                      href={session.resourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1 font-mono"
                    >
                      <span>Furo Link-ga</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="font-mono text-[11px] text-slate-300 truncate">{session.resourceLink}</p>
                </div>
              )}

              {session.instructorInstructions && (
                <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-300">Fariin/Hagid:</strong> {session.instructorInstructions}
                </div>
              )}
            </div>

            {/* Footer with Assignment status & Delete button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                {session.assignedTeacherName ? (
                  <span className="text-emerald-400 font-medium">
                    Macallinka: {session.assignedTeacherName}
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Lama xilsaarin weli</span>
                )}
              </div>

              {/* Delete / Cancel action */}
              <button
                onClick={() => onDeleteSession(session.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                title="Tirtir fadhigan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Course Class Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <BookOpen className="h-4 w-4" />
                <span>Daabac Codsi Fadhi Cusub (New Lab Session Request)</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Magaca Maaddada & Cutubka (Course & Topic Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSC 312: Advanced Database Systems & PostgreSQL"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category-ga Lab-ka *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Programming">Programming Lab</option>
                    <option value="Technical">Technical / Cisco Lab</option>
                    <option value="Multimedia">Multimedia & Video Studio</option>
                    <option value="Cybersecurity">Cybersecurity Lab</option>
                    <option value="AI & Robotics">AI & Robotics Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shift-ka *</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="MORNING">Morning (07:00 AM – 12:00 PM)</option>
                    <option value="AFTERNOON">Afternoon (04:00 PM – 09:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Qolka Lab-ka (Room)</label>
                  <input
                    type="text"
                    value={labRoom}
                    onChange={(e) => setLabRoom(e.target.value)}
                    placeholder="e.g. LAB-101, LAB-204"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resource Link / Data URL</label>
                  <input
                    type="url"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    placeholder="https://drive.google.com/... ama GitHub link"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Qalabka Gaarka ah ee Loo Baahan Yahay
                </label>
                <textarea
                  rows={2}
                  value={hardwareReqs}
                  onChange={(e) => setHardwareReqs(e.target.value)}
                  placeholder="e.g. 25 Workstations with pgAdmin, 2 Projectors, 4 Patch Cables..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Fariinta & Hagidda Macallinka Lab-ka (Instructions for Instructor)
                </label>
                <input
                  type="text"
                  value={instructorInstructions}
                  onChange={(e) => setInstructorInstructions(e.target.value)}
                  placeholder="e.g. Ardayda ku hag inaad furto pgAdmin oo ku shubto script-ka seed.sql"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Daabac Fadhiga</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerPublishingPortal;
