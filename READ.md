Act as a Senior Full Stack Developer. I need you to build a "Job Application Tracker" web application.

## 1. Project Overview

The goal is to build a standalone personal dashboard to track job applications, visualize progress via a Kanban board, and receive automated reminders for applications that have been unresponsive (ghosted) for too long.

## 2. Tech Stack Requirements

Please use the following specific stack:

- **Framework:** Next.js 14 (App Router) with TypeScript.
- **Styling:** Tailwind CSS and 'shadcn/ui' for UI components (Cards, Dialogs, Badges).
- **Database:** PostgreSQL (via Supabase or Neon).
- **ORM:** Prisma ORM.
- **Kanban Library:** Use '@hello-pangea/dnd' or 'dnd-kit' for the Drag-and-Drop functionality.

## 3. Database Schema

Create a table named `applications` with the following fields:

- `id`: Primary Key (UUID or Auto-increment).
- `position`: String (e.g., Frontend Dev).
- `company_name`: String.
- `platform`: String/Enum (e.g., LinkedIn, Glints, JobStreet, Referral).
- `job_link`: Text (URL to the job post).
- `contract_type`: Enum (Full-time, Internship, Freelance, Contract).
- `work_model`: Enum (WFO, WFH, Hybrid).
- `location`: String.
- `salary_expectation`: String or Number.
- `status`: Enum. Values: ['Wishlist', 'Applied', 'Screening', 'Interview_HR', 'Interview_User', 'Offering', 'Rejected', 'Ghosted']. Default is 'Applied'.
- `cv_version`: String (e.g., "CV_Creative_V2.pdf").
- `notes`: Text.
- `date_applied`: Date (Defaults to current date).
- `last_updated`: Timestamp (Updates automatically when status changes).
- `is_reminder_sent`: Boolean (Default: False).
- `created_at`: Timestamp.

## 4. Key Features & Business Logic

### A. Kanban Board (Core Feature)

- Visualize applications as "Cards" categorized by `status` columns.
- Implement Drag-and-Drop functionality:
  - Dragging a card from one column to another must update the `status` in the database immediately via Server Actions or API.
  - Dragging a card should also update the `last_updated` timestamp.

### B. CRUD Operations

- **Create:** Form to add new applications (use shadcn Form/Dialog). `date_applied` defaults to today but can be edited.
- **Read:** View list/board of applications.
- **Update:** Edit details or status.
- **Delete:** Remove an application.

### C. Dashboard Stats

Display a summary at the top:

- Total Applications.
- Response Rate % (Count of 'Interview' stages / Total Applied).
- Active Processes (Count of non-rejected/non-ghosted).

### D. Automated "Ghosting" Reminder (Crucial Logic)

Implement a logic to detect unresponsive applications:

- **Logic:** Identify applications where:
  1. `status` is 'Applied'.
  2. Current Date - `date_applied` >= 14 days.
  3. `is_reminder_sent` is False.
- **Action:**
  - Visual Indication: Highlight these cards on the UI (e.g., Red Border or "⚠️ Check Status" badge).
  - Notification/Alert: Show a clear message (Toast or Alert) saying: "You haven't heard back from [Company] in 2 weeks. Follow up or mark as Ghosted."
  - Allow the user to quickly change status to 'Ghosted' directly from the notification/card.

## 5. UI/UX Requirements

- Clean, modern, and professional design.
- Responsive (Mobile-friendly).
- Use color coding for statuses (e.g., Green for Offering, Red for Rejected, Grey for Ghosted/Wishlist).

## 6. Output Instructions

1. First, propose the folder structure and the `schema.prisma` file.
2. Then, provide the step-by-step implementation code starting with the Database/Prisma setup, then Server Actions, and finally the Frontend components (Kanban Board).
3. Ensure the "Ghosting Reminder" logic is clearly implemented in the code.
