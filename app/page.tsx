"use client";

import React, { useState, useEffect } from "react";
import {
  KaabeRole,
  ShiftWindow,
  UserAccount,
  LabCourseRequest,
  HardwareToolItem,
  CampusAnnouncement,
  AuditLogEntry,
} from "@/types/kaabe";
import ZicLogin from "@/components/zic/auth/ZicLogin";
import Header from "@/components/kaabe/Header";
import Sidebar from "@/components/kaabe/Sidebar";
import MobileDrawer from "@/components/kaabe/MobileDrawer";
import DashboardView from "@/components/kaabe/views/DashboardView";
import LabRequestsView from "@/components/kaabe/views/LabRequestsView";
import AssignmentsView from "@/components/kaabe/views/AssignmentsView";
import MyLabsView from "@/components/kaabe/views/MyLabsView";
import HardwareInventoryView from "@/components/kaabe/views/HardwareInventoryView";
import CategoriesView from "@/components/zic/views/CategoriesView";
import ReportsView from "@/components/zic/views/ReportsView";
import SettingsView from "@/components/zic/views/SettingsView";
import AdminUsersView from "@/components/zic/views/AdminUsersView";
import ProfileView from "@/components/kaabe/views/ProfileView";
import AnnouncementsView from "@/components/kaabe/views/AnnouncementsView";
import TeacherDirectoryModal from "@/components/clhms/TeacherDirectoryModal";
import DailyAuditModal from "@/components/DailyAuditModal";

// Initial Seed Data for Zoom International College
const SEED_USER: UserAccount = {
  id: "user-admin",
  fullName: "Dr. Abdishakur Mohamed",
  email: "admin@college.edu",
  employeeId: "ZIC-ADM-01",
  phone: "+252 61 500 0001",
  role: "SUPER_ADMIN",
  department: "Executive Administration",
  category: "Programming Lab",
  shift: "MORNING",
  activeLoadCount: 0,
  maxLoadCapacity: 4,
  bio: "Super Administrator overseeing Zoom International College operations, role permissions, and laboratory infrastructure.",
  skills: ["System Governance", "Security", "Staff Management", "Analytics"],
  status: "Active",
  createdAt: "2026-01-15",
};

const INITIAL_SESSIONS: LabCourseRequest[] = [
  {
    id: "session-01",
    courseCode: "CSC 312",
    courseTitle: "CSC 312: Advanced Database Systems & PostgreSQL",
    category: "Programming Lab",
    lecturerId: "user-lecturer",
    lecturerName: "Prof. Ali Nur (Lecturer)",
    labRoom: "LAB-101 (Programming)",
    shift: "MORNING",
    hardwareNeeds: "25 Workstations with pgAdmin & Node.js runtime",
    resourceLink: "https://drive.google.com/drive/folders/db-lab-sheets",
    lecturerNotes: "Please guide students through Chapter 4 practical database setup.",
    status: "PENDING",
    createdAt: "30 mins ago",
  },
  {
    id: "session-02",
    courseCode: "NET 401",
    courseTitle: "NET 401: Cisco BGP Transit Routing & Peering",
    category: "Technical & Cisco Lab",
    lecturerId: "user-lecturer",
    lecturerName: "Dr. Maryam Hashi (Lecturer)",
    labRoom: "LAB-204 (Cisco Networks)",
    shift: "AFTERNOON",
    hardwareNeeds: "Cisco 2901 Routers, Catalyst 2960 Switches & Patch Cables",
    resourceLink: "https://github.com/cisco-labs/bgp-peering-topology",
    lecturerNotes: "Configure console cables for Autonomous System 65001.",
    assignedTeacherId: "user-lab-teacher",
    assignedTeacherName: "Eng. Sadiya Mohamud",
    status: "IN_PROGRESS",
    createdAt: "2 hours ago",
  },
  {
    id: "session-03",
    courseCode: "MM 201",
    courseTitle: "MM 201: Adobe Premiere & 4K Video Post-Production",
    category: "Multimedia Studio",
    lecturerId: "user-lecturer",
    lecturerName: "Prof. Abdiwali Jama (Lecturer)",
    labRoom: "Multimedia Studio A",
    shift: "MORNING",
    hardwareNeeds: "Epson 4K Laser Projector, GPU PCs, Studio Mic",
    resourceLink: "https://drive.google.com/drive/folders/media-raw-footage",
    assignedTeacherId: "user-teacher-03",
    assignedTeacherName: "Eng. Bilal Ahmed",
    status: "COMPLETED",
    createdAt: "Yesterday",
    completedAt: "Yesterday at 05:30 PM",
  },
];

