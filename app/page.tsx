"use client";

import React, { useState } from "react";
import {
  UserRole,
  ShiftType,
  CourseSessionRequest,
  InstructorProfile,
  EquipmentTool,
  AnnouncementItem,
} from "@/types/clhms";
import AppShell from "@/components/layout/AppShell";
import DashboardOverview from "@/components/clhms/DashboardOverview";
import AdminUserManagement, { AuditLogItem } from "@/components/admin/AdminUserManagement";
import LabChairmanDashboard from "@/components/chairman/LabChairmanDashboard";
import InstructorSessionsAudit from "@/components/clhms/InstructorSessionsAudit";
import SubjectTeacherDashboard from "@/components/subject-teacher/SubjectTeacherDashboard";
import InventoryOfficerDashboard from "@/components/inventory/InventoryOfficerDashboard";
import CollegeManagementDashboard from "@/components/management/CollegeManagementDashboard";
import HardwareCategoryManager from "@/components/clhms/HardwareCategoryManager";
import TeacherDirectoryModal from "@/components/clhms/TeacherDirectoryModal";
import AdminAnnouncements from "@/components/clhms/AdminAnnouncements";
import PRDLoginForm, { PRDRoleName } from "@/components/auth/PRDLoginForm";
import DailyAuditModal from "@/components/DailyAuditModal";
import {
  Crown,
  Shield,
  UserCheck,
  BookOpen,
  Wrench,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Bell,
  Cpu,
  Users,
} from "lucide-react";

// Initial Mock Seed Data matching PRD 1.1
const INITIAL_SESSIONS: CourseSessionRequest[] = [
  {
    id: "session-01",
    lecturerId: "lec-01",
    lecturerName: "Ust. Cali Nuur (Academic Lecturer)",
    courseName: "CSC 312: Advanced Database Systems & PostgreSQL",
    category: "Programming",
    date: "Maanta",
    shift: "MORNING",
    labRoom: "LAB-101 (Programming)",
    hardwareRequirements: "25 Workstations with pgAdmin & Node.js runtime",
    resourceLink: "https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ",
    instructorInstructions: "Fadlan ardayda ku hag inay furan pgAdmin oo ku shubaan seed.sql",
    status: "PENDING",
    createdAt: "30 mins ago",
  },
  {
    id: "session-02",
    lecturerId: "lec-02",
    lecturerName: "Dr. Maryam Xaashi (Lecturer)",
    courseName: "NET 401: Cisco BGP Transit Routing & Peering",
    category: "Technical",
    date: "Maanta",
    shift: "AFTERNOON",
    labRoom: "LAB-204 (Cisco Networks)",
    hardwareRequirements: "Cisco 2901 Routers, Catalyst 2960 Switches & Patch Cables",
    resourceLink: "https://github.com/cisco-labs/bgp-peering-topology",
    instructorInstructions: "Ku xidh console cable oo ardaydu ha qaabeeyaan Autonomous System 65001",
    assignedTeacherId: "inst-tech-02",
    assignedTeacherName: "Eng. Sacdiya Maxamuud",
    status: "IN_PROGRESS",
    createdAt: "2 hours ago",
  },
  {
    id: "session-03",
    lecturerId: "lec-03",
    lecturerName: "Eng. Cabdiwali Jaamac (Lecturer)",
    courseName: "MM 201: Adobe Premiere & 4K Video Post-Production",
    category: "Multimedia",
    date: "Shalay",
    shift: "MORNING",
    labRoom: "Multimedia Studio A",
    hardwareRequirements: "Epson 4K Projector, GPU PCs, Studio Mic",
    resourceLink: "https://drive.google.com/drive/folders/media-raw-footage-lab",
    assignedTeacherId: "inst-prog-01",
    assignedTeacherName: "Eng. Bilal Axmed",
    status: "COMPLETED",
    createdAt: "Shalay",
    completedAt: "Shalay at 05:30 PM",
  },
];

