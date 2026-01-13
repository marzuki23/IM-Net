import "dotenv/config";
import { db } from "./db";
import { users } from "./db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding users...");

  try {
    // 1. Create Admin
    const adminEmail = "admin@imnet.com";
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    });

    if (!existingAdmin) {
      const adminPassword = await hash("admin123", 10);
      await db.insert(users).values({
        email: adminEmail,
        name: "Admin User",
        password: adminPassword,
        role: "admin",
        accountStatus: "active",
        phone: "081234567890",
      });
      console.log("✅ Admin created: admin@imnet.com / admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // 2. Create User
    const userEmail = "user@imnet.com";
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    if (!existingUser) {
      const userPassword = await hash("user123", 10);
      await db.insert(users).values({
        email: userEmail,
        name: "Dummy User",
        password: userPassword,
        role: "user",
        accountStatus: "active",
        phone: "089876543210",
      });
      console.log("✅ User created: user@imnet.com / user123");
    } else {
      console.log("ℹ️ User already exists");
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
