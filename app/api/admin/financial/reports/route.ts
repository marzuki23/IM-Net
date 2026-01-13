import { type NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin
    const admin = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await db.query.financialReports.findMany({});

    return NextResponse.json({
      reports: reports.map((r) => ({
        month: r.month,
        year: r.year,
        totalRevenue: r.totalRevenue,
        totalPayments: r.totalPayments,
        totalPending: r.totalPending,
        totalFailed: r.totalFailed,
        activeSubscriptions: r.activeSubscriptions,
        newSubscriptions: r.newSubscriptions,
        cancelledSubscriptions: r.cancelledSubscriptions,
      })),
    });
  } catch (error) {
    console.error("Financial reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
