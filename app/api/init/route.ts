// app/api/init/route.ts
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Skip init during build if database is not accessible
    if (!process.env.DATABASE_URL) {
      return new Response(
        JSON.stringify({ message: 'Database not configured' }),
        { 
          status: 503, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

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

    return new Response(
      JSON.stringify({ 
        message: 'Database initialized', 
        admin: { username: adminUser.username },
        user: { username: regularUser.username }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Init error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during initialization' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}