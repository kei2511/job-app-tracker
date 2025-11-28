import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

// A separate endpoint to remove a specific tag from an application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { applicationId: string, tagId: string } }
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

    const { applicationId, tagId } = params;

    // Verify that the application belongs to the user
    const application = await db.application.findFirst({
      where: {
        id: applicationId,
        userId
      }
    });

    if (!application) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify that the tag belongs to the user
    const tag = await db.tag.findFirst({
      where: {
        id: tagId,
        userId
      }
    });

    if (!tag) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Remove the association
    await db.applicationTag.delete({
      where: {
        applicationId_tagId: {
          applicationId,
          tagId
        }
      }
    });

    return new Response(JSON.stringify({ message: 'Tag removed from application successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error removing tag from application:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove tag from application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}