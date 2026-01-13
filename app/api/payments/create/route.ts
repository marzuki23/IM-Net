import { type NextRequest, NextResponse } from "next/server";
import { db, payments, subscriptions, users } from "@/db";
import { eq } from "drizzle-orm";
import { createDuitkuPayment } from "@/lib/duitku";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId, amount } = await request.json();

    // Validate subscription belongs to user
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.id, subscriptionId),
    });

    if (!subscription || subscription.userId !== userId) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create invoice number
    const invoiceNumber = `INV-${Date.now()}-${userId.slice(0, 8)}`;

    // Create payment record
    const payment = await db
      .insert(payments)
      .values({
        userId,
        subscriptionId,
        amount: amount.toString(),
        paymentMethod: "duitku",
        paymentStatus: "pending",
        invoiceNumber,
        description: `Pembayaran ${
          subscription.packageName
        } - ${new Date().toLocaleDateString("id-ID")}`,
      })
      .returning();

    // Create DuitKu payment
    const duitkuResponse = await createDuitkuPayment({
      amount,
      phone: user.phone || "",
      email: user.email,
      invoiceNumber,
      description: `WiFi ${subscription.packageName}`,
      returnUrl: `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/dashboard/payments/${payment[0].id}/confirm`,
      expiryPeriod: 24,
    });

    // Update payment with DuitKu reference
    await db
      .update(payments)
      .set({
        duitkuReference: duitkuResponse.reference,
        metadata: JSON.stringify(duitkuResponse),
      })
      .where(eq(payments.id, payment[0].id));

    return NextResponse.json({
      success: true,
      paymentId: payment[0].id,
      paymentUrl: duitkuResponse.paymentUrl,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
