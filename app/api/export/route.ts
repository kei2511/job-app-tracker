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

    // Get all applications for the user
    const applications = await db.application.findMany({
      where: { userId },
      orderBy: { date_applied: 'desc' },
    });

    // Transform applications to CSV-ready format
    const csvData = applications.map(app => ({
      position: app.position,
      company_name: app.company_name,
      platform: app.platform || '',
      job_link: app.job_link || '',
      contract_type: app.contract_type || '',
      work_model: app.work_model || '',
      location: app.location || '',
      salary_expectation: app.salary_expectation || '',
      status: app.status,
      cv_version: app.cv_version || '',
      notes: app.notes || '',
      date_applied: app.date_applied.toISOString(),
      last_updated: app.last_updated.toISOString(),
      is_reminder_sent: app.is_reminder_sent ? 'Yes' : 'No'
    }));

    // Generate CSV content
    let csvContent = 'Position,Company Name,Platform,Job Link,Contract Type,Work Model,Location,Salary Expectation,Status,CV Version,Notes,Date Applied,Last Updated,Reminder Sent\n';
    
    csvData.forEach(row => {
      // Properly escape commas and quotes in CSV fields
      const escapedRow = Object.values(row).map(field => {
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Set headers for CSV download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', 'attachment; filename="job_applications.csv"');

    return new Response(csvContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error exporting applications:', error);
    return new Response(JSON.stringify({ error: 'Failed to export applications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}