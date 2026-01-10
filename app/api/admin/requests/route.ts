import { NextRequest, NextResponse } from "next/server";
import { db, accountRequests, users } from "@/db";
import { getSession } from "@/lib/sessions";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await db.query.accountRequests.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(accountRequests.createdAt)],
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
