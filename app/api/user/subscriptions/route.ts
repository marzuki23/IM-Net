import { type NextRequest, NextResponse } from "next/server";
import { db, subscriptions } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSubscriptions = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, userId),
    });

    return NextResponse.json({
      subscriptions: userSubscriptions.map((s) => ({
        id: s.id,
        packageName: s.packageName,
        speed: s.speed,
        monthlyPrice: s.monthlyPrice,
        installationFee: s.installationFee,
        status: s.status,
        startDate: s.startDate,
        endDate: s.endDate,
        nextBillingDate: s.nextBillingDate,
        isAutoRenewal: s.isAutoRenewal,
      })),
    });
  } catch (error) {
    console.error("Subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
