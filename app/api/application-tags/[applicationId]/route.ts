import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

// Get all tags for a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
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

    const { applicationId } = params;

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

    // Get all tags for the application
    const applicationTags = await db.applicationTag.findMany({
      where: {
        applicationId
      },
      include: {
        tag: true
      }
    });

    const tags = applicationTags.map(at => at.tag);

    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching application tags:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch application tags' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Add a tag to an application
export async function POST(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
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

    const { applicationId } = params;
    const { tagId } = await request.json();

    if (!applicationId || !tagId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

    // Check if the tag is already associated with the application
    const existingAssociation = await db.applicationTag.findUnique({
      where: {
        applicationId_tagId: {
          applicationId,
          tagId
        }
      }
    });

    if (existingAssociation) {
      return new Response(JSON.stringify({ error: 'Tag already associated with application' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create the association
    const applicationTag = await db.applicationTag.create({
      data: {
        applicationId,
        tagId
      }
    });

    return new Response(JSON.stringify(applicationTag), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding tag to application:', error);
    return new Response(JSON.stringify({ error: 'Failed to add tag to application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Remove a tag from an application
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