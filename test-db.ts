import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create client exactly as we do in the app
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  console.log("🚀 Testing Prisma Accelerate Connection...");
  const startTime = Date.now();

  try {
    // 1. Create a User and a Quiz in one transaction
    const user = await prisma.user.create({
      data: {
        email: `teacher_${Date.now()}@test.com`,
        password: "hashed_dummy_password",
        name: "Accelerate Tester",
        role: "TEACHER",
        createdQuizzes: {
          create: [
            {
              title: "Testing Postgres Connection Speed",
              description: "This quiz verifies our Prisma Accelerate configuration.",
              category: "Cloud Ops",
            },
          ],
        },
      },
      include: {
        createdQuizzes: true,
      },
    });

    const endTime = Date.now();
    console.log(`\n✅ Database Write Successful! (Took ${endTime - startTime}ms)`);
    console.log("Created Test User:", user.email);
    console.log("Created Test Quiz:", user.createdQuizzes[0].title);

    // 2. Fetch the newly created quiz to test read speed
    const fetchStart = Date.now();
    const fetchedQuiz = await prisma.quiz.findUnique({
      where: { id: user.createdQuizzes[0].id },
    });
    const fetchEnd = Date.now();

    console.log(`\n⚡ Database Read Successful! (Took ${fetchEnd - fetchStart}ms)`);
    console.log("Fetched Quiz Data:", fetchedQuiz?.title);

  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    process.exit(0);
  }
}

main();
