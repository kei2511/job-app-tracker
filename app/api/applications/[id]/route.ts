// app/api/applications/[id]/route.ts
import { db } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const application = await db.application.findFirst({
      where: {
        id,
        userId
      },
    });

    if (!application) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(application), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const data = await request.json();

    // Verify that the application belongs to the current user in a single query
    try {
      const updatedApplication = await db.application.update({
        where: {
          id,
          userId
        },
        data: {
          ...data,
          last_updated: new Date(),
        },
      });

      return new Response(JSON.stringify(updatedApplication), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // If update fails, it means the application doesn't exist or doesn't belong to the user
      return new Response(JSON.stringify({ error: 'Application not found or unauthorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating application:', error);
    return new Response(JSON.stringify({ error: 'Failed to update application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Delete the application if it belongs to the current user in a single query
    try {
      await db.application.delete({
        where: {
          id,
          userId
        },
      });

      return new Response(JSON.stringify({ message: 'Application deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // If delete fails, it means the application doesn't exist or doesn't belong to the user
      return new Response(JSON.stringify({ error: 'Application not found or unauthorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}