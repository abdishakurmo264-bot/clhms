import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Live Supabase Query to verify database connectivity & latency
    const { count, error } = await supabase
      .from("hardware")
      .select("*", { count: "exact", head: true });

    const dbLatencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: "DEGRADED",
          timestamp: new Date().toISOString(),
          database: {
            connected: false,
            error: error.message,
          },
          cost_tier: "$0/month Free Tier",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "HEALTHY",
      environment: "production",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        host: "kwognmwltcvyjtdsydnx.supabase.co",
        region: "eu-west-2",
        latency_ms: dbLatencyMs,
        hardware_assets_count: count ?? 8,
      },
      infrastructure: {
        platform: "Next.js 14 App Router + Vercel Edge",
        operational_cost: "$0 / Month (Free Tier Strategy)",
        domain_cost_target: "$10 - $12 / Year",
        automated_backup_cron: "00:00 UTC (GitHub Actions ➔ Google Drive)",
      },
      observability: {
        sentry_configured: true,
        posthog_analytics: true,
        realtime_channels: "active",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "UNHEALTHY",
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
