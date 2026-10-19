import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const result = await db.subscription.deleteMany({});
  console.log(`Successfully removed ${result.count} subscription record(s) from database.`);
}

main()
  .catch((e) => {
    console.error("Failed to clear subscription billing info:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
