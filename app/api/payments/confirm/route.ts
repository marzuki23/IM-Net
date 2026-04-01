import { type NextRequest, NextResponse } from "next/server";
import { db, payments, subscriptions, users } from "@/db";
import { eq } from "drizzle-orm";
import { checkPaymentStatus } from "@/lib/duitku";

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (!payment.invoiceNumber) {
      return NextResponse.json(
        { error: "Invoice number not found" },
        { status: 404 }
      );
    }

    // Check payment status with DuitKu
    const statusResponse = await checkPaymentStatus(payment.invoiceNumber);

    // Update payment status based on DuitKu response
    let paymentStatus = "pending";
    if (statusResponse.statusCode === "00") {
      paymentStatus = "completed";
    } else if (statusResponse.statusCode === "01") {
      paymentStatus = "pending";
    } else {
      paymentStatus = "failed";
    }

    await db
      .update(payments)
      .set({
        paymentStatus,
        paidDate: paymentStatus === "completed" ? new Date() : null,
        metadata: JSON.stringify(statusResponse),
      })
      .where(eq(payments.id, paymentId));

    if (paymentStatus === "completed" && payment.subscriptionId) {
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, payment.subscriptionId),
      });

      if (subscription && subscription.status !== "active") {
        const nextDate = new Date(subscription.nextBillingDate || new Date());
        nextDate.setMonth(nextDate.getMonth() + 1);

        await db
          .update(subscriptions)
          .set({
            status: "active",
            nextBillingDate: nextDate,
          })
          .where(eq(subscriptions.id, payment.subscriptionId));

        await db
          .update(users)
          .set({ accountStatus: "active" })
          .where(eq(users.id, payment.userId));
      }
    }

    return NextResponse.json({
      success: true,
      paymentStatus,
      statusMessage: statusResponse.statusMessage,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
