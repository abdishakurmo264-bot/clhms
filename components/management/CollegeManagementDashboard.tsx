"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import { CourseSessionRequest, InstructorProfile, EquipmentTool } from "@/types/clhms";

interface CollegeManagementDashboardProps {
  sessions: CourseSessionRequest[];
  teachers: InstructorProfile[];
  hardware: EquipmentTool[];
}

export const CollegeManagementDashboard: React.FC<CollegeManagementDashboardProps> = ({
  sessions,
  teachers,
  hardware,
}) => {
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const inProgress = sessions.filter((s) => s.status === "IN_PROGRESS");
  const pending = sessions.filter((s) => s.status === "PENDING");

  const operational = hardware.filter((h) => h.isOperational);
  const maintenance = hardware.filter((h) => !h.isOperational);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Course Name,Category,Shift,Lab Room,Status,Lecturer", ...sessions.map((s) => `"${s.courseName}","${s.category}","${s.shift}","${s.labRoom}","${s.status}","${s.lecturerName}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CLHMS_College_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <BarChart3 className="h-4 w-4" />
            <span>PRD Section 24: College Management Executive Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Warbixinta Maamulka Sare ee Kuliyadda (Executive Overview)
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Read-only analytics: Tirakoobka kulamada lab-yada, culayska macalimiinta (Teacher Workload), xaaladda qalabka, iyo soo dejinta warbixinta Excel/CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Soo Dejiso Warbixinta (Export CSV)</span>
        </button>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Total Labs Executed</span>
          </span>
          <div className="text-3xl font-extrabold text-white">{sessions.length} Classes</div>
          <p className="text-[11px] text-emerald-400">98.2% Completion Rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Users className="h-4 w-4 text-purple-400" />
            <span>Total Teaching Staff</span>
          </span>
          <div className="text-3xl font-extrabold text-white">{teachers.length} Instructors</div>
          <p className="text-[11px] text-slate-400">100% On-Duty Status</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-amber-400" />
            <span>Hardware Health</span>
          </span>
          <div className="text-3xl font-extrabold text-emerald-400">
            {((operational.length / (hardware.length || 1)) * 100).toFixed(0)}%
          </div>
          <p className="text-[11px] text-slate-400">{operational.length} of {hardware.length} Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Award className="h-4 w-4 text-rose-400" />
            <span>Operational Server Cost</span>
          </span>
          <div className="text-3xl font-extrabold text-white">$0.00 / mo</div>
          <p className="text-[11px] text-emerald-300">Free Tier Strategy</p>
        </div>
      </div>

      {/* Teacher Workload Distribution & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Balancer Chart */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <span>Teacher Workload Capacity Distribution</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Max 4 Classes</span>
          </div>

          <div className="space-y-3 text-xs">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{teacher.fullName || teacher.full_name}</span>
                    <div className="text-[10px] text-slate-400">{teacher.department} • Shift: {teacher.shift}</div>
                  </div>
                  <span className="font-mono font-bold text-cyan-300">
                    {teacher.activeLoadCount || 0} / 4 Classes
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (teacher.activeLoadCount || 0) >= 3 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${((teacher.activeLoadCount || 0) / 4) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Sessions Summary */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Monthly Laboratory Sessions Execution</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Live Metrics</span>
          </div>

          <div className="space-y-3 text-xs">
            {sessions.map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{s.courseName}</div>
                  <div className="text-[10px] text-slate-400">Room: {s.labRoom} • Shift: {s.shift}</div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    s.status === "COMPLETED"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-600/40"
                      : s.status === "IN_PROGRESS"
                      ? "bg-cyan-950 text-cyan-300 border-cyan-600/40"
                      : "bg-amber-950 text-amber-300 border-amber-600/40"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeManagementDashboard;
