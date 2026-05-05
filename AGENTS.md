# Agent Guidelines

## Dev Commands
- `yarn dev` - Start dev server (localhost:3000)
- `yarn build` - Production build
- `yarn start` - Run production server (uses custom server.js)
- `yarn type-check` - Validate TypeScript
- `yarn lint` - ESLint with auto-fix

## Pre-commit
- Runs `lint-staged` on every commit (type-check on TS files, lint on JS/TS files)
- Failing checks block commits

## Tech Stack
- Next.js 12.3.4 + React 17 + TypeScript
- Package manager: **Yarn** (not npm)
- Styling: Tailwind CSS, Ant Design, styled-components
- Auth: NextAuth v3 (older version) with custom middleware
- Data: SWR + react-query

## Important Notes
- PWA enabled in production only (`next-pwa` in next.config.js)
- Middleware protects `/dashboard/:path*` routes (see middleware.ts)
- Production uses custom server.js, not Next.js default
- Environment: Copy `.env.example` to `.env` (API, Google OAuth required)

## Project Structure
- `pages/` - Next.js pages and API routes
- `components/` - React components
- `services/` - API calls
- `context/` - React context providers
- `hooks/` - Custom hooks
- `consts/` - Constants and enums
- `lib/` - Utilities