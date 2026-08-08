"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Sparkles,
  AlertTriangle,
  Pin,
  Clock,
  Radio,
  User,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import { Announcement, UserRole } from "@/types/clhms";
import { supabase } from "@/lib/supabase/client";

interface RealtimeNoticeboardProps {
  activeRole: UserRole;
  currentUserId?: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-live-01",
    author_id: "head-01",
    title: "Shift-ka Galabta: Cisco BGP Transit Labs",
    content: "Dhammaan macalimiinta galabta fadlan hubiya in patch cables-ka ay diyaar u yihiin fadhiga Cisco BGP ka hor 04:00 PM EAT.",
    priority: "HIGH",
    is_pinned: true,
    created_at: "Hadda (2 min ago)",
  },
  {
    id: "ann-live-02",
    author_id: "admin-01",
    title: "Dayactirka Qalabka Lab 204",
    content: "Switch-ka port 12-24 ee Lab 204 waxaa lagu samaynayaa beddelaad patch cables cusub si loo suurtageliyo gigabit link.",
    priority: "NORMAL",
    is_pinned: false,
    created_at: "Saacad ka hor",
  },
  {
    id: "ann-live-03",
    author_id: "admin-01",
    title: "Jadwalka Imtixaanaadka Lab-ka ee Bishan",
    content: "Fadlan dhammaan macalimiintu ha soo gudbiyaan xogta hardware-ka loo baahan yahay ugu dambayn 15-ka bishan.",
    priority: "LOW",
    is_pinned: false,
    created_at: "Shalay",
  },
];

export const RealtimeNoticeboard: React.FC<RealtimeNoticeboardProps> = ({
  activeRole,
  currentUserId = "00000000-0000-0000-0000-000000000000",
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newPriority, setNewPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newArrivalPing, setNewArrivalPing] = useState<boolean>(false);

  const canBroadcast = activeRole === "ROLE_ADMIN" || activeRole === "ROLE_LAB_HEAD";

  // 1. Supabase Realtime Subscription Channel
  useEffect(() => {
    // Initial fetch from live Supabase table
    const fetchLiveAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.log("Using cached initial announcements feed");
      }
    };

    fetchLiveAnnouncements();

    // 2. Realtime Channel Listener
    const channel = supabase
      .channel("clhms-announcements-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRecord = payload.new as Announcement;
            setAnnouncements((prev) => [newRecord, ...prev]);
            setNewArrivalPing(true);
            setTimeout(() => setNewArrivalPing(false), 3000);
          } else if (payload.eventType === "DELETE") {
            setAnnouncements((prev) => prev.filter((a) => a.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Announcement;
            setAnnouncements((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Publish New Announcement
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newAnn: Partial<Announcement> = {
        title: newTitle.trim(),
        content: newContent.trim(),
        priority: newPriority,
        is_pinned: isPinned,
        author_id: currentUserId,
      };

      // Insert into live Supabase table
      const { data, error } = await supabase
        .from("announcements")
        .insert([newAnn] as any)
        .select()
        .single();

      const createdItem: Announcement = data || {
        id: `ann-${Date.now()}`,
        author_id: currentUserId,
        title: newTitle.trim(),
        content: newContent.trim(),
        priority: newPriority,
        is_pinned: isPinned,
        created_at: "Just now",
      };

      // Optimistic state update
      setAnnouncements((prev) => [createdItem, ...prev]);
      setNewTitle("");
      setNewContent("");
      setIsBroadcasting(false);
      setNewArrivalPing(true);
      setTimeout(() => setNewArrivalPing(false), 3000);
    } catch (err: any) {
      console.error("Announcement insert error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      {/* Top Noticeboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Supabase Realtime Feed Channel
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            <span>Central Announcements & Noticeboard</span>
            {newArrivalPing && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/50 animate-bounce">
                New Alert!
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ogeysiisyada tooska ah ee shaashadda ku soo dhacaya bilaa page refresh (0 latency).
          </p>
        </div>

        {canBroadcast && (
          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isBroadcasting ? "Xidh Foomka" : "Baahi Ogeysiis Cusub"}</span>
          </button>
        )}
      </div>

      {/* Broadcast Form for Admins and Lab Heads */}
      {isBroadcasting && canBroadcast && (
        <form
          onSubmit={handlePublish}
          className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Ogeysiis Cusub u Dir Dhammaan Macalimiinta Lab-ka</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Realtime Broadcast</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cinwaanka Ogeysiiska (Title) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cisco BGP Afternoon Session Requirements"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Heerka Degdegga (Priority)
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="LOW">LOW (Caadi)</option>
                <option value="NORMAL">NORMAL (Dhexdhexaad)</option>
                <option value="HIGH">HIGH (Muhiim)</option>
                <option value="URGENT">URGENT (Degdeg)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Fariinta / Qoraalka Ogeysiiska *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Qor faahfaahinta ogeysiiska aad u dirayso shaqaalaha lab-ka..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <span>Ku dhaji dusha sare (Pin Announcement to Top)</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcasting(false)}
                className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Ka noqo
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Baahi Realtime</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((ann) => {
          const isUrgent = ann.priority === "URGENT" || ann.priority === "HIGH";
          return (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between space-y-3 ${
                ann.is_pinned
                  ? "border-cyan-500/50 bg-gradient-to-br from-cyan-950/30 to-slate-900 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30"
                  : isUrgent
                  ? "border-rose-900/60 bg-gradient-to-br from-rose-950/30 to-slate-900"
                  : "border-slate-800 bg-slate-950/80 hover:border-slate-700"
              }`}
            >
              {/* Header Badges */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {ann.is_pinned && (
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

                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{ann.created_at}</span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white pt-1">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-slate-500" />
                  <span>Author: Lab Administration</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealtimeNoticeboard;
