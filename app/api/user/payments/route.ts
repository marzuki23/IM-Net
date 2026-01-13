import { type NextRequest, NextResponse } from "next/server";
import { db, payments } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPayments = await db.query.payments.findMany({
      where: eq(payments.userId, userId),
    });

    return NextResponse.json({
      payments: userPayments.map((p) => ({
        id: p.id,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentStatus: p.paymentStatus,
        invoiceNumber: p.invoiceNumber,
        description: p.description,
        paidDate: p.paidDate,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
