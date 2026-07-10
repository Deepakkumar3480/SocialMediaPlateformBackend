import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.view.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Kumar",
        email: "kumar@example.com",
        password: "123456",
        role: Role.MODERATOR,
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
        password: "123456",
        role: Role.STUDENT,
      },
      {
        name: "Priya",
        email: "priya@example.com",
        password: "123456",
        role: Role.STUDENT,
      },
      {
        name: "Amit",
        email: "amit@example.com",
        password: "123456",
        role: Role.STUDENT,
      },
    ],
  });

  const allUsers = await prisma.user.findMany();

  // Courses
  await prisma.course.createMany({
    data: [
      {
        title: "Node.js",
        description: "Backend Development",
      },
      {
        title: "React",
        description: "Frontend Development",
      },
    ],
  });

  const courses = await prisma.course.findMany();

  // Posts
  await prisma.post.createMany({
    data: [
      {
        title: "Node Basics",
        content: "Introduction to Node.js",
        authorId: allUsers[0].id,
        courseId: courses[0].id,
      },
      {
        title: "Express Routing",
        content: "Learn Express Router",
        authorId: allUsers[1].id,
        courseId: courses[0].id,
      },
      {
        title: "React Hooks",
        content: "Understanding useState & useEffect",
        authorId: allUsers[2].id,
        courseId: courses[1].id,
      },
      {
        title: "Redux Toolkit",
        content: "State management in React",
        authorId: allUsers[3].id,
        courseId: courses[1].id,
      },
    ],
  });

  const posts = await prisma.post.findMany();

  // Enrollments
  await prisma.enrollment.createMany({
     data: [
    {
      userId: allUsers[0].id, // Kumar
      courseId: courses[0].id, // Node.js
    },
    {
      userId: allUsers[0].id, // Kumar
      courseId: courses[1].id, // React
    },
    {
      userId: allUsers[1].id, // Rahul
      courseId: courses[0].id, // Node.js
    },
    {
      userId: allUsers[2].id, // Priya
      courseId: courses[1].id, // React
    },
    {
      userId: allUsers[3].id, // Amit
      courseId: courses[0].id, // Node.js
    },
    {
      userId: allUsers[3].id, // Amit
      courseId: courses[1].id, // React
    },
  ],
  });

  // Likes
  await prisma.like.createMany({
    data: [
      {
        userId: allUsers[1].id,
        postId: posts[0].id,
      },
      {
        userId: allUsers[2].id,
        postId: posts[1].id,
      },
    ],
  });

  // Comments
  await prisma.comment.createMany({
    data: [
      {
        userId: allUsers[1].id,
        postId: posts[0].id,
        content: "Very helpful!",
      },
      {
        userId: allUsers[2].id,
        postId: posts[2].id,
        content: "Great explanation.",
      },
    ],
  });

  // Saved Posts
  await prisma.savedPost.createMany({
    data: [
      {
        userId: allUsers[1].id,
        postId: posts[0].id,
      },
      {
        userId: allUsers[3].id,
        postId: posts[2].id,
      },
    ],
  });

  // Views
  await prisma.view.createMany({
    data: [
      {
        userId: allUsers[1].id,
        postId: posts[0].id,
      },
      {
        userId: allUsers[2].id,
        postId: posts[2].id,
      },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });