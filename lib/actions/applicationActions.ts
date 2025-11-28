// lib/actions/applicationActions.ts
'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create a new application
export async function createApplication(data: any) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const application = await db.application.create({
      data: {
        ...data,
        userId,
        date_applied: data.date_applied ? new Date(data.date_applied) : new Date(),
      },
    });
    
    revalidatePath('/dashboard');
    return { success: true, data: application };
  } catch (error) {
    console.error('Error creating application:', error);
    return { success: false, error: 'Failed to create application' };
  }
}

// Update an application
export async function updateApplication(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if status changed to update last_updated
    const updatedData: any = { ...data };
    if (data.status) {
      updatedData.last_updated = new Date();
    }

    // Update with user validation in a single query
    const updatedApplication = await db.application.update({
      where: {
        id,
        userId
      },
      data: updatedData,
    });

    revalidatePath('/dashboard');
    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: 'Application not found or unauthorized' };
  }
}

// Delete an application
export async function deleteApplication(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    await db.application.delete({
      where: {
        id,
        userId
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { success: false, error: 'Application not found or unauthorized' };
  }
}

// Update application status (for drag-and-drop)
export async function updateApplicationStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const updatedApplication = await db.application.update({
      where: {
        id,
        userId
      },
      data: {
        status: status as any,
        last_updated: new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, error: 'Application not found or unauthorized' };
  }
}

// Mark reminder as sent
export async function markReminderSent(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const updatedApplication = await db.application.update({
      where: {
        id,
        userId
      },
      data: {
        is_reminder_sent: true,
        last_updated: new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error('Error marking reminder as sent:', error);
    return { success: false, error: 'Application not found or unauthorized' };
  }
}