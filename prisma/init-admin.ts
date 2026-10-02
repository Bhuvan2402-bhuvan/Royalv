import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Initializing Royal V Properties Production Super Admin...");

  const adminEmail = process.env.INITIAL_SUPER_ADMIN_EMAIL || "royalvproperties@gmail.com";
  const adminName = process.env.INITIAL_SUPER_ADMIN_NAME || "Royal V";
  const adminPhone = process.env.INITIAL_SUPER_ADMIN_PHONE || "+91 98858 39645";

  let adminPassword = process.env.INITIAL_SUPER_ADMIN_PASSWORD;
  let generatedPassword = false;

  if (!adminPassword) {
    // Generate a secure 16-character random password if not provided in environment
    adminPassword = crypto.randomBytes(12).toString("base64").replace(/[^a-zA-Z0-9]/g, "") + "!A1";
    generatedPassword = true;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      phone: adminPhone,
      passwordHash: passwordHash,
    },
    create: {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      passwordHash: passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "SUPER_ADMIN_BOOTSTRAPPED",
      entity: "User",
      entityId: superAdmin.id,
      details: {
        timestamp: new Date().toISOString(),
        email: adminEmail,
        environment: process.env.NODE_ENV || "production",
      },
    },
  });

  console.log("============================================================");
  console.log("✅ Super Admin Account Initialized Successfully!");
  console.log(`   Name:  ${superAdmin.name}`);
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Role:  ${superAdmin.role}`);
  if (generatedPassword) {
    console.log(`   🔑 Generated Password: ${adminPassword}`);
    console.log("   ⚠️ Please record this password and change it upon first login.");
  } else {
    console.log("   🔑 Password: (Configured via INITIAL_SUPER_ADMIN_PASSWORD env)");
  }
  console.log("============================================================");
}

main()
  .catch((e) => {
    console.error("❌ Failed to initialize Super Admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
