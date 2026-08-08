/**
 * College Lab & Hardware Management System (CLHMS) - Core Type Definitions
 * Aligned 100% with CLHMS PRD Version 1.0
 */

// 1. ENUMS
export type UserRole =
  | "ROLE_ADMIN"
  | "ROLE_LAB_HEAD"
  | "ROLE_LAB_TEACHER"
  | "ROLE_LECTURER";

export type LabSpecialization = "PROGRAMMING" | "TECHNICAL" | "HYBRID";

export type ShiftType = "MORNING" | "AFTERNOON" | "BOTH";

export type AuditStatus = "COMPLETE" | "INCOMPLETE";

export type SessionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

// 2. DATABASE ENTITIES (SUPABASE POSTGRESQL)

export interface Profile {
  id: string; // UUID references auth.users
  full_name: string;
  email: string;
  role: UserRole;
  specialization: LabSpecialization | null;
  shift: ShiftType;
  active_load_count: number;
  avatar_url?: string;
  department?: string;
  phone?: string;
  created_at: string;
  skills?: string[];
  is_on_duty?: boolean;
}

export interface Hardware {
  id: string; // UUID
  asset_name: string;
  serial_number: string | null;
  lab_room: string;
  category: string;
  is_operational: boolean;
  specifications?: Record<string, any>;
  created_at: string;
  last_inspected_at?: string;
}

export interface DailyAudit {
  id: string; // UUID
  lab_teacher_id: string | null; // references profiles(id)
  lab_room: string;
  shift: ShiftType;
  audit_date: string; // YYYY-MM-DD
  status: AuditStatus;
  incomplete_reason?: string | null; // Strictly mandatory if status = 'INCOMPLETE'
  created_at: string;
  teacher?: Profile;
}

export interface LabSession {
  id: string; // UUID
  lecturer_id: string; // references profiles(id)
  lab_teacher_id?: string | null; // references profiles(id)
  course_name: string;
  required_specialization: LabSpecialization;
  hardware_requirements?: string | null;
  status: SessionStatus;
  created_at: string;
  completed_at?: string | null;
  lecturer?: Profile;
  lab_teacher?: Profile;
}

export interface Announcement {
  id: string; // UUID
  author_id: string; // references profiles(id)
  title: string;
  content: string;
  created_at: string;
  author?: Profile;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  is_pinned?: boolean;
}

// 3. UI VIEWMODELS & HELPERS
export interface ShiftWindowInfo {
  type: ShiftType;
  title: string;
  hoursEAT: string;
  status: "ACTIVE" | "UPCOMING" | "PAST";
  bgClass: string;
}

export const SHIFT_SCHEDULES: Record<ShiftType, ShiftWindowInfo> = {
  MORNING: {
    type: "MORNING",
    title: "Morning Shift (Subax)",
    hoursEAT: "07:00 AM – 12:00 PM EAT",
    status: "ACTIVE",
    bgClass: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  AFTERNOON: {
    type: "AFTERNOON",
    title: "Afternoon Shift (Galab)",
    hoursEAT: "04:00 PM – 09:00 PM EAT",
    status: "UPCOMING",
    bgClass: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30",
  },
  BOTH: {
    type: "BOTH",
    title: "Full Day / Dual Shift",
    hoursEAT: "07:00 AM – 09:00 PM EAT",
    status: "ACTIVE",
    bgClass: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  },
};

export const SPECIALIZATION_DETAILS: Record<
  LabSpecialization,
  { label: string; description: string; skills: string[]; color: string }
> = {
  PROGRAMMING: {
    label: "Lab Programming",
    description: "Software, Web & Application Development",
    skills: ["HTML", "CSS", "SQL", "WordPress", "C++", "C#", "Python", "React"],
    color: "cyan",
  },
  TECHNICAL: {
    label: "Lab Technical",
    description: "Network Infrastructure, Cisco & Maintenance",
    skills: ["Network Hardware", "Cisco Routing", "BGP", "PC Components", "Troubleshooting", "Patch Cables"],
    color: "amber",
  },
  HYBRID: {
    label: "Hybrid Specialist",
    description: "Software & Hardware Network Engineering",
    skills: ["DevOps", "Embedded C", "IoT Systems", "Linux Kernel", "Cisco Packet Tracer"],
    color: "emerald",
  },
};
