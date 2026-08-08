"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { CourseSessionRequest, EquipmentTool, AnnouncementItem } from "@/types/clhms";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kwognmwltcvyjtdsydnx.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ==============================================================================
// 1. COURSE REQUESTS CRUD (LECTURERS & LAB HEAD)
// ==============================================================================

export async function createCourseRequest(courseData: Partial<CourseSessionRequest>) {
  try {
    const { data, error } = await supabase
      .from("lab_sessions")
      .insert({
        course_name: courseData.courseName,
        required_specialization: courseData.category === "Programming" ? "PROGRAMMING" : "TECHNICAL",
        hardware_requirements: courseData.hardwareRequirements,
        status: "PENDING",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    revalidatePath("/");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCourseRequest(sessionId: string) {
  try {
    await supabase.from("lab_sessions").delete().eq("id", sessionId);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 2. TEACHER ASSIGNMENT & RESOURCE ATTACHMENT (LAB HEAD)
// ==============================================================================

export async function assignTeacherWithResources(
  sessionId: string,
  teacherId: string,
  resourceLink?: string,
  instructions?: string
) {
  try {
    // 1. Update session
    await supabase
      .from("lab_sessions")
      .update({
        lab_teacher_id: teacherId,
        status: "IN_PROGRESS",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    // 2. Increment teacher load
    const { data: profile } = await supabase
      .from("profiles")
      .select("active_load_count")
      .eq("id", teacherId)
      .single();

    const currentLoad = profile?.active_load_count || 0;
    await supabase
      .from("profiles")
      .update({
        active_load_count: currentLoad + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teacherId);

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 3. HARDWARE & TOOLS INVENTORY CRUD (ADMIN & LAB HEAD)
// ==============================================================================

export async function createHardwareAsset(asset: Partial<EquipmentTool>) {
  try {
    const { data, error } = await supabase
      .from("hardware")
      .insert({
        asset_name: asset.name,
        serial_number: asset.serialNumber,
        lab_room: asset.labRoom,
        category: asset.category,
        is_operational: asset.isOperational ?? true,
      })
      .select()
      .single();

    revalidatePath("/");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteHardwareAsset(hardwareId: string) {
  try {
    await supabase.from("hardware").delete().eq("id", hardwareId);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleHardwareStatus(hardwareId: string, currentStatus: boolean) {
  try {
    await supabase
      .from("hardware")
      .update({ is_operational: !currentStatus, updated_at: new Date().toISOString() })
      .eq("id", hardwareId);

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 4. ANNOUNCEMENTS BROADCASTING (ADMIN & LAB HEAD)
// ==============================================================================

export async function broadcastAnnouncement(ann: Partial<AnnouncementItem>) {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: ann.title,
        content: ann.content,
        priority: ann.priority || "NORMAL",
        is_pinned: ann.isPinned || false,
      })
      .select()
      .single();

    revalidatePath("/");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAnnouncement(annId: string) {
  try {
    await supabase.from("announcements").delete().eq("id", annId);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
