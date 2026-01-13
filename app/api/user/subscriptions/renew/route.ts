import { type NextRequest, NextResponse } from "next/server";
import { db, subscriptions, payments } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId } = await request.json();

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.id, subscriptionId),
    });

    if (!subscription || subscription.userId !== userId) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    // Create payment for renewal
    const payment = await db
      .insert(payments)
      .values({
        userId,
        subscriptionId,
        amount: subscription.monthlyPrice,
        paymentMethod: "duitku",
        paymentStatus: "pending",
        description: `Perpanjangan ${subscription.packageName}`,
      })
      .returning();

    return NextResponse.json({
      success: true,
      paymentId: payment[0].id,
    });
  } catch (error) {
    console.error("Renewal error:", error);
    return NextResponse.json(
      { error: "Failed to create renewal payment" },
      { status: 500 }
    );
  }
}
