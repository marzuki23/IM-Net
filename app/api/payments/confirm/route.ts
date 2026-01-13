import { type NextRequest, NextResponse } from "next/server";
import { db, payments } from "@/db";
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
