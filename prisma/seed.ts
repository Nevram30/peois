import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
  });

  if (existingSuperAdmin) {
    console.log("Super admin already exists:", existingSuperAdmin.email);
    return;
  }

  const hashedPassword = await bcrypt.hash("superadmin123", 12);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@peomis.gov.ph",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super admin created:", superAdmin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
