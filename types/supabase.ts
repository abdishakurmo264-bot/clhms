export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "ROLE_ADMIN"
  | "ROLE_LAB_HEAD"
  | "ROLE_LAB_TEACHER"
  | "ROLE_LECTURER";

export type LabSpecialization = "PROGRAMMING" | "TECHNICAL" | "HYBRID";
export type ShiftType = "MORNING" | "AFTERNOON" | "BOTH";
export type AuditStatus = "COMPLETE" | "INCOMPLETE";
export type SessionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          specialization: LabSpecialization | null;
          shift: ShiftType;
          active_load_count: number;
          avatar_url: string | null;
          department: string;
          phone: string | null;
          is_on_duty: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          specialization?: LabSpecialization | null;
          shift?: ShiftType;
          active_load_count?: number;
          avatar_url?: string | null;
          department?: string;
          phone?: string | null;
          is_on_duty?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: UserRole;
          specialization?: LabSpecialization | null;
          shift?: ShiftType;
          active_load_count?: number;
          avatar_url?: string | null;
          department?: string;
          phone?: string | null;
          is_on_duty?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      hardware: {
        Row: {
          id: string;
          asset_name: string;
          serial_number: string | null;
          lab_room: string;
          category: string;
          is_operational: boolean;
          specifications: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_name: string;
          serial_number?: string | null;
          lab_room: string;
          category: string;
          is_operational?: boolean;
          specifications?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_name?: string;
          serial_number?: string | null;
          lab_room?: string;
          category?: string;
          is_operational?: boolean;
          specifications?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_audits: {
        Row: {
          id: string;
          lab_teacher_id: string | null;
          lab_room: string;
          shift: ShiftType;
          audit_date: string;
          status: AuditStatus;
          incomplete_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lab_teacher_id?: string | null;
          lab_room: string;
          shift: ShiftType;
          audit_date?: string;
          status: AuditStatus;
          incomplete_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lab_teacher_id?: string | null;
          lab_room?: string;
          shift?: ShiftType;
          audit_date?: string;
          status?: AuditStatus;
          incomplete_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lab_sessions: {
        Row: {
          id: string;
          lecturer_id: string;
          lab_teacher_id: string | null;
          course_name: string;
          required_specialization: LabSpecialization;
          hardware_requirements: string | null;
          status: SessionStatus;
          created_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lecturer_id: string;
          lab_teacher_id?: string | null;
          course_name: string;
          required_specialization: LabSpecialization;
          hardware_requirements?: string | null;
          status?: SessionStatus;
          created_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lecturer_id?: string;
          lab_teacher_id?: string | null;
          course_name?: string;
          required_specialization?: LabSpecialization;
          hardware_requirements?: string | null;
          status?: SessionStatus;
          created_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          priority: string;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          priority?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          priority?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_lab_head_or_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
      lab_specialization: LabSpecialization;
      shift_type: ShiftType;
      audit_status: AuditStatus;
      session_status: SessionStatus;
    };
  };
}
