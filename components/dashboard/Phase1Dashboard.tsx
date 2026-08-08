"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  UserCheck,
  Wrench,
  BookOpen,
  Send,
  Plus,
  RefreshCw,
  Bell,
  Code2,
  Network,
  Calendar,
} from "lucide-react";
import {
  UserRole,
  ShiftType,
  LabSpecialization,
  Profile,
  Hardware,
  Announcement,
  SPECIALIZATION_DETAILS,
  SHIFT_SCHEDULES,
} from "@/types/clhms";
import DailyAuditModal from "@/components/DailyAuditModal";

interface Phase1DashboardProps {
  activeRole: UserRole;
  currentShift?: ShiftType;
}

// Sample initial data matching PRD specifications
const MOCK_TEACHERS: Profile[] = [
  {
    id: "inst-prog-01",
    full_name: "Eng. Bilal Axmed",
    email: "bilal.ahmed@college.edu",
    role: "ROLE_LAB_TEACHER",
    specialization: "PROGRAMMING",
    shift: "MORNING",
    active_load_count: 2,
    department: "Computer Science & Software",
    is_on_duty: true,
    skills: ["HTML", "CSS", "SQL", "WordPress", "C++", "C#"],
    created_at: new Date().toISOString(),
  },
  {
    id: "inst-tech-02",
    full_name: "Eng. Sacdiya Maxamuud",
    email: "sacdiya.m@college.edu",
    role: "ROLE_LAB_TEACHER",
    specialization: "TECHNICAL",
    shift: "AFTERNOON",
    active_load_count: 1,
    department: "Network Engineering & Telecom",
    is_on_duty: true,
    skills: ["Network Hardware", "Cisco Routing", "BGP", "PC Components", "Maintenance"],
    created_at: new Date().toISOString(),
  },
  {
    id: "inst-hyb-03",
    full_name: "Ust. Xasan Geedi",
    email: "xasan.geedi@college.edu",
    role: "ROLE_LAB_TEACHER",
    specialization: "HYBRID",
    shift: "BOTH",
    active_load_count: 3,
    department: "Information Systems",
    is_on_duty: false,
    skills: ["DevOps", "Cisco Routing", "SQL", "Linux Kernel"],
    created_at: new Date().toISOString(),
  },
];

const MOCK_HARDWARE: Hardware[] = [
  {
    id: "hw-01",
    asset_name: "Workstation PC - Dell OptiPlex 7090",
    serial_number: "SN-LAB101-PC01",
    lab_room: "LAB-101 (Programming)",
    category: "Workstation",
    is_operational: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "hw-02",
    asset_name: "Cisco 2901 Integrated Services Router",
    serial_number: "SN-CISCO-RTR-04",
    lab_room: "LAB-204 (Cisco Networks)",
    category: "Cisco Routing",
    is_operational: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "hw-03",
    asset_name: "Core Switch Cisco Catalyst 2960",
    serial_number: "SN-SW-CAT2960-A",
    lab_room: "LAB-204 (Cisco Networks)",
    category: "Network Hardware",
    is_operational: false, // Flagged for maintenance
    created_at: new Date().toISOString(),
  },
  {
    id: "hw-04",
    asset_name: "Epson Overhead Laser Projector 4K",
    serial_number: "SN-PRJ-EPS-09",
    lab_room: "LAB-102 (General Lab)",
    category: "Peripherals",
    is_operational: true,
    created_at: new Date().toISOString(),
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    author_id: "head-01",
    title: "Xaqiijinta Audit-ka Shift-ka Galabta (04:00 PM EAT)",
    content: "Dhammaan macalimiinta galabta fadlan buuxiya Daily Audit Form-ka ka hor inta aan la bilaabin kulamada Cisco BGP.",
    created_at: "Hadda (2 min ago)",
    priority: "HIGH",
    is_pinned: true,
  },
  {
    id: "ann-02",
    author_id: "admin-01",
    title: "Dayactirka Qalabka Lab 204",
    content: "Switch-ka port 12-24 ee Lab 204 waxaa lagu samaynayaa beddelaad patch cables cusub.",
    created_at: "Saacad ka hor",
    priority: "NORMAL",
  },
];

