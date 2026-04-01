import { type NextRequest, NextResponse } from "next/server";
import { db, payments, subscriptions, users } from "@/db";
import { eq, desc } from "drizzle-orm";
import { createDuitkuPayment } from "@/lib/duitku";
import { getSession } from "@/lib/sessions";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageName, speed, price } = await request.json();

    if (!packageName || !speed || !price) {
      return NextResponse.json(
        { error: "Data paket tidak lengkap" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if there is already an active subscription
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: (subscriptions, { eq, and }) =>
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        ),
      orderBy: [desc(subscriptions.createdAt)],
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Anda sudah memiliki langganan aktif" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create subscription with status pending
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        packageName,
        speed,
        monthlyPrice: price.toString(),
        status: "pending",
        startDate: new Date(),
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      })
      .returning();

    // Create invoice number
    const invoiceNumber = `INV-${Date.now()}-${userId.slice(0, 8)}`;

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        userId,
        subscriptionId: subscription.id,
        amount: price.toString(),
        paymentMethod: "duitku",
        paymentStatus: "pending",
        invoiceNumber,
        description: `Pembayaran ${packageName} - ${new Date().toLocaleDateString(
          "id-ID"
        )}`,
      })
      .returning();

    // Create DuitKu payment
    const duitkuResponse = await createDuitkuPayment({
      amount: price,
      phone: user.phone || "08111111111", // Add a default phone if not present
      email: user.email,
      invoiceNumber,
      description: `WiFi ${packageName}`,
      returnUrl: `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/dashboard/payments`,
      expiryPeriod: 24,
    });

    // Update payment with DuitKu reference
    await db
      .update(payments)
      .set({
        duitkuReference: duitkuResponse.reference,
        metadata: JSON.stringify(duitkuResponse),
      })
      .where(eq(payments.id, payment.id));

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl: duitkuResponse.paymentUrl,
    });
  } catch (error) {
    console.error("Subscription & Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription and payment" },
      { status: 500 }
    );
  }
}
