"use client";

import React, { useState } from "react";
import {
  Bell,
  Send,
  Trash2,
  Pin,
  Sparkles,
  Plus,
  Radio,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { CampusAnnouncement, KaabeRole } from "@/types/kaabe";

interface AnnouncementsViewProps {
  currentRole: KaabeRole;
  announcements: CampusAnnouncement[];
  onBroadcast: (ann: Partial<CampusAnnouncement>) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  currentRole,
  announcements,
  onBroadcast,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Cisco BGP Routing Labs & Patch Cabling");
  const [content, setContent] = useState<string>("");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("HIGH");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const canBroadcast = currentRole === "SUPER_ADMIN" || currentRole === "LAB_CHAIRMAN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onBroadcast({
      title: title.trim(),
      content: content.trim(),
      priority,
      isPinned,
      authorName: currentRole === "SUPER_ADMIN" ? "System Administrator" : "Dr. Abdirahman Ali (Chairman)",
      authorRole: currentRole,
      createdAt: "Just now",
    });

    setTitle("");
    setContent("");
    setIsModalOpen(false);
    setFeedback("Announcement broadcasted successfully to all faculty staff!");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>Campus Noticeboard & Messaging</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Faculty & Laboratory Announcements
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Official operational alerts, hardware maintenance notifications, and scheduling updates for teaching staff.
          </p>
        </div>

        {canBroadcast && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/60 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Broadcast Announcement</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Announcements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((ann) => {
          const isUrgent = ann.priority === "URGENT" || ann.priority === "HIGH";
          return (
            <div
              key={ann.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 flex flex-col justify-between ${
                ann.isPinned
                  ? "border-cyan-500/60 bg-gradient-to-br from-cyan-950/30 to-slate-900 ring-1 ring-cyan-500/40 shadow-xl"
                  : isUrgent
                  ? "border-rose-900/60 bg-gradient-to-br from-rose-950/30 to-slate-900"
                  : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {ann.isPinned && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        <Pin className="h-3 w-3" />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                        ann.priority === "URGENT"
                          ? "bg-rose-950 text-rose-300 border-rose-700/50"
                          : ann.priority === "HIGH"
                          ? "bg-amber-950 text-amber-300 border-amber-700/50"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">{ann.createdAt}</span>
                </div>

                <h3 className="font-bold text-sm text-white pt-1">{ann.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>By: {ann.authorName}</span>
                {canBroadcast && (
                  <button
                    onClick={() => onDelete(ann.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Broadcast Message */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                <span>Broadcast New Campus Announcement</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco BGP Afternoon Session Requirements"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Urgency Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="LOW">LOW Priority</option>
                  <option value="NORMAL">NORMAL Priority</option>
                  <option value="HIGH">HIGH Priority</option>
                  <option value="URGENT">URGENT Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter notice details for faculty instructors..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950"
                  />
                  <span>Pin Announcement to Top</span>
                </label>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold">
                    Broadcast Notice
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsView;
