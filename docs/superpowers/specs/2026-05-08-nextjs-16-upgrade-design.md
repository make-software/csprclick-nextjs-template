# Next.js 16 Upgrade Design

## Overview

Upgrade the `csprclick-nextjs-template` project from Next.js 14.2.4 / React 18 to Next.js 16.2.6 / React 19. The upgrade follows **Option A: Direct Upgrade** — updating all core dependencies in one step, then verifying the build and fixing any issues reactively.

## Current State

- **Next.js:** `14.2.4`
- **React:** `^18`
- **React DOM:** `^18`
- **Project type:** Small Next.js App Router application with no API routes, no middleware, and no dynamic routes.
- **Styling:** `styled-components` v5
- **Third-party libraries:** `@make-software/csprclick-*`, `react-query`, `next-themes`

## Dependency Updates

### Core Framework

| Package              | Current  | Target   | Notes                              |
| -------------------- | -------- | -------- | ---------------------------------- |
| `next`               | `14.2.4` | `16.2.6` | Latest stable                      |
| `react`              | `^18`    | `^19`    | React 19 is required by Next.js 16 |
| `react-dom`          | `^18`    | `^19`    | React 19 is required by Next.js 16 |
| `eslint-config-next` | `14.2.4` | `16.2.6` | Keep in sync with Next.js          |

### Type Definitions

| Package            | Current | Target | Notes                                                             |
| ------------------ | ------- | ------ | ----------------------------------------------------------------- |
| `@types/react`     | `^18`   | `^19`  | React 19 types; may be removable if React 19 ships built-in types |
| `@types/react-dom` | `^18`   | `^19`  | React 19 types; may be removable if React 19 ships built-in types |

### Keep As-Is (Unless Build Errors Force Changes)

| Package                      | Version   | Risk Assessment                                                  |
| ---------------------------- | --------- | ---------------------------------------------------------------- |
| `styled-components`          | `^5.3.9`  | React 19 compatibility unknown; upgrade to v6 if v5 fails        |
| `react-query`                | `^3.39.3` | Likely compatible; no known breaking changes with React 19       |
| `next-themes`                | `^0.3.0`  | Likely compatible; test during verification                      |
| `@make-software/csprclick-*` | `^1.5.0`  | Third-party; may need `--legacy-peer-deps` if peer deps conflict |

## Breaking Changes Analysis

### Next.js 15/16 Changes That Do **Not** Affect This Project

- Async `cookies()`, `headers()`, `draftMode()` — not used.
- Async `params` / `searchParams` in page components — no dynamic routes.
- Middleware API changes — no `middleware.ts` file.
- `next/font` — `Inter` import used, API stable.

### Potential Risks

1. **React 19 + `styled-components` v5:**

   - React 19 may require `styled-components` v6. If the build or runtime fails, the mitigation is to upgrade `styled-components` to v6 and update `@types/styled-components` accordingly.

2. **React 19 Type Definitions:**

   - React 19 may ship its own type definitions. We will attempt to keep `@types/react` and `@types/react-dom` at v19; if they conflict with built-in types, we will remove them.

3. **Third-Party Peer Dependencies:**
   - `@make-software/csprclick-*` packages may declare `react: ^18` as a peer dependency. If `npm install` fails due to peer dependency conflicts, we will use `--legacy-peer-deps` as a last resort.

## Verification Plan

1. **Install dependencies:** Delete `node_modules` and lock file, run `npm install`.
2. **Build:** Run `npm run build`. Must pass with zero errors.
3. **Lint:** Run `npm run lint`. Must pass with zero errors.
4. **Runtime smoke test:** Run `npm run dev`, open `http://localhost:3000`, verify the page loads and no console errors appear.

## Rollback Strategy

If an unresolvable blocker is encountered (e.g., a CSPR.click package that fundamentally breaks under React 19), revert `package.json` and the lock file to their pre-upgrade state.

## Success Criteria

- `npm run build` passes with zero errors.
- `npm run lint` passes with zero errors.
- The application renders correctly in development mode with no console errors.
