// app/api/applications/route.ts
import { db } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let applications;
    
    const whereClause = {
      userId: session.user.id,
      ...(status && { status: status as any })
    };
    
    applications = await db.application.findMany({
      where: whereClause,
      orderBy: { date_applied: 'desc' },
    });
    
    return new Response(JSON.stringify(applications), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch applications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    
    // Set default status to 'APPLIED' if not provided
    if (!data.status) {
      data.status = 'APPLIED';
    }
    
    const application = await db.application.create({
      data: {
        ...data,
        userId: session.user.id,
        date_applied: data.date_applied ? new Date(data.date_applied) : new Date(),
      },
    });
    
    return new Response(JSON.stringify(application), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return new Response(JSON.stringify({ error: 'Failed to create application' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}