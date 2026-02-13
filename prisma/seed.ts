import { IdeaCategory, Prisma, PrismaClient, Role, User } from "@prisma/client";

const prisma = new PrismaClient();

type SeedUser = {
  username: string;
  email: string;
  githubId: string;
  image: string;
  role: Role;
};

type SectionCategory = "SELF_INTRO" | "QUOTE" | "PRESENTATION";

const seedUsers: SeedUser[] = [
  { username: "Aarav", email: "aarav@echospace.dev", githubId: "seed-aarav", image: "https://api.dicebear.com/9.x/initials/svg?seed=Aarav", role: Role.ADMIN },
  { username: "Priya", email: "priya@echospace.dev", githubId: "seed-priya", image: "https://api.dicebear.com/9.x/initials/svg?seed=Priya", role: Role.USER },
  { username: "Rohan", email: "rohan@echospace.dev", githubId: "seed-rohan", image: "https://api.dicebear.com/9.x/initials/svg?seed=Rohan", role: Role.USER },
  { username: "Kavya", email: "kavya@echospace.dev", githubId: "seed-kavya", image: "https://api.dicebear.com/9.x/initials/svg?seed=Kavya", role: Role.USER },
  { username: "Ayaan", email: "ayaan@echospace.dev", githubId: "seed-ayaan", image: "https://api.dicebear.com/9.x/initials/svg?seed=Ayaan", role: Role.USER },
  { username: "Fatima", email: "fatima@echospace.dev", githubId: "seed-fatima", image: "https://api.dicebear.com/9.x/initials/svg?seed=Fatima", role: Role.USER },
  { username: "Zoya", email: "zoya@echospace.dev", githubId: "seed-zoya", image: "https://api.dicebear.com/9.x/initials/svg?seed=Zoya", role: Role.USER },
  { username: "Imran", email: "imran@echospace.dev", githubId: "seed-imran", image: "https://api.dicebear.com/9.x/initials/svg?seed=Imran", role: Role.USER },
  { username: "John", email: "john@echospace.dev", githubId: "seed-john", image: "https://api.dicebear.com/9.x/initials/svg?seed=John", role: Role.USER },
  { username: "Mary", email: "mary@echospace.dev", githubId: "seed-mary", image: "https://api.dicebear.com/9.x/initials/svg?seed=Mary", role: Role.USER },
  { username: "Joseph", email: "joseph@echospace.dev", githubId: "seed-joseph", image: "https://api.dicebear.com/9.x/initials/svg?seed=Joseph", role: Role.USER },
  { username: "Anna", email: "anna@echospace.dev", githubId: "seed-anna", image: "https://api.dicebear.com/9.x/initials/svg?seed=Anna", role: Role.USER },
];

const sectionCategories: SectionCategory[] = ["SELF_INTRO", "QUOTE", "PRESENTATION"];

const sectionTopics: Record<SectionCategory, string[]> = {
  SELF_INTRO: [
    "Interview Intro Practice",
    "Self Improvement Plan",
    "First Day Introduction",
    "Career Story in 60 Seconds",
    "Strengths and Goals",
    "Confident Communication",
  ],
  QUOTE: [
    "Motivation Quote of the Day",
    "Growth Mindset Quote",
    "Discipline Beats Talent",
    "1 Percent Better Every Day",
    "Quote for Interview Confidence",
    "Progress Over Perfection",
  ],
  PRESENTATION: [
    "Sleep and Productivity",
    "Coffee Habits and Focus",
    "Workout for Better Energy",
    "Self Improvement with Daily Routine",
    "Tech Trends for Developers",
    "Building Better Presentation Skills",
  ],
};

const feedbackTemplates: Record<SectionCategory, string[]> = {
  SELF_INTRO: [
    "Clear intro. Good confidence and structure.",
    "Nice self-introduction flow. Keep eye contact.",
    "Strong profile summary. Add one project example.",
    "Great energy. The opening line was memorable.",
  ],
  QUOTE: [
    "Very motivational. Loved the explanation.",
    "Quote selection was relevant and inspiring.",
    "Good delivery. Easy to understand the message.",
    "Strong takeaway for personal growth.",
  ],
  PRESENTATION: [
    "Excellent topic choice and practical points.",
    "Good pacing. Slides and examples were clear.",
    "Very useful session. The content was actionable.",
    "Great presentation. Loved the real-world angle.",
  ],
};

