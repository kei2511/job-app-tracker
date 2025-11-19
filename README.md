# Job Application Tracker

A Next.js application to track job applications with a Kanban board interface.

## Features

- Kanban board for visualizing job applications
- CRUD operations for job applications
- Automated "ghosting" reminders
- Dashboard with application statistics
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma ORM
- @hello-pangea/dnd for drag-and-drop

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file with your database URL:

```env
DATABASE_URL="your_postgresql_connection_string"
```

3. Set up the database:

```bash
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000