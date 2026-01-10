import "dotenv/config";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function checkConnection() {
  console.log("Checking environment variables...");
  console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
  console.log("NEXT_PUBLIC_GOOGLE_CLIENT_ID present:", !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  console.log("GOOGLE_CLIENT_SECRET present:", !!process.env.GOOGLE_CLIENT_SECRET);
  console.log("DUITKU_MERCHANT_CODE present:", !!process.env.DUITKU_MERCHANT_CODE);
  console.log("DUITKU_API_KEY present:", !!process.env.DUITKU_API_KEY);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing!");
    return;
  }

  console.log("\nTesting database connection...");
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("✅ Database connected successfully!");
    console.log("Time:", result[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    process.exit(0);
  }
}

checkConnection();