const INITIAL_TEACHERS: InstructorProfile[] = [
  {
    id: "inst-admin-00",
    fullName: "System Administrator",
    email: "admin@college.edu",
    employee_id: "ADM-001",
    role: "ROLE_ADMIN",
    category: "General",
    shift: "BOTH",
    activeLoadCount: 0,
    maxLoadCount: 4,
    phone: "+252 61 500 0001",
    department: "Computer Science & Administration",
    skills: ["System Administration", "Security", "PostgreSQL", "RLS"],
    bio: "Chief System Administrator managing college users, roles, and laboratory infrastructure.",
    isOnDuty: true,
  },
  {
    id: "inst-chairman-01",
    fullName: "Dr. Cabdiraxmaan Cali (Chairman)",
    email: "chairman@college.edu",
    employee_id: "CHM-001",
    role: "ROLE_LAB_HEAD",
    category: "Technical",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCount: 4,
    phone: "+252 61 500 0002",
    department: "Department of Computer Science",
    skills: ["Lab Operations", "Scheduling", "Hardware Audits", "Workload Balancing"],
    bio: "Director of Laboratory Operations managing instructor assignments and course approvals.",
    isOnDuty: true,
  },
  {
    id: "inst-teacher-02",
    fullName: "Eng. Sacdiya Maxamuud",
    email: "teacher1@college.edu",
    employee_id: "LT-001",
    role: "ROLE_LAB_TEACHER",
    category: "Technical",
    shift: "AFTERNOON",
    activeLoadCount: 1, // Low load - available!
    maxLoadCount: 4,
    phone: "+252 61 500 0003",
    department: "Networking & Cisco Labs",
    skills: ["Cisco 2901", "Catalyst Switches", "BGP Peering", "Patch Cabling", "Hardware Diagnostics"],
    bio: "CCNA & CCNP certified Cisco lab instructor managing core routing, switching, and hardware maintenance.",
    isOnDuty: true,
  },
  {
    id: "inst-lecturer-03",
    fullName: "Ust. Cali Nuur (Academic Lecturer)",
    email: "teacher2@college.edu",
    employee_id: "ST-001",
    role: "ROLE_LECTURER",
    category: "Programming",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCount: 4,
    phone: "+252 61 500 0004",
    department: "Software Engineering & Computer Science",
    skills: ["PostgreSQL", "Next.js", "C++", "Algorithms", "Database Systems"],
    bio: "Senior Lecturer publishing lab class requirements and syllabus data resources.",
    isOnDuty: true,
  },
  {
    id: "inst-inventory-04",
    fullName: "Eng. Mustafe Xuseen (Inventory)",
    email: "inventory@college.edu",
    employee_id: "INV-001",
    role: "ROLE_ADMIN", // Inventory officer persona
    category: "Technical",
    shift: "BOTH",
    activeLoadCount: 0,
    maxLoadCount: 4,
    phone: "+252 61 500 0005",
    department: "Technical & Hardware Repair",
    skills: ["Asset Scans", "Hardware Transfers", "Soldering", "Diagnostics"],
    bio: "Inventory Officer in charge of physical equipment registration and room transfers.",
    isOnDuty: true,
  },
  {
    id: "inst-management-05",
    fullName: "Dean of Academic Affairs",
    email: "management@college.edu",
    employee_id: "MGT-001",
    role: "ROLE_ADMIN", // College management persona
    category: "General",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCount: 4,
    phone: "+252 61 500 0006",
    department: "College Executive Board",
    skills: ["Executive Reports", "Teacher Workload Analytics", "Resource Audits"],
    bio: "Dean of Academic Affairs overseeing institutional lab performance and reports.",
    isOnDuty: true,
  },
];

