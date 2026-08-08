"use client";

import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Database,
  Cloud,
  ShieldCheck,
  Building,
  Clock,
  Sparkles,
  Save,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const [collegeName, setCollegeName] = useState<string>("Zoom International College (ZIC)");
  const [academicSemester, setAcademicSemester] = useState<string>("Semester 2 - Academic Year 2026");
  const [maxClassLoad, setMaxClassLoad] = useState<number>(4);
  const [morningShiftTime, setMorningShiftTime] = useState<string>("07:00 AM – 12:00 PM EAT");
  const [afternoonShiftTime, setAfternoonShiftTime] = useState<string>("04:00 PM – 09:00 PM EAT");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("System settings and college governance parameters saved successfully!");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Sliders className="h-4 w-4" />
            <span>System Governance & Academic Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Zoom International College (ZIC) Portal Settings
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure institutional parameters, max instructor workload limits, semester schedules, and database connectivity.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2-Cols: General Institutional Configuration */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="h-4 w-4 text-cyan-400" />
            <span>Institutional & Academic Rules</span>
          </h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">College Official Name *</label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Academic Term *</label>
              <input
                type="text"
                required
                value={academicSemester}
                onChange={(e) => setAcademicSemester(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Max Class Load Per Teacher *</label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxClassLoad}
                onChange={(e) => setMaxClassLoad(parseInt(e.target.value) || 4)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Morning Shift Window</label>
              <input
                type="text"
                value={morningShiftTime}
                onChange={(e) => setMorningShiftTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Afternoon Shift Window</label>
              <input
                type="text"
                value={afternoonShiftTime}
                onChange={(e) => setAfternoonShiftTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/60 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Right 1-Col: Infrastructure Status Tiles */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>Infrastructure Health</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Database Host</span>
              <div className="font-mono text-cyan-300 font-bold">kwognmwltcvyjtdsydnx.supabase.co</div>
              <div className="text-[10px] text-emerald-400">Region: eu-west-2 • RLS Protected</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Monthly Operational Cost</span>
              <div className="font-extrabold text-emerald-400 text-base">$0.00 / Month</div>
              <div className="text-[10px] text-slate-500">Free Tier Optimization</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">Dual-Shift Backup Schedule</span>
              <div className="font-mono text-white">10:00 UTC & 19:00 UTC (Daily)</div>
              <div className="text-[10px] text-amber-300">pg_dump gzip ➔ Google Drive API</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
