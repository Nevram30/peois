import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedSuperAdmin() {
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
      employeeId: "SA-00001",
    },
  });

  console.log("Super admin created:", superAdmin.email);
}

async function seedArchiver() {
  const existingArchiver = await prisma.user.findFirst({
    where: { role: "ARCHIVER" },
  });

  if (existingArchiver) {
    console.log("Archiver already exists:", existingArchiver.email);
    return existingArchiver;
  }

  const hashedPassword = await bcrypt.hash("archiver123", 12);

  const archiver = await prisma.user.create({
    data: {
      name: "Test Archiver",
      email: "archiver@peomis.gov.ph",
      password: hashedPassword,
      role: "ARCHIVER",
      employeeId: "ARC-00001",
      designation: "Records Archiver",
      division: "SMAD",
      sex: "FEMALE",
      status: "ACTIVE",
    },
  });

  console.log("Archiver created:", archiver.email);
  return archiver;
}

// Sample entry so the archiver's Project Registry isn't empty on first login.
// Attaches to the first existing project; skipped if the DB has no projects.
async function seedSampleArchiveEntry(archiverId: string) {
  const existingEntry = await prisma.physicalArchiveLocation.findFirst({
    where: { createdById: archiverId },
  });

  if (existingEntry) {
    console.log("Sample archive entry already exists:", existingEntry.boxId);
    return;
  }

  const project = await prisma.project.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true },
  });

  if (!project) {
    console.log("No projects found - skipping sample archive entry.");
    return;
  }

  const entry = await prisma.physicalArchiveLocation.create({
    data: {
      roomLocation: "Wing A - Ground Floor",
      cabinetLabel: "CAB-PR-01",
      shelfNumber: 3,
      boxId: "BOX-2024-88",
      folderRange: "FLD-001 to FLD-015",
      projectId: project.id,
      createdById: archiverId,
    },
  });

  console.log(
    `Sample archive entry created: ${entry.boxId} for project "${project.title}"`,
  );
}

async function main() {
  await seedSuperAdmin();
  const archiver = await seedArchiver();
  if (archiver) {
    await seedSampleArchiveEntry(archiver.id);
  }
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
