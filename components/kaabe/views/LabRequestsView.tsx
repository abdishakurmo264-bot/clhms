"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Link2,
} from "lucide-react";
import { LabCourseRequest, KaabeCategory, ShiftWindow } from "@/types/kaabe";

interface LabRequestsViewProps {
  sessions: LabCourseRequest[];
  onAddSession: (newSession: Partial<LabCourseRequest>) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const LabRequestsView: React.FC<LabRequestsViewProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Form State
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("CSC 312");
  const [category, setCategory] = useState<KaabeCategory>("Programming Lab");
  const [shift, setShift] = useState<ShiftWindow>("MORNING");
  const [labRoom, setLabRoom] = useState<string>("LAB-101 (Programming)");
  const [hardwareNeeds, setHardwareNeeds] = useState<string>("");
  const [resourceLink, setResourceLink] = useState<string>("");
  const [lecturerNotes, setLecturerNotes] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    onAddSession({
      courseCode: courseCode.trim() || "CSC 300",
      courseTitle: courseTitle.trim(),
      category,
      shift,
      labRoom,
      hardwareNeeds: hardwareNeeds.trim() || "Standard Lab Workstations & Internet",
      resourceLink: resourceLink.trim() || undefined,
      lecturerNotes: lecturerNotes.trim() || undefined,
      lecturerName: "Prof. Ali Nur (Lecturer)",
      status: "PENDING",
      createdAt: "Just now",
    });

    setCourseTitle("");
    setHardwareNeeds("");
    setResourceLink("");
    setLecturerNotes("");
    setIsModalOpen(false);
    setFeedback("Lab class request published successfully (PENDING ASSIGNMENT)!");
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.labRoom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <BookOpen className="h-4 w-4" />
            <span>Course Lecturer Lab Publishing Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Publish & Manage Academic Laboratory Classes
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Subject teachers publish upcoming lab modules, attach Google Drive or GitHub resource links, and request specific equipment.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Publish New Lab Class</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Course Title or Lab Room..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["ALL", "Programming Lab", "Technical & Cisco Lab", "Multimedia Studio", "Cybersecurity Lab"].map((cat) => (
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
          ))}
        </div>
      </div>

      {/* Grid of Published Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">{session.courseTitle}</span>
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
                    Room: <strong className="text-slate-200">{session.labRoom}</strong> • Shift: {session.shift} • By: {session.lecturerName}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                  {session.category}
                </span>
              </div>

              {/* Hardware Requirements */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Required Equipment & Tools:</span>
                <p>{session.hardwareNeeds}</p>
              </div>

              {/* Resource Link */}
              {session.resourceLink && (
                <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      <span>Course Resource / Lab Sheet Link:</span>
                    </span>
                    <a
                      href={session.resourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline text-[11px] font-mono flex items-center gap-1"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="font-mono text-[11px] text-slate-300 truncate">{session.resourceLink}</p>
                </div>
              )}

              {session.lecturerNotes && (
                <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-cyan-300">Lecturer Instructions:</strong> {session.lecturerNotes}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                {session.assignedTeacherName ? (
                  <span className="text-emerald-400 font-medium">
                    Assigned Instructor: {session.assignedTeacherName}
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Pending Assignment by Chairman</span>
                )}
              </div>

              <button
                onClick={() => onDeleteSession(session.id)}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                title="Delete Course Request"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Publish Lab Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Publish New Lab Class Request</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course Title & Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSC 312: Advanced Database Systems & PostgreSQL"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lab Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Programming Lab">Programming Lab</option>
                    <option value="Technical & Cisco Lab">Technical & Cisco Lab</option>
                    <option value="Multimedia Studio">Multimedia Studio</option>
                    <option value="Cybersecurity Lab">Cybersecurity Lab</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shift Window *</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Target Lab Room *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LAB-101, LAB-204"
                    value={labRoom}
                    onChange={(e) => setLabRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resource Link / Lab Sheet URL</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or GitHub link"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hardware / Tool Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 25 Workstations with pgAdmin runtime, Projector..."
                  value={hardwareNeeds}
                  onChange={(e) => setHardwareNeeds(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Instructions for Assigned Lab Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Guide students through Chapter 4 practical database setup."
                  value={lecturerNotes}
                  onChange={(e) => setLecturerNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Publish Lab Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabRequestsView;
