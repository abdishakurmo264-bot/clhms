/**
 * KAABE College Lab & Academic Portal - Core Domain Models
 * Clean 4-Role Architecture in English
 */

export type KaabeRole =
  | "SUPER_ADMIN"
  | "LAB_CHAIRMAN"
  | "SUBJECT_TEACHER"
  | "LAB_TEACHER";

export type KaabeCategory =
  | "Programming Lab"
  | "Technical & Cisco Lab"
  | "Multimedia Studio"
  | "Cybersecurity Lab"
  | "AI & Robotics";

export type ShiftWindow = "MORNING" | "AFTERNOON";

export type LabSessionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

export type HardwareStatus = "OPERATIONAL" | "MAINTENANCE" | "DAMAGED" | "MISSING";

export type AuditStatus = "COMPLETE" | "INCOMPLETE";

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  phone: string;
  role: KaabeRole;
  department: string;
  category: KaabeCategory;
  shift: ShiftWindow;
  activeLoadCount: number; // 0 to 4
  maxLoadCapacity: number; // default 4
  avatarUrl?: string;
  bio: string;
  skills: string[];
  status: "Active" | "Inactive" | "Suspended";
  createdAt: string;
}

export interface LabCourseRequest {
  id: string;
  courseCode: string;
  courseTitle: string;
  category: KaabeCategory;
  lecturerId: string;
  lecturerName: string;
  labRoom: string;
  shift: ShiftWindow;
  hardwareNeeds: string;
  resourceLink?: string; // Google Drive, GitHub, PDF URL
  lecturerNotes?: string;
  assignedTeacherId?: string | null;
  assignedTeacherName?: string | null;
  status: LabSessionStatus;
  createdAt: string;
  completedAt?: string | null;
}

export interface HardwareToolItem {
  id: string;
  assetName: string;
  serialNumber: string;
  category: KaabeCategory;
  labRoom: string;
  status: HardwareStatus;
  notes?: string;
  lastVerifiedAt: string;
}

export interface DailyAuditRecord {
  id: string;
  sessionId: string;
  labRoom: string;
  instructorId: string;
  instructorName: string;
  status: AuditStatus;
  incompleteReason?: string;
  createdAt: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isPinned: boolean;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  action: string;
  entityType?: string;
  target?: string;
  description: string;
  timestamp: string;
}
