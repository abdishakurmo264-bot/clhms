/**
 * CLHMS Product Analytics & Action Telemetry (PostHog)
 * Sub-Agent: DevOps-Telemetry-Agent
 */

export function trackEvent(
  eventName:
    | "audit_submitted"
    | "session_completed"
    | "course_published"
    | "instructor_assigned"
    | "ai_semantic_search"
    | "hardware_troubleshoot",
  properties?: Record<string, any>
) {
  const payload = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      platform: "CLHMS Web App Router",
      cost_tier: "$0/month Free Tier",
    },
  };

  console.log(`📊 [PostHog Event Dispatched]: ${eventName}`, payload.properties);

  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.capture(eventName, payload.properties);
  }
}
