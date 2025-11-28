-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('FULL_TIME', 'INTERNSHIP', 'FREELANCE', 'CONTRACT');

-- CreateEnum
CREATE TYPE "WorkModel" AS ENUM ('WFO', 'WFH', 'HYBRID');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW_HR', 'INTERVIEW_USER', 'OFFERING', 'REJECTED', 'GHOSTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "platform" TEXT,
    "job_link" TEXT,
    "contract_type" "ContractType",
    "work_model" "WorkModel",
    "location" TEXT,
    "salary_expectation" TEXT,
    "status" "Status" NOT NULL DEFAULT 'APPLIED',
    "cv_version" TEXT,
    "notes" TEXT,
    "date_applied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "is_reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
