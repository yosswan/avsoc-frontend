# Agent Guidelines

## Dev Commands
- `yarn dev` — Start dev server (localhost:3000)
- `yarn build` — Production build
- `yarn start` — Production server via custom `server.js` (run `yarn build` first)
- `yarn type-check` — `tsc --noEmit`
- `yarn lint` — ESLint `--fix` on JS/TS files
- Pre-commit: `husky` runs `yarn lint-staged`

## Tech Stack
- **Next.js 14.2.28** + **React 18** + **TypeScript 5**
- **Package manager: Yarn** (do not use npm)
- Styling: Tailwind CSS, Ant Design 5, styled-components 6, Sass
- Auth: **NextAuth v5 (Auth.js)** — credentials-only provider, JWT strategy. Configured in `app/auth.ts`, route handler at `app/api/auth/[...nextauth]/route.ts`
- Data: SWR + react-query v3 (24h staleTime, 48h cacheTime, retry: false)
- Path alias: `@/*` maps to project root (tsconfig paths)

## Architecture Notes
- **Hybrid routing**: `pages/` (Pages Router) contains all page components. `app/` only holds auth config (`app/auth.ts` + `app/api/auth/[...nextauth]/route.ts`)
- Middleware (`middleware.ts`) protects `/dashboard/:path*`. Also checks VIEW permission on `informes-mensuales` and `miembros` routes via role-based system in `consts/`
- API calls use Axios client (`services/AxiosClientConfig.ts`) that auto-injects Bearer token from NextAuth session and unwraps `response.data`
- Permissions: `consts/permissionByRol.ts`, `consts/permissionsEnum.ts`, `consts/modulesEmuns.ts` + `context/PermissionProvider/`

## Tooling Quirks
- **ESLint is very lenient** — `no-unused-vars` off, `@typescript-eslint/no-explicit-any` off, many rules disabled. Prettier extends ESLint config
- Prettier config is in an unusually-named file `prettier.config.jssss`
- PWA (via `next-pwa`) is **disabled in development**, enabled in production
- lint-staged runs `npm run type-check` on TS files and `npm run lint` on JS/TS files (uses npm, not yarn, as the executor)

## Project Structure
| Directory | Purpose |
|-----------|---------|
| `pages/` | Next.js page components (Pages Router) |
| `pages/dashboard/` | Protected dashboard pages |
| `pages/auth/` | Auth pages (signin, register, forgot-password) |
| `components/` | Reusable React components |
| `services/` | Axios API client and endpoint modules |
| `context/` | React context providers (theme, navigation, permissions) |
| `consts/` | Constants, enums, role/permission definitions |
| `hooks/` | Custom React hooks (modal, theme, user) |
| `lib/` | Utility helpers (logger, pagination, toast wrapper) |
| `interfaces/` & `types/` | TypeScript interfaces and type declarations |
| `styles/` | Global SCSS/CSS files |
| `app/` | Next.js App Router — auth config only |
