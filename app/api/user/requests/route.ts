import { NextRequest, NextResponse } from "next/server";
import { db, accountRequests, users } from "@/db";
import { getSession } from "@/lib/sessions";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId, packageName, reason } = await request.json();

    if (!packageId || !packageName) {
      return NextResponse.json(
        { error: "Paket harus dipilih" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request
    const existingRequest = await db.query.accountRequests.findFirst({
      where: (requests, { and, eq }) => 
        and(
          eq(requests.userId, session.user.id),
          eq(requests.status, "pending")
        ),
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Anda sudah memiliki pengajuan yang sedang diproses" },
        { status: 400 }
      );
    }

    await db.insert(accountRequests).values({
      userId: session.user.id,
      requestType: "new_account", // or 'new_subscription' depending on context, using 'new_account' for now as per schema
      desiredPackage: packageName,
      reason: reason || `Pengajuan paket ${packageName}`,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Request submission error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pengajuan" },
      { status: 500 }
    );
  }
}
