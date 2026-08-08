/**
 * CLHMS Observability: Sentry Exception Logging & Tracing
 * Sub-Agent: DevOps-Telemetry-Agent
 */

export function captureException(error: any, context?: Record<string, any>) {
  console.error("🚨 [Sentry Telemetry Error Captured]:", error, context || {});
  
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, { extra: context });
  }
}

export function logMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`📡 [Sentry Telemetry Log - ${level.toUpperCase()}]: ${message}`);
}
