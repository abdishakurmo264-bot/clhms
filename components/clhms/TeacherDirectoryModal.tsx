"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  UserCheck,
  Code2,
  Network,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  Award,
  XCircle,
} from "lucide-react";
import { InstructorProfile } from "@/types/clhms";

interface TeacherDirectoryModalProps {
  teachers: InstructorProfile[];
  onOpenTeacherProfile?: (teacher: InstructorProfile) => void;
}

export const TeacherDirectoryModal: React.FC<TeacherDirectoryModalProps> = ({
  teachers,
  onOpenTeacherProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<InstructorProfile | null>(null);

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Users className="h-4 w-4" />
            <span>Instructor Directory & Skill Profiles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Liiska Macalimiinta Lab-yada & Profile-yadooda
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Guji macallin kasta si aad u aragto takhasuskiisa, fadhiyada u socda, iyo tariikhda shaqadiisa.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Raadi macallin ama takhasus..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher)}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition-all shadow-xl space-y-4 cursor-pointer group"
          >
            {/* Top Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  {teacher.fullName.slice(4, 6).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {teacher.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-400">{teacher.department}</p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  teacher.isOnDuty
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {teacher.isOnDuty ? "ON-DUTY" : "OFF-DUTY"}
              </span>
            </div>

            {/* Specialization & Shift */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-cyan-300 font-mono border border-slate-800">
                {teacher.category}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                Shift: {teacher.shift}
              </span>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1">
              {teacher.skills.slice(0, 4).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Active Class Load Progress */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Class Load Capacity:</span>
                <span className="font-bold text-cyan-300">{teacher.activeLoadCount} / 4 Classes</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    teacher.activeLoadCount >= 3 ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${(teacher.activeLoadCount / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Profile Detail Drawer / Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-lg">
                  {selectedTeacher.fullName.slice(4, 6).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedTeacher.fullName}</h3>
                  <p className="text-xs text-slate-400">{selectedTeacher.department}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Bio & Khibrad:</span>
                <p className="text-slate-300 leading-relaxed">{selectedTeacher.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Email:</span>
                  <div className="font-mono text-cyan-300 truncate">{selectedTeacher.email}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Shift:</span>
                  <div className="font-bold text-slate-200">{selectedTeacher.shift}</div>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Xirfadaha & Qalabka uu Khibradda u Leeyahay:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 font-mono text-[11px] border border-cyan-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs">Current Workload:</span>
                  <p className="text-[10px] text-slate-400">Classes assigned currently</p>
                </div>
                <span className="text-base font-extrabold text-cyan-300 font-mono">
                  {selectedTeacher.activeLoadCount} / 4 Load
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Xidh Profile-ka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDirectoryModal;
