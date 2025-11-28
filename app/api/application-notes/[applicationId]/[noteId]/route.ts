import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

// DELETE route for deleting a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { applicationId: string, noteId: string } }
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

    const { applicationId, noteId } = params;

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

    // Delete the specific note
    await db.applicationNote.delete({
      where: {
        id: noteId,
        applicationId
      }
    });

    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting application note:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete application note' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}