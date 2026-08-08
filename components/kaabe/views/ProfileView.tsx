"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Layers,
  Edit3,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { UserAccount } from "@/types/kaabe";

interface ProfileViewProps {
  currentUser: UserAccount;
  onUpdateProfile: (updated: Partial<UserAccount>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>(currentUser.fullName);
  const [phone, setPhone] = useState<string>(currentUser.phone || "+252 61 500 0000");
  const [bio, setBio] = useState<string>(currentUser.bio || "Staff member active in faculty lab operations.");
  const [skills, setSkills] = useState<string>(currentUser.skills.join(", "));
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      skills: skills.split(",").map((s) => s.trim()),
    });
    setIsEditing(false);
    setFeedback("Profile information successfully updated!");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/40">
            {currentUser.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {currentUser.role.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Employee ID: <strong className="text-slate-200">{currentUser.employeeId}</strong> • {currentUser.department}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Edit3 className="h-4 w-4 text-cyan-400" />
          <span>{isEditing ? "Cancel Edit" : "Edit Profile Info"}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left Column: Account Info & Bio */}
        <div className="lg:col-span-2 space-y-4">
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Edit Personal & Professional Profile</h3>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skills & Specializations (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Professional Information</h3>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bio & Overview:</span>
                <p className="text-slate-300 leading-relaxed">{currentUser.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Email Address</span>
                  <div className="font-mono text-cyan-300 font-bold">{currentUser.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Phone Contact</span>
                  <div className="text-slate-200 font-bold">{currentUser.phone || "—"}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Assigned Shift</span>
                  <div className="text-amber-300 font-bold">{currentUser.shift} (Subax / Galab)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Account Status</span>
                  <div className="text-emerald-400 font-bold">{currentUser.status} (Verified)</div>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-300 mb-1.5">Specialized Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 font-mono text-[11px] border border-cyan-800/40">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Workload Meter & Performance Stats */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Active Workload Capacity</h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Assigned Classes:</span>
                <span className="text-base font-extrabold text-cyan-300 font-mono">
                  {currentUser.activeLoadCount || 0} / 4 Classes
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (currentUser.activeLoadCount || 0) >= 3 ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${((currentUser.activeLoadCount || 0) / 4) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Automatic decrement (-1) is applied when you mark an assigned lab session completed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
