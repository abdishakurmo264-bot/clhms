"use client";

import React, { useState } from "react";
import {
  Printer,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Cpu,
  Users,
  CheckCircle2,
  Building,
} from "lucide-react";
import {
  HardwareToolItem,
  UserAccount,
  LabCourseRequest,
} from "@/types/kaabe";

interface ReportsViewProps {
  hardware: HardwareToolItem[];
  teachers: UserAccount[];
  sessions: LabCourseRequest[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  hardware,
  teachers,
  sessions,
}) => {
  const [selectedReport, setSelectedReport] = useState<"hardware" | "teachers" | "sessions">("hardware");

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let rows: string[] = [];
    if (selectedReport === "hardware") {
      rows = [
        "Asset Name,Serial Number,Category,Lab Room,Status,Last Inspected",
        ...hardware.map(
          (h) => `"${h.assetName}","${h.serialNumber}","${h.category}","${h.labRoom}","${h.status}","${h.lastVerifiedAt}"`
        ),
      ];
    } else if (selectedReport === "teachers") {
      rows = [
        "Full Name,Employee ID,Email,Role,Department,Active Load,Shift,Status",
        ...teachers.map(
          (t) => `"${t.fullName}","${t.employeeId}","${t.email}","${t.role}","${t.department}","${t.activeLoadCount || 0} / 4 Classes","${t.shift}","${t.status}"`
        ),
      ];
    } else {
      rows = [
        "Course Code,Course Title,Category,Lab Room,Shift,Lecturer,Assigned Instructor,Status",
        ...sessions.map(
          (s) => `"${s.courseCode}","${s.courseTitle}","${s.category}","${s.labRoom}","${s.shift}","${s.lecturerName}","${s.assignedTeacherName || "Unassigned"}","${s.status}"`
        ),
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `ZIC_${selectedReport.toUpperCase()}_REPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <FileSpreadsheet className="h-4 w-4" />
            <span>ZIC Official A4 Reports & Export Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Faculty & Laboratory Official Documentation
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Generate and print official Zoom International College (ZIC) reports formatted cleanly for standard A4 paper and PDF export.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="h-4 w-4 text-orange-400" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print A4 Document</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          onClick={() => setSelectedReport("hardware")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedReport === "hardware"
              ? "bg-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Hardware & Tools Inventory Report</span>
        </button>

        <button
          onClick={() => setSelectedReport("teachers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedReport === "teachers"
              ? "bg-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Teaching Staff & Workload Report</span>
        </button>

        <button
          onClick={() => setSelectedReport("sessions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedReport === "sessions"
              ? "bg-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Lab Sessions & Attendance Schedule</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* A4 PRINTABLE DOCUMENT CONTAINER */}
      {/* ============================================================== */}
      <div className="a4-print-container p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 text-slate-100 shadow-2xl space-y-6">
        
        {/* Official College Letterhead */}
        <div className="a4-letterhead border-b-2 border-orange-500 pb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/zoom_college_logo.jpg"
              alt="Zoom International College Logo"
              className="h-16 w-16 object-contain rounded-full ring-2 ring-orange-500 p-0.5 bg-white"
              onError={(e) => {
                (e.currentTarget as any).style.display = "none";
              }}
            />
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase">
                Zoom International College (ZIC)
              </h2>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                Faculty of Computing, Information Technology & Media
              </p>
              <p className="text-[11px] text-slate-400">Official Laboratory & Operations Department</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-0.5">
            <div><strong>Report Type:</strong> <span className="text-white uppercase">{selectedReport}</span></div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div><strong>Verification:</strong> <span className="text-emerald-400 font-bold">Authorized Sign-Off</span></div>
          </div>
        </div>

        {/* 1. Hardware Report Table */}
        {selectedReport === "hardware" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Physical Hardware & Equipment Inventory</h3>
              <span className="text-xs text-slate-400">Total Items: {hardware.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-300 font-bold">
                    <th className="p-3">#</th>
                    <th className="p-3">Asset Description</th>
                    <th className="p-3">Serial Number</th>
                    <th className="p-3">Lab Room</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Condition Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {hardware.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{item.assetName}</td>
                      <td className="p-3 font-mono text-slate-400">{item.serialNumber}</td>
                      <td className="p-3">{item.labRoom}</td>
                      <td className="p-3 font-mono text-cyan-400">{item.category}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "OPERATIONAL"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : "bg-rose-950 text-rose-300 border border-rose-500/40"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Teaching Staff Report Table */}
        {selectedReport === "teachers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Teaching Staff Directory & Workload Summary</h3>
              <span className="text-xs text-slate-400">Total Staff: {teachers.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-300 font-bold">
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Staff Full Name</th>
                    <th className="p-3">Role Assigned</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3 text-right">Workload Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {teachers.map((t) => (
                    <tr key={t.id}>
                      <td className="p-3 font-mono text-orange-400 font-bold">{t.employeeId}</td>
                      <td className="p-3 font-bold text-white">{t.fullName}</td>
                      <td className="p-3 font-mono text-cyan-300">{t.role.replace("_", " ")}</td>
                      <td className="p-3">{t.department}</td>
                      <td className="p-3">{t.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        {t.activeLoadCount || 0} / 4 Classes
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Lab Sessions & Schedule Report Table */}
        {selectedReport === "sessions" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Academic Laboratory Class Schedules & Execution</h3>
              <span className="text-xs text-slate-400">Total Classes: {sessions.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-300 font-bold">
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Room</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Course Lecturer</th>
                    <th className="p-3">Assigned Lab Teacher</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="p-3 font-bold text-white">{s.courseTitle}</td>
                      <td className="p-3 font-mono text-cyan-400">{s.category}</td>
                      <td className="p-3">{s.labRoom}</td>
                      <td className="p-3 font-semibold text-amber-300">{s.shift}</td>
                      <td className="p-3">{s.lecturerName}</td>
                      <td className="p-3 font-semibold text-emerald-400">{s.assignedTeacherName || "Unassigned"}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === "COMPLETED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                              : s.status === "IN_PROGRESS"
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-600/40"
                              : "bg-amber-950 text-amber-300 border border-amber-600/40"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Document Footer with Signature Lines */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-400">
          <div>
            <div className="h-10 border-b border-dashed border-slate-600"></div>
            <div className="pt-2 font-bold text-white">Dean of Academic Affairs / Lab Chairman</div>
            <div className="text-[10px]">Zoom International College Signature & Stamp</div>
          </div>

          <div className="text-right">
            <div className="h-10 border-b border-dashed border-slate-600"></div>
            <div className="pt-2 font-bold text-white">System Administrator Authorization</div>
            <div className="text-[10px]">Database Integrity Verified (Supabase RLS)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