const ideaTemplates: Record<IdeaCategory, { title: string; description: string }[]> = {
  TECHNICAL: [
    { title: "Tech Practice Hour", description: "Run a daily 30-minute coding sprint on core concepts like arrays, APIs, and debugging." },
    { title: "Mock Interview Track", description: "Schedule weekly mock interviews with peer feedback and scorecards." },
    { title: "System Design Basics", description: "Introduce beginner-friendly design sessions with examples from real products." },
  ],
  COMMUNICATION: [
    { title: "Self Intro Club", description: "Start short daily self-intro practice rounds to improve confidence for interviews." },
    { title: "Presentation Feedback Grid", description: "Use a simple rubric for voice clarity, structure, and audience engagement." },
    { title: "Quote Reflection Minute", description: "After each motivational quote, add one-minute reflection from participants." },
  ],
  PROBLEM: [
    { title: "Attendance Drop Fix", description: "Send reminders with session highlights so people know why they should join." },
    { title: "Late Start Problem", description: "Keep a strict timekeeper role and auto-close registration at start time." },
    { title: "Topic Overlap Issue", description: "Track topics in a board to avoid repeating the same sessions too often." },
  ],
  ENVIRONMENT: [
    { title: "Focus Zone Rule", description: "Create distraction-free blocks where everyone keeps camera and mic discipline." },
    { title: "Healthy Routine Session", description: "Add weekly sleep, coffee, and workout talks for performance improvement." },
    { title: "Peer Support Pods", description: "Form small learning pods for accountability and motivation." },
  ],
  OTHER: [
    { title: "Motivation Wall", description: "Pin daily motivational quotes and allow quick reactions from everyone." },
    { title: "Weekly Wins Roundup", description: "Share one improvement win every Friday to build momentum." },
    { title: "Interview Day Checklist", description: "Maintain a shared checklist for intro, projects, and confidence tips." },
  ],
};

function buildDate(dayOffset: number, hour: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function upsertUsers(): Promise<User[]> {
  const users: User[] = [];
  for (const seedUser of seedUsers) {
    const user = await prisma.user.upsert({
      where: { githubId: seedUser.githubId },
      update: {
        username: seedUser.username,
        email: seedUser.email,
        image: seedUser.image,
        role: seedUser.role,
      },
      create: {
        username: seedUser.username,
        email: seedUser.email,
        image: seedUser.image,
        githubId: seedUser.githubId,
        role: seedUser.role,
      },
    });
    users.push(user);
  }
  return users;
}

async function clearOldSeedData(userIds: string[]) {
  const sectionRows = await prisma.section.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const sectionIds = sectionRows.map((row) => row.id);

  const ideaRows = await prisma.ideas.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const ideaIds = ideaRows.map((row) => row.id);

  await prisma.sectionLike.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        sectionIds.length > 0 ? { sectionId: { in: sectionIds } } : {},
      ],
    },
  });

  await prisma.feedback.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        sectionIds.length > 0 ? { sectionId: { in: sectionIds } } : {},
      ],
    },
  });

  if (sectionIds.length > 0) {
    await prisma.section.deleteMany({
      where: { id: { in: sectionIds } },
    });
  }

  await prisma.ideaLike.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        ideaIds.length > 0 ? { ideaId: { in: ideaIds } } : {},
      ],
    },
  });

  await prisma.ideaComment.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        ideaIds.length > 0 ? { ideaId: { in: ideaIds } } : {},
      ],
    },
  });

  if (ideaIds.length > 0) {
    await prisma.ideas.deleteMany({
      where: { id: { in: ideaIds } },
    });
  }
}

