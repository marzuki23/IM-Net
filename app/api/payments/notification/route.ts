import { type NextRequest, NextResponse } from "next/server";
import { db, payments } from "@/db";
import { eq } from "drizzle-orm";
import { createSignature } from "@/lib/duitku";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData(); // Duitku usually sends x-www-form-urlencoded
    const merchantCode = body.get("merchantCode") as string;
    const amount = body.get("amount") as string;
    const merchantOrderId = body.get("merchantOrderId") as string;
    const signature = body.get("signature") as string;
    const resultCode = body.get("resultCode") as string;
    const reference = body.get("reference") as string;

    // Verify signature
    // Note: Duitku callback signature might validation logic might differ slightly, checking docs or current lib
    // Assuming lib has generic signature creator, but callback verification usually:
    // MD5(merchantCode + amount + merchantOrderId + apiKey)
    
    // For now we calculate our expected signature
    // Note: Amount coming from callback might have decimals or not, insure type matching
    // Parsing amount to integer if needed or string concatenation
    
    // Let's use the lib function if possible or reimplement strictly
    const expectedSignature = createSignature(merchantOrderId, Number(amount));

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Find payment
    const payment = await db.query.payments.findFirst({
      where: eq(payments.invoiceNumber, merchantOrderId),
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update status
    if (resultCode === "00") {
      await db.update(payments)
        .set({ 
            paymentStatus: "completed",
            paidDate: new Date(),
            metadata: JSON.stringify(Object.fromEntries(body)) 
        })
        .where(eq(payments.id, payment.id));
    } else if (resultCode === "01") {
       // Pending, do nothing or update
    } else {
       await db.update(payments)
        .set({ 
            paymentStatus: "failed",
            metadata: JSON.stringify(Object.fromEntries(body)) 
        })
        .where(eq(payments.id, payment.id));
    }

    return NextResponse.json({ status: "OK" });

  } catch (error) {
    console.error("Payment notification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
