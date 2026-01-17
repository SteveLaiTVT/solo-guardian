/**
 * @file seed-admin.ts
 * @description Seed script to create admin and test users
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding admin and test users...');

  // Create admin user
  const adminPassword = await bcrypt.hash('AdminPassword123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sologuardian.com' },
    update: {},
    create: {
      email: 'admin@sologuardian.com',
      name: 'System Admin',
      passwordHash: adminPassword,
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create super admin user
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@sologuardian.com' },
    update: {},
    create: {
      email: 'superadmin@sologuardian.com',
      name: 'Super Admin',
      passwordHash: superAdminPassword,
      role: UserRole.super_admin,
      status: UserStatus.active,
    },
  });
  console.log(`Created super admin user: ${superAdmin.email}`);

  // Create caregiver user
  const caregiverPassword = await bcrypt.hash('Caregiver123!', 12);
  const caregiver = await prisma.user.upsert({
    where: { email: 'caregiver@example.com' },
    update: {},
    create: {
      email: 'caregiver@example.com',
      name: 'Test Caregiver',
      passwordHash: caregiverPassword,
      role: UserRole.caregiver,
      status: UserStatus.active,
    },
  });
  console.log(`Created caregiver user: ${caregiver.email}`);

  // Create elder user
  const elderPassword = await bcrypt.hash('Elder123!', 12);
  const elder = await prisma.user.upsert({
    where: { email: 'elder@example.com' },
    update: {},
    create: {
      email: 'elder@example.com',
      name: 'Test Elder',
      passwordHash: elderPassword,
      role: UserRole.user,
      status: UserStatus.active,
    },
  });
  console.log(`Created elder user: ${elder.email}`);

  // Create caregiver relationship (accepted)
  await prisma.caregiverRelation.upsert({
    where: {
      caregiverId_elderId: {
        caregiverId: caregiver.id,
        elderId: elder.id,
      },
    },
    update: {},
    create: {
      caregiverId: caregiver.id,
      elderId: elder.id,
      isAccepted: true,
      permissions: {},
    },
  });
  console.log('Created caregiver relationship');

  // Create check-in settings for elder
  await prisma.checkInSettings.upsert({
    where: { userId: elder.id },
    update: {},
    create: {
      userId: elder.id,
      deadlineTime: '10:00',
      reminderTime: '09:00',
      reminderEnabled: true,
      timezone: 'Asia/Shanghai',
    },
  });
  console.log('Created check-in settings for elder');

  // Create some check-ins for testing
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  await prisma.checkIn.upsert({
    where: {
      userId_checkInDate: {
        userId: elder.id,
        checkInDate: yesterday,
      },
    },
    update: {},
    create: {
      userId: elder.id,
      checkInDate: yesterday,
      note: 'Feeling good yesterday',
    },
  });
  console.log('Created test check-in for yesterday');

  console.log('\n=== Test Credentials ===');
  console.log('Admin: admin@sologuardian.com / AdminPassword123!');
  console.log('Super Admin: superadmin@sologuardian.com / SuperAdmin123!');
  console.log('Caregiver: caregiver@example.com / Caregiver123!');
  console.log('Elder: elder@example.com / Elder123!');
  console.log('========================\n');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
