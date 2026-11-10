import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  //   const password = await hash("rafid123", 12);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("12345678", salt);
  await prisma.user.deleteMany({
    where: {
      role: "ADMIN",
    },
  });
  const user = await prisma.user.upsert({
    where: { email: "admin@guest.com" },
    update: {},
    create: {
      email: "admin@guest.com",
      username: "Admin",
      password: hashed,
      salt,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log({ user });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
