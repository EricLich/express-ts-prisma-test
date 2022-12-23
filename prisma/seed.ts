import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Eric",
    }
  });

  console.log({ user });
};

run()
  .catch(err => {
    console.log(err);
  }).finally(async (): Promise<void> => {
    await prisma.$disconnect();
  })