import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all applications with upcoming reminders (today and in the future)
    const now = new Date();
    const reminders = await db.application.findMany({
      where: {
        userId,
        reminder_date: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) // From today onwards
        },
        is_reminder_sent: false
      },
      orderBy: { reminder_date: 'asc' },
    });

    return new Response(JSON.stringify(reminders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reminders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { applicationId, reminderDate } = await request.json();

    if (!applicationId || !reminderDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the application with the reminder date
    const updatedApplication = await db.application.update({
      where: {
        id: applicationId,
        userId
      },
      data: {
        reminder_date: new Date(reminderDate)
      },
    });

    return new Response(JSON.stringify(updatedApplication), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error setting reminder:', error);
    return new Response(JSON.stringify({ error: 'Failed to set reminder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}