import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Running Royal V Properties Super Admin Bootstrap...");

  const adminEmail = process.env.INITIAL_SUPER_ADMIN_EMAIL?.trim();
  const adminName = process.env.INITIAL_SUPER_ADMIN_NAME?.trim() || "Executive Admin";
  const adminPhone = process.env.INITIAL_SUPER_ADMIN_PHONE?.trim() || null;

  if (!adminEmail) {
    throw new Error("INITIAL_SUPER_ADMIN_EMAIL environment variable is required to bootstrap the Super Admin account.");
  }

  let adminPassword = process.env.INITIAL_SUPER_ADMIN_PASSWORD?.trim();
  let isGenerated = false;

  if (!adminPassword) {
    // Generate a cryptographically secure random password if none was supplied
    adminPassword = crypto.randomBytes(18).toString("base64url") + "!Aa1";
    isGenerated = true;
  }

  // Hash using bcrypt with cost factor 12
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

  // Immutable audit log recording the bootstrap event
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
  console.log("✅ Super Admin Account Initialized / Updated Successfully!");
  console.log(`   User ID: ${superAdmin.id}`);
  console.log(`   Name:    ${superAdmin.name}`);
  console.log(`   Email:   ${superAdmin.email}`);
  console.log(`   Role:    ${superAdmin.role}`);
  console.log(`   Status:  ${superAdmin.status}`);
  if (isGenerated) {
    console.log("   Password Status: [Generated and securely hashed - please reset via password reset flow]");
  } else {
    console.log("   Password Status: [Configured from INITIAL_SUPER_ADMIN_PASSWORD and securely hashed]");
  }
  console.log("============================================================");
}

main()
  .catch((e) => {
    console.error("❌ Failed to initialize Super Admin:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
