import { NextRequest, NextResponse } from "next/server";
import { db, accountRequests, subscriptions, users } from "@/db";
import { getSession } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { WIFI_PACKAGES } from "@/app/config/packages";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, action } = await request.json(); // action: 'approve' | 'reject'

    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const requestToProcess = await db.query.accountRequests.findFirst({
      where: eq(accountRequests.id, requestId),
    });

    if (!requestToProcess) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (requestToProcess.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      await db
        .update(accountRequests)
        .set({ status: "rejected", approvedBy: session.user.id, approvedAt: new Date() })
        .where(eq(accountRequests.id, requestId));
        
      return NextResponse.json({ success: true, status: "rejected" });
    }

    if (action === "approve") {
      // Find package details
      const pkg = WIFI_PACKAGES.find(
        (p) => p.name === requestToProcess.desiredPackage || p.id === requestToProcess.desiredPackage
      );

      // Default fallback if package not found in config (should not happen if name matches)
      const monthlyPrice = pkg ? pkg.price.toString() : "0";
      const speed = pkg ? pkg.speed : "Unknown";
      const installFee = pkg ? pkg.installationFee.toString() : "0";

      // 1. Update Request
      await db
        .update(accountRequests)
        .set({ status: "approved", approvedBy: session.user.id, approvedAt: new Date() })
        .where(eq(accountRequests.id, requestId));

      // 2. Create Subscription
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1);

      await db.insert(subscriptions).values({
        userId: requestToProcess.userId,
        packageName: requestToProcess.desiredPackage || "Standard Package",
        speed: speed,
        monthlyPrice: monthlyPrice,
        installationFee: installFee,
        status: "active",
        startDate: now,
        nextBillingDate: nextMonth,
        isAutoRenewal: true,
      });

      // 3. Activate User Account if pending
      await db
        .update(users)
        .set({ accountStatus: "active" })
        .where(eq(users.id, requestToProcess.userId));

      return NextResponse.json({ success: true, status: "approved" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
