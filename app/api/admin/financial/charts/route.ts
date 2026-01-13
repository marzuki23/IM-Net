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

    const chartData = reports.slice(-12).map((r) => ({
      month: `${r.month}/${r.year}`,
      revenue: Number.parseFloat(r.totalRevenue || "0"),
      completed: Number.parseFloat(r.totalPayments || "0"),
      pending: Number.parseFloat(r.totalPending || "0"),
      failed: Number.parseFloat(r.totalFailed || "0"),
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Chart data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
