# Student Management System

A web-based application to manage student records efficiently, built using Next.js, TypeScript, Prisma ORM, and PostgreSQL.

## Features

- Add new student records
- View the student list
- Edit existing student details
- Delete student records
- Search for students
- Store student data persistently in PostgreSQL
- Validate unique roll numbers

## Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma

## Student Information

Each student record contains:

- Student ID
- Student Name
- Roll Number
- Department
- Semester
- Created At
- Updated At

## Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- A code editor such as Visual Studio Code

## Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create or update the `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/student_management?schema=public"
```

Replace `USER` and `PASSWORD` with your local PostgreSQL credentials. Do not upload this file or expose your database password publicly.

### 3. Apply database migrations

```bash
npx prisma migrate dev
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If Next.js uses another port, use the URL displayed in the terminal.

## Project Structure

```text
student-management/
├── app/
│   ├── api/
│   │   └── students/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── lib/
│   │   └── prisma.ts
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── README.md
```

## Usage

1. Open the application in your browser.
2. Add a student using the student form.
3. View and search student records.
4. Edit student information when needed.
5. Delete records that are no longer required.

## Project Objective

The objective of this project is to provide a simple interface for managing student information while demonstrating frontend development, API integration, database operations, and persistent data storage.

## Security Note
