import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Perform a lightweight database query to verify connectivity
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          status: "connected",
          latencyMs,
        },
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Health Check Failed]:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: "Database connectivity check failed",
        },
      },
      { status: 503 }
    );
  }
}
