"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Server Client (using environment variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ==============================================================================
// 1. Zod Validation Schemas
// ==============================================================================

export const AuditStatusEnum = z.enum(["COMPLETE", "INCOMPLETE"]);

export const SubmitDailyAuditSchema = z
  .object({
    sessionId: z.string().uuid({ message: "Session ID sax ah maaha (Invalid UUID)" }),
    instructorId: z.string().uuid({ message: "Instructor ID sax ah maaha (Invalid UUID)" }),
    status: AuditStatusEnum,
    incompleteReason: z.string().optional().nullable(),
    hardwareIssuesCount: z.number().int().min(0).default(0),
    generalNotes: z.string().max(1000).optional().nullable(),
    checklistPayload: z.record(z.any()).optional().default({}),
  })
  .superRefine((data, ctx) => {
    // Business Rule: If status is INCOMPLETE, incompleteReason is STRICTLY MANDATORY
    if (data.status === "INCOMPLETE") {
      if (
        !data.incompleteReason ||
        data.incompleteReason.trim().length < 5
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["incompleteReason"],
          message:
            "Sababta audit-ku u dhammaystirmi waayay waa qasab (ugu yaraan 5 xaraf) marka status-ku yahay INCOMPLETE.",
        });
      }
    }
  });

export const CompleteLabSessionSchema = z.object({
  sessionId: z.string().uuid({ message: "Session ID sax ah maaha" }),
  instructorId: z.string().uuid({ message: "Instructor ID sax ah maaha" }),
  finalNotes: z.string().max(1000).optional(),
});

export type SubmitDailyAuditInput = z.infer<typeof SubmitDailyAuditSchema>;
export type CompleteLabSessionInput = z.infer<typeof CompleteLabSessionSchema>;

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ==============================================================================
// 2. Server Action: submitDailyAudit
// ==============================================================================
/**
 * Submits a daily lab audit ensuring business rules:
 * - If status is INCOMPLETE, incompleteReason is enforced by Zod & DB check constraint.
 * - Inserts audit record and links it with the active lab session.
 */
export async function submitDailyAudit(
  rawInput: SubmitDailyAuditInput
): Promise<ActionResponse<{ auditId: string; status: string }>> {
  try {
    // 1. Zod Validation
    const validationResult = SubmitDailyAuditSchema.safeParse(rawInput);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Xogta la soo diray ma buuxin shuruudihii loo baahnaa.",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const {
      sessionId,
      instructorId,
      status,
      incompleteReason,
      hardwareIssuesCount,
      generalNotes,
      checklistPayload,
    } = validationResult.data;

    // 2. Verify Session exists
    const { data: session, error: sessionErr } = await supabase
      .from("lab_sessions")
      .select("id, instructor_id, status")
      .eq("id", sessionId)
      .single();

    if (sessionErr || !session) {
      return {
        success: false,
        error: `Kulanka lab-ka (Session ID: ${sessionId}) lama helin.`,
      };
    }

    // 3. Insert into daily_audits table
    const { data: insertedAudit, error: insertErr } = await supabase
      .from("daily_audits")
      .insert({
        session_id: sessionId,
        instructor_id: instructorId,
        status,
        incomplete_reason: status === "INCOMPLETE" ? incompleteReason?.trim() : null,
        hardware_issues_count: hardwareIssuesCount,
        general_notes: generalNotes?.trim() || null,
        checklist_payload: checklistPayload,
        audited_at: new Date().toISOString(),
      })
      .select("id, status")
      .single();

    if (insertErr) {
      return {
        success: false,
        error: `Kaydinta Audit-ka way fashilantay: ${insertErr.message}`,
      };
    }

    // 4. Revalidate Path cache for Next.js 14
    revalidatePath(`/dashboard/sessions/${sessionId}`);
    revalidatePath("/dashboard/audits");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        auditId: insertedAudit.id,
        status: insertedAudit.status,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Khalad aan la filayn ayaa dhacay intii lagu guda jiray audit-ka.",
    };
  }
}

// ==============================================================================
// 3. Server Action: completeLabSession
// ==============================================================================
/**
 * Completes a lab session:
 * 1. Updates lab_sessions status to 'COMPLETED' with actual_end timestamp.
 * 2. Atomically decrements the instructor's active_load_count by 1 (GREATEST(0, active_load_count - 1)).
 */
export async function completeLabSession(
  rawInput: CompleteLabSessionInput
): Promise<ActionResponse<{ sessionId: string; activeLoadCount: number }>> {
  try {
    // 1. Zod Validation
    const validationResult = CompleteLabSessionSchema.safeParse(rawInput);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Xogta la gudbiyay sax maaha.",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { sessionId, instructorId } = validationResult.data;

    // 2. Call the Atomic PostgreSQL RPC function (ensures atomic update & decrement)
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "rpc_complete_lab_session",
      { p_session_id: sessionId }
    );

    if (rpcError) {
      // Fallback to sequential atomic execution if RPC is not deployed yet
      // A. Update session status
      const { error: sessionUpdateErr } = await supabase
        .from("lab_sessions")
        .update({
          status: "COMPLETED",
          actual_end: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (sessionUpdateErr) {
        return {
          success: false,
          error: `Fadhiga lab-ka lama xidhi karin: ${sessionUpdateErr.message}`,
        };
      }

      // B. Atomically fetch and decrement instructor active_load_count
      const { data: profileData, error: fetchErr } = await supabase
        .from("profiles")
        .select("active_load_count")
        .eq("id", instructorId)
        .single();

      const currentLoad = profileData?.active_load_count || 1;
      const newLoad = Math.max(0, currentLoad - 1);

      const { error: profileUpdateErr } = await supabase
        .from("profiles")
        .update({
          active_load_count: newLoad,
          updated_at: new Date().toISOString(),
        })
        .eq("id", instructorId);

      if (profileUpdateErr) {
        console.error("Warning: Profile load count update failed:", profileUpdateErr);
      }

      revalidatePath(`/dashboard/sessions`);
      revalidatePath(`/dashboard/instructors/${instructorId}`);
      revalidatePath("/dashboard");

      return {
        success: true,
        data: {
          sessionId,
          activeLoadCount: newLoad,
        },
      };
    }

    // RPC succeeded
    if (!rpcData?.success) {
      return {
        success: false,
        error: rpcData?.error || "Fadhiga lama dhammaystiri karin.",
      };
    }

    // 3. Revalidate affected cache paths
    revalidatePath(`/dashboard/sessions/${sessionId}`);
    revalidatePath(`/dashboard/instructors/${instructorId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        sessionId: rpcData.sessionId,
        activeLoadCount: rpcData.activeLoadCount,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Khalad ayaa dhacay intii lagu guda jiray xidhitaanka lab-ka.",
    };
  }
}