const INITIAL_HARDWARE: EquipmentTool[] = [
  {
    id: "hw-01",
    name: "Dell OptiPlex 7090 Micro Workstation",
    serialNumber: "SN-LAB101-PC01",
    category: "Programming",
    labRoom: "LAB-101 (Programming)",
    isOperational: true,
    notes: "Core i7 16GB RAM, Dual Monitors",
    lastInspected: "Today at 07:00 AM",
  },
  {
    id: "hw-02",
    name: "Dell OptiPlex 7090 Micro Workstation",
    serialNumber: "SN-LAB101-PC02",
    category: "Programming",
    labRoom: "LAB-101 (Programming)",
    isOperational: true,
    notes: "Core i7 16GB RAM",
    lastInspected: "Today at 07:00 AM",
  },
  {
    id: "hw-03",
    name: "Cisco 2901 Integrated Services Router",
    serialNumber: "SN-CISCO-RTR-01",
    category: "Technical",
    labRoom: "LAB-204 (Cisco Networks)",
    isOperational: true,
    notes: "Configured with BGP and OSPF modules",
    lastInspected: "Today at 08:30 AM",
  },
  {
    id: "hw-04",
    name: "Cisco Catalyst 2960-X 24-Port Switch",
    serialNumber: "SN-SW-CAT2960-A",
    category: "Technical",
    labRoom: "LAB-204 (Cisco Networks)",
    isOperational: false, // In maintenance
    notes: "Port 12-24 patch cable replacement required",
    lastInspected: "Yesterday at 04:00 PM",
  },
  {
    id: "hw-05",
    name: "Epson 4K Laser Overhead Projector",
    serialNumber: "SN-PRJ-EPS-01",
    category: "Multimedia",
    labRoom: "Multimedia Studio A",
    isOperational: true,
    notes: "4K UHD HDMI connected to lecturer pod",
    lastInspected: "Today at 09:00 AM",
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-01",
    authorName: "Dr. Cabdiraxmaan Cali (Chairman)",
    authorRole: "ROLE_LAB_HEAD",
    title: "Shift-ka Galabta: Cisco BGP Transit Labs & Patch Cabling",
    content: "Dhammaan macalimiinta galabta fadlan hubiya in patch cables-ku ay diyaar u yihiin fadhiga Cisco BGP ka hor 04:00 PM EAT.",
    priority: "HIGH",
    isPinned: true,
    createdAt: "Hadda (2 min ago)",
  },
  {
    id: "ann-02",
    authorName: "System Administrator",
    authorRole: "ROLE_ADMIN",
    title: "Dayactirka Qalabka Lab 204 & Switch Replacement",
    content: "Switch-ka port 12-24 ee Lab 204 waxaa lagu samaynayaa beddelaad patch cables cusub si loo suurtageliyo gigabit link.",
    priority: "NORMAL",
    isPinned: false,
    createdAt: "Saacad ka hor",
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-01",
    actorName: "System Administrator",
    action: "USER_CREATED",
    entityType: "user",
    description: "Registered new Lab Teacher Eng. Sacdiya Maxamuud (LT-001) in Networking & Cisco.",
    timestamp: "Today at 07:15 AM",
  },
  {
    id: "log-02",
    actorName: "Dr. Cabdiraxmaan Cali",
    action: "LAB_ASSIGNED",
    entityType: "lab",
    description: "Assigned Cisco BGP Routing session to Eng. Sacdiya Maxamuud (+1 Load Count).",
    timestamp: "Today at 08:30 AM",
  },
  {
    id: "log-03",
    actorName: "System Administrator",
    action: "SYSTEM_INITIALIZED",
    entityType: "system",
    description: "CLHMS PRD Version 1.1 User Accounts, Roles & Permissions successfully activated.",
    timestamp: "Today at 06:00 AM",
  },
];

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activePRDRole, setActivePRDRole] = useState<PRDRoleName>("ADMIN");
  const [activeShift, setActiveShift] = useState<ShiftType>("MORNING");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("admin@college.edu");
  const [currentUserName, setCurrentUserName] = useState<string>("System Administrator");

  // Stores
  const [sessions, setSessions] = useState<CourseSessionRequest[]>(INITIAL_SESSIONS);
  const [teachers, setTeachers] = useState<InstructorProfile[]>(INITIAL_TEACHERS);
  const [hardwareList, setHardwareList] = useState<EquipmentTool[]>(INITIAL_HARDWARE);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Global Audit Modal State
  const [isDailyAuditModalOpen, setIsDailyAuditModalOpen] = useState<boolean>(false);

  // Handlers
  const handleLoginSuccess = (role: PRDRoleName, email: string, name: string) => {
    setActivePRDRole(role);
    setCurrentUserEmail(email);
    setCurrentUserName(name);
    setIsAuthenticated(true);
  };

  const handleAddSession = (newSession: Partial<CourseSessionRequest>) => {
    const sessionItem: CourseSessionRequest = {
      id: `session-${Date.now()}`,
      lecturerId: "lec-01",
      lecturerName: currentUserName,
      courseName: newSession.courseName || "Untitled Lab Class",
      category: newSession.category || "Programming",
      date: newSession.date || "Maanta",
      shift: newSession.shift || activeShift,
      labRoom: newSession.labRoom || "LAB-101",
      hardwareRequirements: newSession.hardwareRequirements || "Standard PC Setup",
      resourceLink: newSession.resourceLink,
      instructorInstructions: newSession.instructorInstructions,
      status: "PENDING",
      createdAt: "Hadda",
    };
    setSessions([sessionItem, ...sessions]);

    // Record Audit Log
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "COURSE_PUBLISHED",
        entityType: "lab",
        description: `Published new lab class request: ${sessionItem.courseName}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
  };

  const handleAssignTeacher = (sessionId: string, teacherId: string, customResourceLink?: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              assignedTeacherId: teacher.id,
              assignedTeacherName: teacher.fullName,
              resourceLink: customResourceLink || s.resourceLink,
              status: "IN_PROGRESS",
            }
          : s
      )
    );

    // Atomically increment teacher load (+1)
    setTeachers(
      teachers.map((t) =>
        t.id === teacherId ? { ...t, activeLoadCount: (t.activeLoadCount || 0) + 1 } : t
      )
    );

    // Record Audit Log
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "LAB_ASSIGNED",
        entityType: "lab",
        description: `Assigned session to ${teacher.fullName} (+1 Load Count).`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleCompleteSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? { ...s, status: "COMPLETED", completedAt: "Hadda" }
          : s
      )
    );

    // Atomically decrement teacher load (-1)
    if (session.assignedTeacherId) {
      setTeachers(
        teachers.map((t) =>
          t.id === session.assignedTeacherId
            ? { ...t, activeLoadCount: Math.max(0, (t.activeLoadCount || 1) - 1) }
            : t
        )
      );
    }

    // Record Audit Log
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "LAB_COMPLETED",
        entityType: "lab",
        description: `Marked session ${session.courseName} as COMPLETED (-1 Load Decrement).`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleAddUser = (newUser: Partial<InstructorProfile>) => {
    const created: InstructorProfile = {
      id: `inst-${Date.now()}`,
      fullName: newUser.fullName || "Staff Member",
      email: newUser.email || "staff@college.edu",
      employee_id: newUser.employee_id || `EMP-${Date.now().toString().slice(-3)}`,
      phone: newUser.phone || "+252 61 500 0000",
      role: newUser.role || "ROLE_LAB_TEACHER",
      category: newUser.category || "Programming",
      shift: newUser.shift || "MORNING",
      activeLoadCount: 0,
      maxLoadCount: 4,
      department: newUser.department || "Faculty of IT",
      skills: newUser.skills || ["General IT"],
      bio: newUser.bio || "Staff member registered by System Admin.",
      isOnDuty: true,
    };

    setTeachers([...teachers, created]);

    // Record Audit Log (PRD Section 32)
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "USER_CREATED",
        entityType: "user",
        description: `Created user account for ${created.fullName} with Role: ${created.role}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleUpdateUser = (id: string, updated: Partial<InstructorProfile>) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "USER_PROFILE_UPDATED",
        entityType: "user",
        description: `Updated profile details for user ID: ${id}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleDeactivateUser = (id: string) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, isOnDuty: false } : t)));
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "USER_DEACTIVATED",
        entityType: "user",
        description: `Deactivated user account ID: ${id}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleReactivateUser = (id: string) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, isOnDuty: true } : t)));
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "USER_REACTIVATED",
        entityType: "user",
        description: `Reactivated user account ID: ${id}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleChangeRole = (id: string, newRole: UserRole) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, role: newRole } : t)));
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUserName,
        action: "USER_ROLE_CHANGED",
        entityType: "user",
        description: `Changed role for user ${id} to ${newRole}`,
        timestamp: "Hadda",
      },
      ...auditLogs,
    ]);
  };

  const handleAddHardware = (item: Partial<EquipmentTool>) => {
    const newHw: EquipmentTool = {
      id: `hw-${Date.now()}`,
      name: item.name || "Hardware Tool",
      serialNumber: item.serialNumber || `SN-${Date.now().toString().slice(-4)}`,
      category: item.category || "Programming",
      labRoom: item.labRoom || "LAB-101",
      isOperational: item.isOperational ?? true,
      lastInspected: "Today",
    };
    setHardwareList([newHw, ...hardwareList]);
  };

  const handleDeleteHardware = (id: string) => {
    setHardwareList(hardwareList.filter((h) => h.id !== id));
  };

  const handleToggleHardwareStatus = (id: string) => {
    setHardwareList(
      hardwareList.map((h) =>
        h.id === id ? { ...h, isOperational: !h.isOperational } : h
      )
    );
  };

  const handleBroadcastAnnouncement = (ann: Partial<AnnouncementItem>) => {
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: ann.title || "Untitled Alert",
      content: ann.content || "",
      priority: ann.priority || "NORMAL",
      isPinned: ann.isPinned || false,
      authorName: currentUserName,
      authorRole: activePRDRole,
      createdAt: "Hadda",
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <PRDLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Map PRDRoleName to user_role
  const legacyRole: UserRole =
    activePRDRole === "ADMIN"
      ? "ROLE_ADMIN"
      : activePRDRole === "LAB_CHAIRMAN"
      ? "ROLE_LAB_HEAD"
      : activePRDRole === "LAB_TEACHER"
      ? "ROLE_LAB_TEACHER"
      : activePRDRole === "SUBJECT_TEACHER"
      ? "ROLE_LECTURER"
      : "ROLE_ADMIN";

  return (
    <AppShell
      activeRole={legacyRole}
      onRoleChange={(newRole) => {
        const mapped: PRDRoleName =
          newRole === "ROLE_ADMIN"
            ? "ADMIN"
            : newRole === "ROLE_LAB_HEAD"
            ? "LAB_CHAIRMAN"
            : newRole === "ROLE_LAB_TEACHER"
            ? "LAB_TEACHER"
            : "SUBJECT_TEACHER";
        setActivePRDRole(mapped);
      }}
      activeShift={activeShift}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Role Identity & Switcher Bar (PRD Section 10, 11) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              {activePRDRole === "ADMIN" ? (
                <Crown className="h-5 w-5" />
              ) : activePRDRole === "LAB_CHAIRMAN" ? (
                <Shield className="h-5 w-5" />
              ) : activePRDRole === "LAB_TEACHER" ? (
                <UserCheck className="h-5 w-5" />
              ) : activePRDRole === "SUBJECT_TEACHER" ? (
                <BookOpen className="h-5 w-5" />
              ) : activePRDRole === "INVENTORY_OFFICER" ? (
                <Wrench className="h-5 w-5" />
              ) : (
                <BarChart3 className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">{currentUserName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {activePRDRole.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <strong className="text-slate-300">{currentUserEmail}</strong> • PRD v1.1 Active Session
              </p>
            </div>
          </div>

          {/* Quick Role Switcher for seamless testing */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activePRDRole}
              onChange={(e) => setActivePRDRole(e.target.value as PRDRoleName)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="ADMIN">👑 System Admin Dashboard</option>
              <option value="LAB_CHAIRMAN">🛡️ Lab Chairman Dashboard</option>
              <option value="LAB_TEACHER">👨‍🏫 Lab Teacher Dashboard</option>
              <option value="SUBJECT_TEACHER">📚 Subject Teacher Dashboard</option>
              <option value="INVENTORY_OFFICER">🛠️ Inventory Officer Dashboard</option>
              <option value="COLLEGE_MANAGEMENT">📊 College Management Dashboard</option>
            </select>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRD SECTION 10 & 11: DEDICATED ROLE-BASED DASHBOARD ROUTING */}
        {/* ============================================================== */}

        {/* 1. SYSTEM ADMIN DASHBOARD (PRD Section 12, 13, 14, 25) */}
        {activePRDRole === "ADMIN" && (
          <div className="space-y-6 animate-in fade-in">
            <AdminUserManagement
              users={teachers}
              auditLogs={auditLogs}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeactivateUser={handleDeactivateUser}
              onReactivateUser={handleReactivateUser}
              onChangeRole={handleChangeRole}
            />

            {/* Quick Admin Access to Hardware & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HardwareCategoryManager
                hardware={hardwareList}
                onAddHardware={handleAddHardware}
                onDeleteHardware={handleDeleteHardware}
                onToggleStatus={handleToggleHardwareStatus}
              />

              <AdminAnnouncements
                activeRole="ROLE_ADMIN"
                announcements={announcements}
                onBroadcast={handleBroadcastAnnouncement}
                onDelete={handleDeleteAnnouncement}
              />
            </div>
          </div>
        )}

        {/* 2. LAB CHAIRMAN DASHBOARD (PRD Section 22) */}
        {activePRDRole === "LAB_CHAIRMAN" && (
          <div className="space-y-6 animate-in fade-in">
            <LabChairmanDashboard
              sessions={sessions}
              teachers={teachers}
              onAssignTeacher={handleAssignTeacher}
              onNavigateTab={(tab) => {}}
            />

            <AdminAnnouncements
              activeRole="ROLE_LAB_HEAD"
              announcements={announcements}
              onBroadcast={handleBroadcastAnnouncement}
              onDelete={handleDeleteAnnouncement}
            />
          </div>
        )}

        {/* 3. LAB TEACHER DASHBOARD (PRD Section 20) */}
        {activePRDRole === "LAB_TEACHER" && (
          <div className="space-y-6 animate-in fade-in">
            <InstructorSessionsAudit
              sessions={sessions}
              currentInstructorId="inst-teacher-02"
              onCompleteSession={handleCompleteSession}
            />
          </div>
        )}

        {/* 4. SUBJECT TEACHER (LECTURER) DASHBOARD (PRD Section 21) */}
        {activePRDRole === "SUBJECT_TEACHER" && (
          <div className="space-y-6 animate-in fade-in">
            <SubjectTeacherDashboard
              sessions={sessions}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
            />
          </div>
        )}

        {/* 5. INVENTORY OFFICER DASHBOARD (PRD Section 23) */}
        {activePRDRole === "INVENTORY_OFFICER" && (
          <div className="space-y-6 animate-in fade-in">
            <InventoryOfficerDashboard
              hardware={hardwareList}
              onAddHardware={handleAddHardware}
              onDeleteHardware={handleDeleteHardware}
              onToggleStatus={handleToggleHardwareStatus}
            />
          </div>
        )}

        {/* 6. COLLEGE MANAGEMENT DASHBOARD (PRD Section 24) */}
        {activePRDRole === "COLLEGE_MANAGEMENT" && (
          <div className="space-y-6 animate-in fade-in">
            <CollegeManagementDashboard
              sessions={sessions}
              teachers={teachers}
              hardware={hardwareList}
            />
          </div>
        )}
      </div>

      {/* Global Daily Audit Modal */}
      <DailyAuditModal
        isOpen={isDailyAuditModalOpen}
        onClose={() => setIsDailyAuditModalOpen(false)}
        labSessionId="session-02"
        labName="LAB-204 (Cisco Networking Lab)"
        instructorId="inst-teacher-02"
        instructorName="Eng. Sacdiya Maxamuud"
      />
    </AppShell>
  );
}
