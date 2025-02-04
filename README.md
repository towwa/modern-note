# Modern Notes App

A Next.js 14 note-taking application with TypeScript and Shadcn/ui.

## Features

- Create/edit markdown notes
- Category tagging system
- Full-text search
- Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Shadcn/ui + CSS Modules
- **State**: Zustand
- **Database**: Prisma + SQLite
- **Validation**: Zod

## Getting Started

1. Clone repository:

```bash
git clone [repo-url]
cd modern-notes
```

2. Install dependencies:

```bash
npm install
```

3. Set up database:

```bash
npx prisma migrate dev --name init
```

4. Run development server:

```bash
npm run dev
```

## Deployment

### Prerequisites

- GitHub repository
- Fly.io account
- Docker installed

### Steps

1. Push code to GitHub main branch
2. Set up secrets in GitHub repository (Settings → Secrets and variables → Actions):
   - `DATABASE_URL`: Your production database connection string
   - `FLY_API_TOKEN`: Your Fly.io API token (get from `flyctl auth token`)
3. The CI/CD pipeline will automatically:
   - Run tests
   - Build the application
   - Deploy to Fly.io

### Manual Deployment

```bash
flyctl launch
flyctl deploy
```

## Project Structure

```bash
├── app/
│   ├── (auth)/ # Authentication routes
│   ├── notes/  # Note management
│   └── layout.tsx
├── components/
│   ├── ui/     # Shadcn components
│   └── notes/  # Note components
├── lib/
│   ├── db.ts   # Database connection
│   └── validators/ # Zod schemas
└── prisma/
    └── schema.prisma # Database schema
```
