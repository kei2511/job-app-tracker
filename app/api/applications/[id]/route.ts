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

    const { id } = params;
    const application = await db.application.findUnique({
      where: { 
        id,
        userId: session.user.id
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

    const { id } = params;
    const data = await request.json();

    // Verify that the application belongs to the current user
    const application = await db.application.findUnique({
      where: { id }
    });
    
    if (application?.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update last_updated timestamp
    const updatedApplication = await db.application.update({
      where: { id },
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

    const { id } = params;
    
    // Verify that the application belongs to the current user
    const application = await db.application.findUnique({
      where: { id }
    });
    
    if (application?.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.application.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Application deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}