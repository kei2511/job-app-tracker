// lib/seed.ts
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  // Create default users if they don't exist
  const adminUser = await db.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await bcrypt.hash('password123', 10),
    },
  });

  const regularUser = await db.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: await bcrypt.hash('userpass', 10),
    },
  });

  console.log(`Database seeded. Admin user: ${adminUser.username}, Regular user: ${regularUser.username}`);
}