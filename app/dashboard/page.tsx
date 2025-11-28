import { db } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const applications = await db.application.findMany({
    orderBy: {
      date_applied: 'desc',
    },
  });

  return (
    <DashboardClient initialApplications={applications} />
  );
}