const INITIAL_TEACHERS: UserAccount[] = [
  {
    id: "user-admin",
    fullName: "Dr. Abdishakur Mohamed",
    email: "admin@college.edu",
    employeeId: "ZIC-ADM-01",
    phone: "+252 61 500 0001",
    role: "SUPER_ADMIN",
    department: "Executive Administration",
    category: "Programming Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Super Administrator overseeing faculty operations, role permissions, and academic lab governance.",
    skills: ["System Governance", "Security", "Staff Management", "Analytics"],
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "user-chairman",
    fullName: "Dr. Abdirahman Ali (Chairman)",
    email: "chairman@college.edu",
    employeeId: "ZIC-CHM-01",
    phone: "+252 61 500 0002",
    role: "LAB_CHAIRMAN",
    department: "Faculty of Computing & IT",
    category: "Technical & Cisco Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Director of Laboratory Operations managing course requests, instructor allocations, and equipment readiness.",
    skills: ["Lab Scheduling", "Workload Balancing", "Cisco Lab Infrastructure", "Syllabus Coordination"],
    status: "Active",
    createdAt: "2026-02-01",
  },
  {
    id: "user-lecturer",
    fullName: "Prof. Ali Nur (Lecturer)",
    email: "lecturer@college.edu",
    employeeId: "ZIC-LEC-01",
    phone: "+252 61 500 0003",
    role: "SUBJECT_TEACHER",
    department: "Software Engineering & Computer Science",
    category: "Programming Lab",
    shift: "MORNING",
    activeLoadCount: 0,
    maxLoadCapacity: 4,
    bio: "Academic Course Lecturer publishing lab module syllabi, practical sheets, and curriculum requirements.",
    skills: ["Database Architecture", "PostgreSQL", "Full-Stack Development", "Algorithms"],
    status: "Active",
    createdAt: "2026-02-10",
  },
  {
    id: "user-lab-teacher",
    fullName: "Eng. Sadiya Mohamud",
    email: "labteacher@college.edu",
    employeeId: "ZIC-INS-01",
    phone: "+252 61 500 0004",
    role: "LAB_TEACHER",
    department: "Networks & Telecommunications",
    category: "Technical & Cisco Lab",
    shift: "AFTERNOON",
    activeLoadCount: 1, // Low load: available!
    maxLoadCapacity: 4,
    bio: "Certified Cisco CCNA/CCNP Lab Instructor executing hands-on lab sessions and daily equipment audits.",
    skills: ["Cisco BGP Routing", "Catalyst Switches", "Patch Cabling", "Hardware Diagnostics"],
    status: "Active",
    createdAt: "2026-03-01",
  },
];

const INITIAL_HARDWARE: HardwareToolItem[] = [
  {
    id: "hw-01",
    assetName: "Dell OptiPlex 7090 Micro Workstation",
    serialNumber: "SN-LAB101-PC01",
    category: "Programming Lab",
    labRoom: "LAB-101 (Programming)",
    status: "OPERATIONAL",
    notes: "Core i7 16GB RAM, Dual Monitors",
    lastVerifiedAt: "Today at 07:00 AM",
  },
  {
    id: "hw-02",
    assetName: "Dell OptiPlex 7090 Micro Workstation",
    serialNumber: "SN-LAB101-PC02",
    category: "Programming Lab",
    labRoom: "LAB-101 (Programming)",
    status: "OPERATIONAL",
    notes: "Core i7 16GB RAM",
    lastVerifiedAt: "Today at 07:00 AM",
  },
  {
    id: "hw-03",
    assetName: "Cisco 2901 Integrated Services Router",
    serialNumber: "SN-CISCO-RTR-01",
    category: "Technical & Cisco Lab",
    labRoom: "LAB-204 (Cisco Networks)",
    status: "OPERATIONAL",
    notes: "Configured with BGP and OSPF modules",
    lastVerifiedAt: "Today at 08:30 AM",
  },
  {
    id: "hw-04",
    assetName: "Cisco Catalyst 2960-X 24-Port Switch",
    serialNumber: "SN-SW-CAT2960-A",
    category: "Technical & Cisco Lab",
    labRoom: "LAB-204 (Cisco Networks)",
    status: "MAINTENANCE",
    notes: "Port 12-24 patch cable replacement required",
    lastVerifiedAt: "Yesterday at 04:00 PM",
  },
  {
    id: "hw-05",
    assetName: "Epson 4K Laser Overhead Projector",
    serialNumber: "SN-PRJ-EPS-01",
    category: "Multimedia Studio",
    labRoom: "Multimedia Studio A",
    status: "OPERATIONAL",
    notes: "4K UHD HDMI connected to lecturer pod",
    lastVerifiedAt: "Today at 09:00 AM",
  },
];