export const Phase1Dashboard: React.FC<Phase1DashboardProps> = ({
  activeRole,
  currentShift = "MORNING",
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Profile[]>(MOCK_TEACHERS);
  const [hardwareList, setHardwareList] = useState<Hardware[]>(MOCK_HARDWARE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [activeSpecializationFilter, setActiveSpecializationFilter] = useState<string>("ALL");
  const [lastAuditResult, setLastAuditResult] = useState<{
    status: string;
    reason?: string;
  } | null>(null);

  const filteredTeachers = teachers.filter((t) => {
    if (activeSpecializationFilter === "ALL") return true;
    return t.specialization === activeSpecializationFilter;
  });

  const operationalCount = hardwareList.filter((h) => h.is_operational).length;
  const brokenCount = hardwareList.length - operationalCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP METRIC & SHIFT OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Shift Status */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-cyan-400">Shift Overview</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {currentShift === "MORNING" ? "Subax (Morning)" : "Galab (Afternoon)"}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {SHIFT_SCHEDULES[currentShift].hoursEAT}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-300">Shift waa Firfircoon yahay</span>
          </div>
        </div>

        {/* Metric 2: Active Instructors On-Duty */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">Lab Instructors</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {teachers.filter((t) => t.is_on_duty).length} / {teachers.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">On-Duty & Available for Classes</p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "66%" }} />
          </div>
        </div>

        {/* Metric 3: Hardware Operational Health */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-amber-400">Hardware Inventory</span>
            <Cpu className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{operationalCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Active</span>
            {brokenCount > 0 && (
              <span className="text-xs text-rose-400 font-semibold ml-2">
                ({brokenCount} Alert)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Dell PCs, Cisco Routers & Switches</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>92% Operational Target</span>
          </div>
        </div>

        {/* Metric 4: Daily Audit Trigger Box */}
        <div className="p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-950 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold uppercase tracking-wider mb-1">
              <span>Daily Audit Action</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-300">
              Lab Teacher Manual Shift Verification
            </p>
          </div>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="mt-3 w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Bilow Daily Audit Form</span>
          </button>
        </div>
      </div>

      {/* 2. RECENT AUDIT BANNER ALERT IF INCOMPLETE */}
      {lastAuditResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-4 animate-in fade-in ${
            lastAuditResult.status === "INCOMPLETE"
              ? "border-rose-500/50 bg-rose-950/30 text-rose-200"
              : "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {lastAuditResult.status === "INCOMPLETE" ? (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                Audit Status La Gudbiyay: {lastAuditResult.status}
              </div>
              {lastAuditResult.reason && (
                <p className="text-xs mt-0.5 opacity-90">
                  Sababta la diiwaangeliyay: {lastAuditResult.reason}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setLastAuditResult(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Xidh
          </button>
        </div>
      )}

      {/* 3. MAIN 2-COLUMN SECTION: INSTRUCTOR PROFILING & HARDWARE INVENTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Shift-Based Teacher Profiling & Load Balancing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-cyan-400" />
                <span>Instructor Profiling & Load Balancer</span>
              </h2>
              <p className="text-xs text-slate-400">
                Kala saaridda Lab Programming vs Lab Technical & Real-time Duty Status
              </p>
            </div>

            {/* Specialization Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
              {["ALL", "PROGRAMMING", "TECHNICAL", "HYBRID"].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveSpecializationFilter(filterKey)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeSpecializationFilter === filterKey
                      ? "bg-cyan-600 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeachers.map((teacher) => {
              const specMeta =
                teacher.specialization && SPECIALIZATION_DETAILS[teacher.specialization];
              const shiftMeta = SHIFT_SCHEDULES[teacher.shift];

              return (
                <div
                  key={teacher.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-lg space-y-4"
                >
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{teacher.full_name}</span>
                        {/* Real-time Duty Pulse Badge */}
                        {teacher.is_on_duty ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ON-DUTY
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            OFF-DUTY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{teacher.department}</p>
                    </div>

                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 border border-slate-700">
                      {teacher.specialization === "PROGRAMMING" ? (
                        <Code2 className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <Network className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                  </div>

                  {/* Specialization Badge & Shift */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                        teacher.specialization === "PROGRAMMING"
                          ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                          : teacher.specialization === "TECHNICAL"
                          ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                          : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                      }`}
                    >
                      {specMeta ? specMeta.label : "General"}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                      Shift: {shiftMeta.title.split(" ")[0]}
                    </span>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.skills?.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Active Class Load Count Progress Bar */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Active Load Capacity</span>
                      <span className="font-bold text-slate-200">
                        {teacher.active_load_count} / 4 Classes
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          teacher.active_load_count >= 3
                            ? "bg-rose-500"
                            : teacher.active_load_count === 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${(teacher.active_load_count / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Hardware Inventory Table */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-amber-400" />
                  <span>Physical Hardware Inventory & Status</span>
                </h3>
                <p className="text-xs text-slate-400">Kombuyuutarada, Routers-ka, iyo Switch-yada</p>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Total Assets: {hardwareList.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2.5">Qalabka (Asset Name)</th>
                    <th className="pb-2.5">Serial Number</th>
                    <th className="pb-2.5">Lab Room</th>
                    <th className="pb-2.5">Xaaladda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {hardwareList.map((hw) => (
                    <tr key={hw.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-white flex items-center gap-2">
                        <Wrench className="h-3.5 w-3.5 text-slate-500" />
                        <span>{hw.asset_name}</span>
                      </td>
                      <td className="py-3 font-mono text-slate-400">{hw.serial_number}</td>
                      <td className="py-3 font-mono text-cyan-300">{hw.lab_room}</td>
                      <td className="py-3">
                        {hw.is_operational ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                            OPERATIONAL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-600/40 animate-pulse">
                            MAINTENANCE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Central Announcements & Realtime Noticeboard */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Central Noticeboard</h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-white line-clamp-1">{ann.title}</span>
                    {ann.priority === "HIGH" && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/40 text-[9px] font-bold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                    {ann.created_at}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Publish Workflow Card for Lecturers */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              <span>Lab Course Publishing</span>
            </div>
            <h4 className="font-bold text-sm text-white">Codso Fadhiga Lab-ka (Lecturer Portal)</h4>
            <p className="text-xs text-slate-300">
              Gali maaddada cusub, qalabka aad u baahan tahay, iyo khibrada macallinka (Programming ama Cisco Technical).
            </p>
            <button
              onClick={() => alert("Module 3 Lab Course Wizard wuxuu diyaar u yahay Core-Logic-Agent!")}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Daabac Codsi Cusub (New Request)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Audit Modal Component */}
      <DailyAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        labSessionId="session-demo-01"
        labName="LAB-204 (Cisco Networking Lab)"
        instructorId="inst-tech-02"
        instructorName="Eng. Sacdiya Maxamuud"
        onSubmitSuccess={(data) => {
          setLastAuditResult({
            status: data.status,
            reason: data.reason,
          });
        }}
      />
    </div>
  );
};

export default Phase1Dashboard;
