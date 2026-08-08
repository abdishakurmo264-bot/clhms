"use client";

import React, { useState, useTransition } from "react";
import {
  BookOpen,
  Plus,
  Layers,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Clock,
  Code2,
  Network,
  Cpu,
  AlertTriangle,
  ArrowRight,
  Shield,
  Loader2,
  Sliders,
} from "lucide-react";
import {
  LabSession,
  Profile,
  LabSpecialization,
  SessionStatus,
  SPECIALIZATION_DETAILS,
  UserRole,
} from "@/types/clhms";
import {
  publishLabCourseRequest,
  assignInstructorToSession,
} from "@/actions/course-publishing";
import { completeLabSession } from "@/actions/lab-sessions";

interface LabCoursePublishingWizardProps {
  activeRole: UserRole;
}

// Initial mock lab sessions matching PRD Module 3
const INITIAL_SESSIONS: LabSession[] = [
  {
    id: "session-01",
    lecturer_id: "lec-01",
    course_name: "CSC 312: Advanced Database Systems & PostgreSQL",
    required_specialization: "PROGRAMMING",
    hardware_requirements: "30 Workstations with pgAdmin & Node.js runtime",
    status: "PENDING",
    created_at: "30 mins ago",
  },
  {
    id: "session-02",
    lecturer_id: "lec-02",
    lab_teacher_id: "inst-tech-02",
    course_name: "NET 401: Cisco BGP Transit Routing & Peering",
    required_specialization: "TECHNICAL",
    hardware_requirements: "Cisco 2901 Routers, Catalyst Switches & Patch Cables",
    status: "IN_PROGRESS",
    created_at: "2 hours ago",
  },
  {
    id: "session-03",
    lecturer_id: "lec-03",
    lab_teacher_id: "inst-prog-01",
    course_name: "SWE 205: Web Architecture (HTML, CSS, WordPress)",
    required_specialization: "PROGRAMMING",
    hardware_requirements: "Dell OptiPlex Workstations",
    status: "COMPLETED",
    created_at: "Yesterday",
    completed_at: "Yesterday at 05:30 PM",
  },
];

const TEACHERS_POOL: Profile[] = [
  {
    id: "inst-prog-01",
    full_name: "Eng. Bilal Axmed",
    email: "bilal.ahmed@college.edu",
    role: "ROLE_LAB_TEACHER",
    specialization: "PROGRAMMING",
    shift: "MORNING",
    active_load_count: 2,
    department: "Software Engineering",
    created_at: new Date().toISOString(),
    skills: ["HTML", "CSS", "SQL", "WordPress", "C++", "C#"],
  },
  {
    id: "inst-tech-02",
    full_name: "Eng. Sacdiya Maxamuud",
    email: "sacdiya.m@college.edu",
    role: "ROLE_LAB_TEACHER",
    specialization: "TECHNICAL",
    shift: "AFTERNOON",
    active_load_count: 1,
    department: "Computer Networks & Security",
    created_at: new Date().toISOString(),
    skills: ["Network Hardware", "Cisco Routing", "BGP", "Troubleshooting"],
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
    created_at: new Date().toISOString(),
    skills: ["DevOps", "Cisco Routing", "SQL", "Linux"],
  },
];

