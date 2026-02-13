# Echo Space

=======

Echo Space is a community feedback platform where users can explore sessions, share feedback (publicly or anonymously), like content, and post improvement ideas.

## Overview

Echo Space helps teams run better sessions by making feedback easy to give and easy to act on. The app supports:

- Session discovery with date/category/search filters
- Public and anonymous feedback on sessions
- Likes on sessions and ideas
- Idea board with comments and reactions
- Role-based API access for admin session management
- GitHub login with persistent user profiles

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- NextAuth.js (GitHub OAuth)
- Prisma ORM + PostgreSQL
- Tailwind CSS 4
- Radix UI / shadcn-style components
- Framer Motion

## Project Structure

```text
my-app/
  prisma/
    schema.prisma
    seed.ts
  src/
    app/
      (app)/
        feedback/
        ideas/
        session/
      api/
        auth/
        feedback/
        ideas/
        section/
    components/
    lib/
```

## Core Features

### 1. Sessions
- Browse upcoming/past sessions
- Filter by date and category
- Search by topic and presenter

### 2. Feedback
- Add feedback to sessions
- Post feedback anonymously or with identity
- Edit and delete your own feedback
- Like sessions

### 3. Ideas
- Submit improvement ideas with categories
- Optional anonymous posting
- Like, comment on, edit, and delete ideas
- Paginated idea feed

### 4. Authentication and Access
- GitHub OAuth sign-in
- Session-based protected routes
- Admin-only APIs for session creation and management

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- GitHub OAuth app credentials

### 1. Clone and install

```bash
git clone https://github.com/your-username/echo-space.git
cd echo-space/my-app
npm install
```

### 2. Configure environment variables

Create a `.env` file in `my-app/` and add:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"
```

### 3. Set up database

```bash
npx prisma generate
npx prisma migrate dev
```

Optional seed data:

```bash
npx prisma db seed
```

### 4. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## API Highlights

- `POST /api/feedback` - Create feedback
- `PUT /api/feedback` - Update feedback (owner)
- `DELETE /api/feedback` - Delete feedback (owner)
- `POST /api/feedback/likes` - Like a session
- `DELETE /api/feedback/likes` - Remove session like
- `GET /api/ideas` - List ideas with pagination
- `POST /api/ideas` - Create idea
- `PATCH /api/ideas/[id]` - Update idea (owner)
- `DELETE /api/ideas/[id]` - Delete idea (owner)
- `POST /api/ideas/like` - Like an idea
- `DELETE /api/ideas/like` - Remove idea like

Admin routes (role = `ADMIN`):

- `GET /api/section/admin`
- `POST /api/section/admin`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## Notes

- This repository currently has no license file. Add a `LICENSE` if you plan to open-source it publicly.
- For production deployments, run Prisma migrations during deploy (`npx prisma migrate deploy`).
