import { db } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    // Redirect to sign in if not authenticated
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const applications = await db.application.findMany({
    where: {
      userId
    },
    orderBy: {
      date_applied: 'desc',
    },
  });

  return (
    <DashboardClient initialApplications={applications} />
  );
}