export const LabCoursePublishingWizard: React.FC<LabCoursePublishingWizardProps> = ({
  activeRole,
}) => {
  const [sessions, setSessions] = useState<LabSession[]>(INITIAL_SESSIONS);
  const [teachers, setTeachers] = useState<Profile[]>(TEACHERS_POOL);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [assigningSessionId, setAssigningSessionId] = useState<string | null>(null);

  // Form State for new course request
  const [courseName, setCourseName] = useState<string>("");
  const [specialization, setSpecialization] = useState<LabSpecialization>("PROGRAMMING");
  const [hardwareReqs, setHardwareReqs] = useState<string>("");
  const [preferredShift, setPreferredShift] = useState<"MORNING" | "AFTERNOON">("MORNING");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // 1. Handle Lecturer Course Publishing
  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    startTransition(async () => {
      const response = await publishLabCourseRequest({
        lecturerId: "lec-current",
        courseName: courseName.trim(),
        requiredSpecialization: specialization,
        hardwareRequirements: hardwareReqs.trim() || null,
        preferredShift,
        targetLabRoom: "LAB-101",
      });

      if (response.success) {
        const newSession: LabSession = {
          id: response.data?.id || `session-${Date.now()}`,
          lecturer_id: "lec-current",
          course_name: courseName.trim(),
          required_specialization: specialization,
          hardware_requirements: hardwareReqs.trim(),
          status: "PENDING",
          created_at: "Just now",
        };
        setSessions([newSession, ...sessions]);
        setIsNewModalOpen(false);
        setCourseName("");
        setHardwareReqs("");
        setFeedbackMsg("Codsiga fadhiga lab-ka si guul leh ayaa loo daabacay (PENDING)!");
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    });
  };

  // 2. Handle Lab Head Assigning Instructor (+1 Load count increment)
  const handleAssignTeacher = (sessionId: string, teacherId: string) => {
    startTransition(async () => {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (!teacher) return;

      if (teacher.active_load_count >= 4) {
        alert("Macallinkani wuxuu gaadhay xadka ugu sarreeya ee culayska (4 Classes Max)!");
        return;
      }

      await assignInstructorToSession({
        sessionId,
        labTeacherId: teacherId,
        maxLoadCapacity: 4,
      });

      // Update Session Status to IN_PROGRESS
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, lab_teacher_id: teacherId, status: "IN_PROGRESS" }
            : s
        )
      );

      // Atomically increment teacher load count (+1)
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacherId ? { ...t, active_load_count: t.active_load_count + 1 } : t
        )
      );

      setAssigningSessionId(null);
      setFeedbackMsg(`Macallin ${teacher.full_name} ayaa lagu wareejiyay (+1 Load incremented)!`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    });
  };

  // 3. Handle Lab Instructor Completing Session (-1 Load count decrement)
  const handleCompleteSession = (session: LabSession) => {
    startTransition(async () => {
      if (!session.lab_teacher_id) return;

      await completeLabSession(session.id, session.lab_teacher_id);

      // Update Session Status to COMPLETED
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id
            ? { ...s, status: "COMPLETED", completed_at: "Just now" }
            : s
        )
      );

      // Atomically decrement teacher load count (-1)
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === session.lab_teacher_id
            ? { ...t, active_load_count: Math.max(0, t.active_load_count - 1) }
            : t
        )
      );

      setFeedbackMsg(`Fadhiga ${session.course_name} waa la dhammaystiray (-1 Load decremented)!`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <BookOpen className="h-4 w-4" />
            <span>PRD Module 3: Lab Publishing & Workload Lifecycle Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Daabacaadda Kulamada Lab-ka & Wareejinta Macalimiinta
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Lecturer-ku wuxuu codsanayaa qalabka & nooca macallinka • Lab Head-ku wuxuu wareejinayaa macallin xor ah • Culayska (+1/-1) si otomaatig ah ayuu isu maamulaa.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Daabac Codsi Cusub (New Request)</span>
        </button>
      </div>

      {/* Realtime Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Grid: Sessions List (Left) & Realtime Teacher Capacity Meter (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Lab Sessions Lifecycle Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Kulamada Lab-ka ee Firfircoon & Xaaladahooda (Live Status Badges)</span>
          </h3>

          <div className="space-y-3">
            {sessions.map((session) => {
              const specInfo = SPECIALIZATION_DETAILS[session.required_specialization];
              const assignedTeacher = teachers.find((t) => t.id === session.lab_teacher_id);

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all shadow-lg space-y-4"
                >
                  {/* Top Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{session.course_name}</span>
                        {/* Status Badges */}
                        {session.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40 animate-pulse">
                            PENDING APPROVAL
                          </span>
                        )}
                        {session.status === "IN_PROGRESS" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/40">
                            IN-PROGRESS
                          </span>
                        )}
                        {session.status === "COMPLETED" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>La Daabacay: {session.created_at}</span>
                      </p>
                    </div>

                    {/* Specialization Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        session.required_specialization === "PROGRAMMING"
                          ? "bg-cyan-950/60 text-cyan-300 border-cyan-800/40"
                          : "bg-amber-950/60 text-amber-300 border-amber-800/40"
                      }`}
                    >
                      {specInfo.label}
                    </span>
                  </div>

                  {/* Hardware requirements description */}
                  {session.hardware_requirements && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <Cpu className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">Qalabka loo baahan yahay: </span>
                        <span>{session.hardware_requirements}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer Action & Teacher Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      {assignedTeacher ? (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <span className="text-slate-400">Macallinka loo xilsaaray:</span>
                          <strong className="text-white">{assignedTeacher.full_name}</strong>
                          <span className="text-[10px] text-cyan-400">
                            ({assignedTeacher.active_load_count}/4 Load)
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-400 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Lama xilsaarin macallin weli (Awaiting Assignment)</span>
                        </span>
                      )}
                    </div>

                    {/* Dynamic Action Buttons according to Lifecycle */}
                    <div className="flex items-center gap-2">
                      {session.status === "PENDING" && (
                        <button
                          onClick={() =>
                            setAssigningSessionId(
                              assigningSessionId === session.id ? null : session.id
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          Xilsaar Macallin (Assign)
                        </button>
                      )}

                      {session.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => handleCompleteSession(session)}
                          disabled={isPending}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          <span>Dhammee Fadhiga (-1 Load)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Teacher Assignment Drawer */}
                  {assigningSessionId === session.id && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/50 space-y-3 animate-in fade-in">
                      <div className="text-xs font-semibold text-cyan-300 flex items-center justify-between">
                        <span>Dooro Macallinka Ku Habboon ({session.required_specialization}):</span>
                        <button
                          onClick={() => setAssigningSessionId(null)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          Xidh
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {teachers.map((teacher) => {
                          const isSpecializationMatch =
                            teacher.specialization === session.required_specialization ||
                            teacher.specialization === "HYBRID";
                          const isOverloaded = teacher.active_load_count >= 4;

                          return (
                            <button
                              key={teacher.id}
                              disabled={!isSpecializationMatch || isOverloaded}
                              onClick={() => handleAssignTeacher(session.id, teacher.id)}
                              className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                                isOverloaded
                                  ? "border-rose-900/50 bg-rose-950/20 opacity-50 cursor-not-allowed"
                                  : isSpecializationMatch
                                  ? "border-slate-700 bg-slate-900 hover:border-cyan-500 hover:bg-cyan-950/20 text-white cursor-pointer"
                                  : "border-slate-800 bg-slate-950/50 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              <div>
                                <div className="font-bold">{teacher.full_name}</div>
                                <div className="text-[10px] text-slate-400">{teacher.department}</div>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-[10px] font-bold ${
                                    isOverloaded ? "text-rose-400" : "text-cyan-400"
                                  }`}
                                >
                                  {teacher.active_load_count}/4 Load
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1-Col: Live Teacher Load Capacity Tracker */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Teacher Capacity Tracker</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Max 4/Teacher</span>
            </div>

            <p className="text-xs text-slate-400">
              Culayska fasalka oo toos isu beddelaya marka fadhi la wareejiyo (+1) ama la dhammeeyo (-1).
            </p>

            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{teacher.full_name}</span>
                    <span
                      className={`font-mono font-bold text-[11px] ${
                        teacher.active_load_count >= 3
                          ? "text-rose-400"
                          : teacher.active_load_count >= 2
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {teacher.active_load_count} / 4 Classes
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        teacher.active_load_count >= 3
                          ? "bg-rose-500"
                          : teacher.active_load_count >= 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(teacher.active_load_count / 4) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Shift: {teacher.shift}</span>
                    <span className="text-cyan-400">{teacher.specialization}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Course Request Creation Wizard */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <BookOpen className="h-4 w-4" />
                <span>Daabac Codsi Cusub oo Lab ah (Lecturer Request)</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Magaca Maaddada (Course Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NET 405: Cisco Enterprise BGP & MPLS Routing"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Khibrada Macallinka Loo Baahan Yahay (Specialization) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSpecialization("PROGRAMMING")}
                    className={`p-3 rounded-xl border text-left ${
                      specialization === "PROGRAMMING"
                        ? "border-cyan-500 bg-cyan-950/40 text-cyan-300"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    <div className="font-bold">Lab Programming</div>
                    <div className="text-[10px] text-slate-400">HTML, CSS, SQL, WordPress, C++</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpecialization("TECHNICAL")}
                    className={`p-3 rounded-xl border text-left ${
                      specialization === "TECHNICAL"
                        ? "border-amber-500 bg-amber-950/40 text-amber-300"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    <div className="font-bold">Lab Technical</div>
                    <div className="text-[10px] text-slate-400">Cisco Routing, BGP, Hardware PC</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Shuruudaha Qalabka (Hardware Requirements)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2 Cisco 2901 Routers, 4 Patch Cables, 20 Dell PCs..."
                  value={hardwareReqs}
                  onChange={(e) => setHardwareReqs(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Ka Noqo
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
                >
                  {isPending ? "Waa la daabacayaa..." : "Daabac Codsiga"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabCoursePublishingWizard;