async function seedSectionsFeedbackAndLikes(users: User[]) {
  const createdSections: { id: string; category: SectionCategory; topic: string }[] = [];
  const feedbackRows: Prisma.FeedbackCreateManyInput[] = [];
  const sectionLikeRows: Prisma.SectionLikeCreateManyInput[] = [];
  const sectionLikeKeys = new Set<string>();

  for (let dayOffset = -30; dayOffset < 30; dayOffset++) {
    const dayIndex = dayOffset + 30;
    for (let categoryIndex = 0; categoryIndex < sectionCategories.length; categoryIndex++) {
      const category = sectionCategories[categoryIndex];
      const speaker = users[(dayIndex + categoryIndex) % users.length];
      const topics = sectionTopics[category];
      const topic = topics[(dayIndex + categoryIndex) % topics.length];
      const date = buildDate(dayOffset, 9 + categoryIndex * 2);

      const section = await prisma.section.create({
        data: {
          userId: speaker.id,
          category,
          topic,
          date,
        },
      });

      createdSections.push({ id: section.id, category, topic });
    }
  }

  for (let i = 0; i < createdSections.length; i++) {
    const section = createdSections[i];
    const feedbackCount = 2 + (i % 2);
    const likeCount = 2 + (i % 4);

    for (let j = 0; j < feedbackCount; j++) {
      const feedbackUser = users[(i + j + 1) % users.length];
      const feedbackList = feedbackTemplates[section.category];
      const comment = `${feedbackList[(i + j) % feedbackList.length]} (${section.topic})`;

      feedbackRows.push({
        userId: feedbackUser.id,
        sectionId: section.id,
        comment,
        anonymous: (i + j) % 3 === 0,
      });
    }

    for (let k = 0; k < likeCount; k++) {
      const likeUser = users[(i + k) % users.length];
      const likeKey = `${section.id}:${likeUser.id}`;
      if (!sectionLikeKeys.has(likeKey)) {
        sectionLikeKeys.add(likeKey);
        sectionLikeRows.push({
          sectionId: section.id,
          userId: likeUser.id,
        });
      }
    }
  }

  if (feedbackRows.length > 0) {
    await prisma.feedback.createMany({
      data: feedbackRows,
    });
  }

  if (sectionLikeRows.length > 0) {
    await prisma.sectionLike.createMany({
      data: sectionLikeRows,
      skipDuplicates: true,
    });
  }

  return createdSections.length;
}

async function seedIdeasCommentsAndLikes(users: User[]) {
  const categories: IdeaCategory[] = ["TECHNICAL", "COMMUNICATION", "PROBLEM", "ENVIRONMENT", "OTHER"];
  const createdIdeaIds: string[] = [];
  const ideaLikeRows: Prisma.IdeaLikeCreateManyInput[] = [];
  const ideaLikeKeys = new Set<string>();
  const ideaCommentRows: Prisma.IdeaCommentCreateManyInput[] = [];

  for (let dayIndex = 0; dayIndex < 30; dayIndex++) {
    const dayOffset = dayIndex - 29;
    const author = users[dayIndex % users.length];
    const category = categories[dayIndex % categories.length];
    const templateList = ideaTemplates[category];
    const template = templateList[dayIndex % templateList.length];

    const idea = await prisma.ideas.create({
      data: {
        userId: author.id,
        category,
        title: template.title,
        description: template.description,
        anonymous: dayIndex % 4 === 0,
        createdAt: buildDate(dayOffset, 17),
      },
    });

    createdIdeaIds.push(idea.id);

    const likeCount = 1 + (dayIndex % 4);
    const commentCount = 1 + (dayIndex % 3);

    for (let i = 0; i < likeCount; i++) {
      const likeUser = users[(dayIndex + i + 1) % users.length];
      const likeKey = `${idea.id}:${likeUser.id}`;
      if (!ideaLikeKeys.has(likeKey)) {
        ideaLikeKeys.add(likeKey);
        ideaLikeRows.push({
          ideaId: idea.id,
          userId: likeUser.id,
        });
      }
    }

    for (let j = 0; j < commentCount; j++) {
      const commenter = users[(dayIndex + j + 2) % users.length];
      ideaCommentRows.push({
        ideaId: idea.id,
        userId: commenter.id,
        comment: `Useful idea for interview prep and growth. (${template.title})`,
      });
    }
  }

  if (ideaLikeRows.length > 0) {
    await prisma.ideaLike.createMany({
      data: ideaLikeRows,
      skipDuplicates: true,
    });
  }

  if (ideaCommentRows.length > 0) {
    await prisma.ideaComment.createMany({
      data: ideaCommentRows,
    });
  }

  return createdIdeaIds.length;
}

async function main() {
  console.log("🌱 Seeding Echo Space demo data...");

  const users = await upsertUsers();
  const userIds = users.map((user) => user.id);

  await clearOldSeedData(userIds);

  const sectionCount = await seedSectionsFeedbackAndLikes(users);
  const ideaCount = await seedIdeasCommentsAndLikes(users);

  console.log(`✔ Users ready: ${users.length}`);
  console.log(`✔ Sections created (past 30 days + upcoming 30 days): ${sectionCount}`);
  console.log(`✔ Ideas created: ${ideaCount}`);
  console.log("🎉 Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
