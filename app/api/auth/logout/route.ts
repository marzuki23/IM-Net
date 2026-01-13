import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear cookies
  response.cookies.delete("imnet-session");
  response.cookies.delete("imnet-user-id");
  response.cookies.delete("imnet-role");
  
  return response;
}
