import { db, users } from "./db";
import { eq } from "drizzle-orm";

async function main() {
  const adminEmail = "admin@imnet.com";
  const user = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  console.log("User:", user);
  process.exit(0);
}

main();