const INITIAL_ANNOUNCEMENTS: CampusAnnouncement[] = [
  {
    id: "ann-01",
    title: "Afternoon Shift: Cisco BGP Transit Labs & Patch Cabling",
    content: "All afternoon lab instructors must ensure patch cables and RJ45 crimpers are ready before 04:00 PM EAT.",
    priority: "HIGH",
    isPinned: true,
    authorName: "Dr. Abdirahman Ali (Chairman)",
    authorRole: "LAB_CHAIRMAN",
    createdAt: "Just now (2 mins ago)",
  },
  {
    id: "ann-02",
    title: "Lab 204 Catalyst Switch Maintenance",
    content: "Switch ports 12-24 in LAB-204 are undergoing patch cable replacement to enable gigabit link speed.",
    priority: "NORMAL",
    isPinned: false,
    authorName: "System Administrator",
    authorRole: "SUPER_ADMIN",
    createdAt: "1 hour ago",
  },
];

export default function ZoomCollegePortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserAccount>(SEED_USER);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeShift, setActiveShift] = useState<ShiftWindow>("MORNING");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // App Data Stores
  const [sessions, setSessions] = useState<LabCourseRequest[]>(INITIAL_SESSIONS);
  const [teachers, setTeachers] = useState<UserAccount[]>(INITIAL_TEACHERS);
  const [hardwareList, setHardwareList] = useState<HardwareToolItem[]>(INITIAL_HARDWARE);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Global Daily Audit Modal
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Load persistent session from localStorage on mount (PRD: browser remembers login)
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("zic_auth_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  // Authentication Handlers
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab("overview");
    try {
      localStorage.setItem("zic_auth_session", JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("zic_auth_session");
    } catch (e) {}
  };

  // Lab Publishing Handlers (Subject Teachers)
  const handleAddSession = (newSession: Partial<LabCourseRequest>) => {
    const created: LabCourseRequest = {
      id: `session-${Date.now()}`,
      courseCode: newSession.courseCode || "CSC 300",
      courseTitle: newSession.courseTitle || "Untitled Lab Class",
      category: newSession.category || "Programming Lab",
      lecturerId: currentUser.id,
      lecturerName: currentUser.fullName,
      labRoom: newSession.labRoom || "LAB-101 (Programming)",
      shift: newSession.shift || activeShift,
      hardwareNeeds: newSession.hardwareNeeds || "Standard Lab Workstations",
      resourceLink: newSession.resourceLink,
      lecturerNotes: newSession.lecturerNotes,
      status: "PENDING",
      createdAt: "Just now",
    };

    setSessions([created, ...sessions]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // Lab Assignment Handler (Lab Chairman)
  const handleAssignTeacher = (sessionId: string, teacherId: string, customLink?: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              assignedTeacherId: teacher.id,
              assignedTeacherName: teacher.fullName,
              resourceLink: customLink || s.resourceLink,
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
  };

  // Lab Completion Handler (Lab Teacher)
  const handleCompleteSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSessions(
      sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "COMPLETED", completedAt: "Just now" } : s
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
  };

  // User Management Handlers (Super Admin)
  const handleAddUser = (newUser: Partial<UserAccount>) => {
    const created: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: newUser.fullName || "Staff Member",
      email: newUser.email || "staff@college.edu",
      employeeId: newUser.employeeId || `ZIC-STAFF-${Date.now().toString().slice(-3)}`,
      phone: newUser.phone || "+252 61 500 0000",
      role: newUser.role || "LAB_TEACHER",
      department: newUser.department || "Faculty of Computing",
      category: newUser.category || "Programming Lab",
      shift: newUser.shift || "MORNING",
      activeLoadCount: 0,
      maxLoadCapacity: 4,
      bio: newUser.bio || "Staff member registered by Super Administrator.",
      skills: newUser.skills || ["General IT"],
      status: "Active",
      createdAt: "Today",
    };

    setTeachers([...teachers, created]);
  };

  const handleUpdateUser = (id: string, updated: Partial<UserAccount>) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const handleDeleteUser = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleToggleUserStatus = (id: string) => {
    setTeachers(
      teachers.map((t) =>
        t.id === id ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" } : t
      )
    );
  };

  const handleChangeRole = (id: string, newRole: KaabeRole) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, role: newRole } : t)));
  };

  // Hardware Handlers
  const handleAddHardware = (item: Partial<HardwareToolItem>) => {
    const newHw: HardwareToolItem = {
      id: `hw-${Date.now()}`,
      assetName: item.assetName || "Hardware Asset",
      serialNumber: item.serialNumber || `SN-${Date.now().toString().slice(-4)}`,
      category: item.category || "Programming Lab",
      labRoom: item.labRoom || "LAB-101 (Programming)",
      status: "OPERATIONAL",
      notes: item.notes,
      lastVerifiedAt: "Today",
    };
    setHardwareList([newHw, ...hardwareList]);
  };

  const handleDeleteHardware = (id: string) => {
    setHardwareList(hardwareList.filter((h) => h.id !== id));
  };

  const handleToggleHardwareStatus = (id: string) => {
    setHardwareList(
      hardwareList.map((h) =>
        h.id === id
          ? { ...h, status: h.status === "OPERATIONAL" ? "MAINTENANCE" : "OPERATIONAL" }
          : h
      )
    );
  };

  // Announcement Handlers
  const handleBroadcastAnnouncement = (ann: Partial<CampusAnnouncement>) => {
    const created: CampusAnnouncement = {
      id: `ann-${Date.now()}`,
      title: ann.title || "Untitled Notice",
      content: ann.content || "",
      priority: ann.priority || "NORMAL",
      isPinned: ann.isPinned || false,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      createdAt: "Just now",
    };
    setAnnouncements([created, ...announcements]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // Profile Update Handler
  const handleUpdateProfile = (updated: Partial<UserAccount>) => {
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    setTeachers(teachers.map((t) => (t.id === currentUser.id ? nextUser : t)));
    try {
      localStorage.setItem("zic_auth_session", JSON.stringify(nextUser));
    } catch (e) {}
  };

  // If not authenticated, render clean ZIC Login
  if (!isAuthenticated) {
    return <ZicLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. TOP SINGLE-ROW HEADER WITH ZOOM INTERNATIONAL COLLEGE LOGO */}
      <Header
        currentUser={currentUser}
        activeShift={activeShift}
        onShiftChange={setActiveShift}
        onNavigate={setActiveTab}
        onLogout={handleLogout}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* 2. BODY WITH SIDEBAR AND MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (Role-Aware) */}
        <Sidebar
          currentRole={currentUser.role}
          activeTab={activeTab}
          onNavigate={setActiveTab}
        />

        {/* Mobile Slide-out Drawer */}
        <MobileDrawer
          isOpen={isMobileDrawerOpen}
          currentUser={currentUser}
          activeTab={activeTab}
          onNavigate={setActiveTab}
          onClose={() => setIsMobileDrawerOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* View 1: Overview Dashboard */}
          {activeTab === "overview" && (
            <DashboardView
              currentUser={currentUser}
              sessions={sessions}
              teachers={teachers}
              hardware={hardwareList}
              announcements={announcements}
              onNavigate={setActiveTab}
              onOpenAuditModal={() => setIsAuditModalOpen(true)}
              onOpenNewLabModal={() => setActiveTab("requests")}
            />
          )}

          {/* View 2: Course Lab Publishing (Lecturers) */}
          {activeTab === "requests" && (
            <LabRequestsView
              sessions={sessions}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {/* View 3: Teacher Assignments & Workload (Lab Chairman) */}
          {activeTab === "assignments" && (
            <AssignmentsView
              sessions={sessions}
              teachers={teachers}
              onAssignTeacher={handleAssignTeacher}
            />
          )}

          {/* View 4: My Labs & Daily Audit (Lab Teachers) */}
          {activeTab === "my-labs" && (
            <MyLabsView
              currentUser={currentUser}
              sessions={sessions}
              onCompleteSession={handleCompleteSession}
            />
          )}

          {/* View 5: Hardware & Tools Inventory */}
          {activeTab === "hardware" && (
            <HardwareInventoryView
              hardware={hardwareList}
              onAddHardware={handleAddHardware}
              onDeleteHardware={handleDeleteHardware}
              onToggleStatus={handleToggleHardwareStatus}
            />
          )}

          {/* View 6: User & Role Management (Super Admin) */}
          {activeTab === "users" && (
            <AdminUsersView
              users={teachers}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
              onChangeRole={handleChangeRole}
            />
          )}

          {/* View 7: Categories & Lab Rooms Configuration */}
          {activeTab === "categories" && (
            <CategoriesView />
          )}

          {/* View 8: Official A4 Printable Reports Suite */}
          {activeTab === "reports" && (
            <ReportsView
              hardware={hardwareList}
              teachers={teachers}
              sessions={sessions}
            />
          )}

          {/* View 9: Staff Directory */}
          {activeTab === "teachers" && (
            <TeacherDirectoryModal teachers={teachers as any} />
          )}

          {/* View 10: Campus Noticeboard & Announcements */}
          {activeTab === "announcements" && (
            <AnnouncementsView
              currentRole={currentUser.role}
              announcements={announcements}
              onBroadcast={handleBroadcastAnnouncement}
              onDelete={handleDeleteAnnouncement}
            />
          )}

          {/* View 11: My Profile & Settings */}
          {activeTab === "profile" && (
            <ProfileView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {/* View 12: System Governance & Settings */}
          {activeTab === "settings" && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Global Daily Audit Modal */}
      <DailyAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        labSessionId="session-02"
        labName="LAB-204 (Cisco Networking Lab)"
        instructorId={currentUser.id}
        instructorName={currentUser.fullName}
      />
    </div>
  );
}
