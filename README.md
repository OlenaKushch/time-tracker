This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



1. Project Structure (Final Overview)

time-tracker/
├── prisma/                 # Database configuration
│   ├── migrations/         # History of database changes
│   ├── dev.db              # SQLite database file (generated after migration)
│   └── schema.prisma       # Database models and connection settings
├── public/                 
├── src/                    
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Backend API routes
│   │   │   └── entries/
│   │   │       └── route.ts # API logic (GET/POST) for time entries
│   │   ├── lib/            
│   │   │   └── prisma.ts   # Reusable Prisma Client instance
│   │   ├── globals.css     
│   │   ├── layout.tsx      
│   │   └── page.tsx       
│   └── components/         
│       ├── EntryHistory/   # History list component
│       │   ├── EntryHistory.module.css
│       │   └── EntryHistory.tsx
│       └── TimeEntryForm/  # Data entry form component
│           ├── TimeEntryForm.module.css
│           └── TimeEntryForm.tsx
├── .gitignore              
├── next.config.ts         
├── package.json            
├── prisma.config.ts        
├── README.md               
└── tsconfig.json          

# Time Tracker Application

A full-stack web application built for time management. Users can log their daily work hours per project, view their history grouped by date, and see calculated totals.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) via [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **react-hot-toast** (notifications)

## Features & Requirements

- **Time Entry Form**: Allows selecting a date, project (dropdown), hours (positive number), and work description.
- **Entry History**: Lists all records grouped by date in descending order.
- **Dynamic Calculations**: Displays total hours per day and a grand total for all records.
- **Strict Validation**:
  - All fields are required.
  - Maximum of 24 hours allowed per calendar date (verified via backend logic).
  - Hours must be a positive number.

##  Architecture Description

The project follows a **full-stack Next.js** architecture:

- **API Layer**: Next.js Route Handlers (`/api/entries`) handle REST-style API requests, business logic, and database interaction.
- **Data Layer**: Prisma ORM is used for type-safe database access. SQLite is chosen as a lightweight, file-based database suitable for test assignments.
- **UI Layer**: React functional components with TypeScript and basic React hooks (`useState`, `useEffect`) are used to manage state and side effects. Expensive optimizations (e.g. `useMemo`, `useCallback`) were intentionally avoided to keep the code simple and readable.
- **Styling Strategy**: Component-level styling is implemented using CSS Modules to ensure scoped, maintainable, and predictable styles.

## Installation & Setup

Follow these steps to run the project locally:



