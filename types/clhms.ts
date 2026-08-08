/**
 * CLHMS: College Lab & Hardware Management System - Core Domain Types
 */

export type UserRole =
  | "ROLE_ADMIN"
  | "ROLE_LAB_HEAD"
  | "ROLE_LAB_TEACHER"
  | "ROLE_LECTURER";

export type LabCategory =
  | "Programming"
  | "Technical"
  | "Multimedia"
  | "Cybersecurity"
  | "AI & Robotics"
  | "General";

export type LabSpecialization = "PROGRAMMING" | "TECHNICAL" | "HYBRID";

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
    title: "Dual Shift (Subax & Galab)",
    hoursEAT: "07:00 AM – 09:00 PM EAT",
    status: "ACTIVE",
    bgClass: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  },
};

export type ShiftType = "MORNING" | "AFTERNOON" | "BOTH";

export type AuditStatus = "COMPLETE" | "INCOMPLETE";

export type SessionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

export interface LabCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  totalHardwareCount: number;
}

export interface InstructorProfile {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role: UserRole;
  category?: LabCategory;
  specialization?: LabSpecialization | null;
  shift: ShiftType;
  activeLoadCount?: number;
  active_load_count?: number;
  maxLoadCount?: number;
  employeeId?: string;
  employee_id?: string;
  phone?: string;
  department: string;
  skills: string[];
  bio?: string;
  isOnDuty?: boolean;
  is_on_duty?: boolean;
  assignedSessionsCount?: number;
  completedSessionsCount?: number;
  created_at?: string;
}

export type Profile = InstructorProfile;

export interface CourseSessionRequest {
  id: string;
  lecturerId?: string;
  lecturer_id?: string;
  lecturerName?: string;
  courseName?: string;
  course_name?: string;
  category?: LabCategory;
  date?: string;
  shift?: ShiftType;
  labRoom?: string;
  lab_room?: string;
  hardwareRequirements?: string;
  hardware_requirements?: string;
  resourceLink?: string;
  instructorInstructions?: string;
  assignedTeacherId?: string | null;
  assignedTeacherName?: string | null;
  lab_teacher_id?: string | null;
  status: SessionStatus;
  createdAt?: string;
  created_at?: string;
  completedAt?: string | null;
  completed_at?: string | null;
  required_specialization?: LabSpecialization;
}

export type LabSession = CourseSessionRequest;

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

export interface EquipmentTool {
  id: string;
  name?: string;
  asset_name?: string;
  serialNumber?: string;
  serial_number?: string | null;
  category: string;
  labRoom?: string;
  lab_room?: string;
  isOperational?: boolean;
  is_operational?: boolean;
  notes?: string;
  lastInspected?: string;
  created_at?: string;
}

export type Hardware = EquipmentTool;

export interface AnnouncementItem {
  id: string;
  authorName?: string;
  authorRole?: string;
  title: string;
  content: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isPinned?: boolean;
  is_pinned?: boolean;
  author_id?: string;
  created_at?: string;
  createdAt?: string;
}

export type Announcement = AnnouncementItem;
