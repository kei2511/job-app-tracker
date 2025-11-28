import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
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

    const { applicationId, isBookmarked, priority } = await request.json();

    if (!applicationId) {
      return new Response(JSON.stringify({ error: 'Missing application ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (isBookmarked !== undefined) {
      updateData.is_bookmarked = isBookmarked;
    }
    if (priority !== undefined) {
      updateData.priority = priority;
    }

    // Update the application
    const updatedApplication = await db.application.update({
      where: {
        id: applicationId,
        userId
      },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedApplication), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating application bookmark/priority:', error);
    return new Response(JSON.stringify({ error: 'Failed to update application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}