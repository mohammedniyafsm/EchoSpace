import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Ideas and IdeaLikes...");

  // Fetch all existing users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("❌ No users found. Please seed users first.");
    return;
  }

  const ideaCategories: (
    "COMMUNICATION" | "TECHNICAL" | "ENVIRONMENT" | "PROBLEM" | "OTHER"
  )[] = ["COMMUNICATION", "TECHNICAL", "ENVIRONMENT", "PROBLEM", "OTHER"];

  const ideas: any[] = [];

  // Generate 50 random ideas
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const idea = await prisma.ideas.create({
      data: {
        userId: user.id,
        category: ideaCategories[Math.floor(Math.random() * ideaCategories.length)],
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        anonymous: faker.datatype.boolean(),
        createdAt: faker.date.recent({days: 30}), // random date within past 60 days
      },
    });
    ideas.push(idea);

    // Add random likes for this idea (0–5 likes)
    const likeCount = faker.number.int({ min: 0, max: 5 });
    for (let j = 0; j < likeCount; j++) {
      const likeUser = users[Math.floor(Math.random() * users.length)];
      try {
        await prisma.ideaLike.create({
          data: {
            ideaId: idea.id,
            userId: likeUser.id,
          },
        });
      } catch {
        // ignore duplicate likes
      }
    }
  }

  console.log(`✔ Ideas created: ${ideas.length}`);
  console.log("🎉 Seeding Ideas complete!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
