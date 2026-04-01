import { type NextRequest, NextResponse } from "next/server";
import { db, subscriptions, payments, users } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { createDuitkuPayment } from "@/lib/duitku";

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create invoice number
    const invoiceNumber = `INV-REN-${Date.now()}-${userId.slice(0, 8)}`;

    // Create payment for renewal
    const newPayment = await db
      .insert(payments)
      .values({
        userId,
        subscriptionId,
        amount: subscription.monthlyPrice,
        paymentMethod: "duitku",
        paymentStatus: "pending",
        invoiceNumber,
        description: `Perpanjangan ${subscription.packageName}`,
      })
      .returning();

    // Create Duitku Transaction
    const duitkuResponse = await createDuitkuPayment({
      amount: Number(newPayment[0].amount),
      phone: user.phone || "08111111111", // default fallback
      email: user.email,
      invoiceNumber: invoiceNumber,
      description: `Perpanjangan ${subscription.packageName}`,
      returnUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/payments`,
      expiryPeriod: 24,
    });

    if (!duitkuResponse || !duitkuResponse.paymentUrl) {
       return NextResponse.json(
         { error: "Gagal memproses pembayaran Duitku" },
         { status: 500 }
       );
    }
    
    // Update invoice metadata in DB
    await db
      .update(payments)
      .set({
        duitkuReference: duitkuResponse.reference,
        metadata: JSON.stringify(duitkuResponse),
      })
      .where(eq(payments.id, newPayment[0].id));

    return NextResponse.json({
      success: true,
      paymentId: newPayment[0].id,
      paymentUrl: duitkuResponse.paymentUrl,
    });
  } catch (error) {
    console.error("Renewal error:", error);
    return NextResponse.json(
      { error: "Failed to create renewal payment" },
      { status: 500 }
    );
  }
}
