"use client";

import React, { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Calendar,
  Layers,
  Wrench,
  Info,
} from "lucide-react";

export type AuditStatus = "COMPLETE" | "INCOMPLETE";

export interface LabAuditItem {
  id: string;
  name: string;
  category: "workstation" | "network" | "safety" | "peripherals";
  status: AuditStatus;
  notes?: string;
}

interface DailyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  labSessionId: string;
  labName: string;
  instructorId: string;
  instructorName: string;
  onSubmitSuccess?: (data: {
    sessionId: string;
    status: AuditStatus;
    reason?: string;
  }) => void;
}

export const DailyAuditModal: React.FC<DailyAuditModalProps> = ({
  isOpen,
  onClose,
  labSessionId,
  labName,
  instructorName,
  onSubmitSuccess,
}) => {
  const [status, setStatus] = useState<AuditStatus>("COMPLETE");
  const [incompleteReason, setIncompleteReason] = useState<string>("");
  const [generalNotes, setGeneralNotes] = useState<string>("");
  const [hardwareIssuesCount, setHardwareIssuesCount] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: AuditStatus) => {
    setStatus(newStatus);
    if (newStatus === "COMPLETE") {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Business rule: If INCOMPLETE, reason is strictly required
    if (status === "INCOMPLETE" && (!incompleteReason || incompleteReason.trim().length < 10)) {
      setValidationError(
        "Fadlan qor sababta audit-ka loo dhamaystiri waayay (ugu yaraan 10 xaraf)."
      );
      return;
    }

    startTransition(async () => {
      try {
        // Dynamic import of the server action or prop invocation
        const response = await fetch("/api/lab-audits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            labSessionId,
            status,
            incompleteReason: status === "INCOMPLETE" ? incompleteReason.trim() : null,
            generalNotes: generalNotes.trim() || null,
            hardwareIssuesCount,
            auditedAt: new Date().toISOString(),
          }),
        }).catch(() => null);

        // Notify parent component
        if (onSubmitSuccess) {
          onSubmitSuccess({
            sessionId: labSessionId,
            status,
            reason: status === "INCOMPLETE" ? incompleteReason : undefined,
          });
        }
        onClose();
      } catch (err: any) {
        setValidationError(err.message || "Khalad ayaa dhacay intii lagu guda jiray kaydinta.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl shadow-cyan-950/20 overflow-hidden transition-all duration-300">
        {/* Header with decorative top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        
        <div className="p-6 sm:p-7">
          {/* Top Info Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Layers className="h-4 w-4" />
                <span>College Lab Management System</span>
              </div>
              <h2
                id="modal-title"
                className="mt-1 text-2xl font-bold tracking-tight text-white"
              >
                Xaqiijinta Audit-ka Maalinlaha ah
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Hubi qalabka iyo nadaafadda lab-ka ka hor inta aan la xidhin kulanka.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Xidh Modal-ka"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Context Badge Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Lab:</span>
              <span className="font-semibold text-cyan-300 truncate">{labName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Macallinka:</span>
              <span className="font-semibold text-slate-200 truncate">{instructorName}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 text-slate-400 border-t border-slate-700/40 pt-2 mt-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Taariikhda: {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Selector (Radio / Toggle Cards) */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Xaaladda Audit-ka Lab-ka (Audit Status) <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Complete Card */}
                <button
                  type="button"
                  onClick={() => handleStatusChange("COMPLETE")}
                  className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    status === "COMPLETE"
                      ? "border-emerald-500 bg-emerald-950/30 text-white ring-2 ring-emerald-500/30"
                      : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-5 w-5 ${
                          status === "COMPLETE" ? "text-emerald-400" : "text-slate-500"
                        }`}
                      />
                      <span className="font-bold text-sm">COMPLETE</span>
                    </div>
                    {status === "COMPLETE" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Dhammaan kombuyuutarada iyo qalabka lab-ku way hagaagsan yihiin.
                  </p>
                </button>

                {/* Incomplete Card */}
                <button
                  type="button"
                  onClick={() => handleStatusChange("INCOMPLETE")}
                  className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    status === "INCOMPLETE"
                      ? "border-rose-500 bg-rose-950/30 text-white ring-2 ring-rose-500/30"
                      : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className={`h-5 w-5 ${
                          status === "INCOMPLETE" ? "text-rose-400" : "text-slate-500"
                        }`}
                      />
                      <span className="font-bold text-sm">INCOMPLETE</span>
                    </div>
                    {status === "INCOMPLETE" && (
                      <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Waxaa jira qalab dhiman, cilad ku timid, ama baahi dayactir.
                  </p>
                </button>
              </div>
            </div>

            {/* Incomplete Reason Textarea (Conditionally rendered and mandatory) */}
            {status === "INCOMPLETE" && (
              <div className="space-y-2 rounded-xl bg-rose-950/20 border border-rose-900/50 p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="incomplete-reason"
                    className="flex items-center gap-1.5 text-sm font-semibold text-rose-300"
                  >
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <span>Sababta Audit-ku u Dhammaystirmi Waayay (Mandatory)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-rose-400 font-mono">
                    {incompleteReason.length}/10 min
                  </span>
                </div>

                <textarea
                  id="incomplete-reason"
                  rows={3}
                  value={incompleteReason}
                  onChange={(e) => {
                    setIncompleteReason(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Sharax qalabka ciladaysan, nambarka miiska (PC-04), ama waxyaabaha keenay in kulanku dhamaystirmi waayo..."
                  required
                  className="w-full rounded-lg border border-rose-800/80 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-inner focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
                />

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-slate-400" />
                    <span>Tirada PC-yada ciladaysan:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hardwareIssuesCount}
                      onChange={(e) => setHardwareIssuesCount(parseInt(e.target.value) || 0)}
                      className="w-16 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-center text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* General Optional Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="general-notes"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Faallo Dheeraad ah (Optional Notes)</span>
              </label>
              <textarea
                id="general-notes"
                rows={2}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Fariin guud ama talooyin kusaabsan fadhiga maanta..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Validation & Error Alert */}
            {validationError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-sm text-rose-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions / Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
              >
                Ka Noqo (Cancel)
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  status === "COMPLETE"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500 shadow-emerald-950/40"
                    : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 focus:ring-rose-500 shadow-rose-950/40"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Waa la gudbinayaa...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Gudbi Audit-ka ({status})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyAuditModal;
