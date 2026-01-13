import { type NextRequest, NextResponse } from "next/server";
import { db, payments, subscriptions } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify DuitKu signature
    const data =
      body.merchantCode +
      body.merchantOrderId +
      body.amount +
      process.env.DUITKU_API_KEY;
    const expectedSignature = crypto
      .createHash("md5")
      .update(data)
      .digest("hex");

    if (body.signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Find payment
    const payment = await db.query.payments.findFirst({
      where: eq(payments.invoiceNumber, body.merchantOrderId),
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status
    let newStatus = "pending";
    if (body.statusCode === "00") {
      newStatus = "completed";
    } else if (body.statusCode === "01") {
      newStatus = "pending";
    } else {
      newStatus = "failed";
    }

    await db
      .update(payments)
      .set({
        paymentStatus: newStatus,
        paidDate: newStatus === "completed" ? new Date() : null,
        metadata: JSON.stringify(body),
      })
      .where(eq(payments.id, payment.id));

    // If payment completed, update subscription
    if (newStatus === "completed" && payment.subscriptionId) {
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, payment.subscriptionId),
      });

      if (subscription) {
        // Update nextBillingDate
        const nextDate = new Date(subscription.nextBillingDate || new Date());
        nextDate.setMonth(nextDate.getMonth() + 1);

        await db
          .update(subscriptions)
          .set({
            status: "active",
            nextBillingDate: nextDate,
          })
          .where(eq(subscriptions.id, payment.subscriptionId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
