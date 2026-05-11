# Next.js 16 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `csprclick-nextjs-template` from Next.js 14.2.4 / React 18 to Next.js 16.2.6 / React 19.

**Architecture:** Direct dependency upgrade (Option A) — update `package.json`, clean install, verify build/lint/runtime, and fix any breaking changes reactively.

**Tech Stack:** Next.js 16, React 19, TypeScript, styled-components, ESLint

---

## File Structure

| File                | Action              | Responsibility                                                                     |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `package.json`      | Modify              | Update dependency versions for Next.js, React, ESLint config, and type definitions |
| `package-lock.json` | Delete & regenerate | Lock file must be rebuilt for new dependency tree                                  |
| `node_modules/`     | Delete & regenerate | Clean install ensures no stale transitive dependencies                             |
| `next.config.mjs`   | Potentially modify  | May need updates for Next.js 16 compatibility                                      |
| `tsconfig.json`     | Potentially modify  | May need updates for React 19 type resolution                                      |

---

### Task 1: Update Core Dependencies in package.json

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Update dependency versions**

  Change these exact fields in `package.json`:

  ```json
  {
    "dependencies": {
      "next": "16.2.6",
      "react": "^19",
      "react-dom": "^19"
    },
    "devDependencies": {
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "eslint-config-next": "16.2.6"
    }
  }
  ```

  Verify no other fields are accidentally changed.

- [ ] **Step 2: Commit the package.json change**

  ```bash
  git add package.json
  git commit -m "deps: update to Next.js 16.2.6 and React 19"
  ```

---

### Task 2: Clean Install Dependencies

**Files:**

- Delete: `package-lock.json`
- Delete: `node_modules/`

- [ ] **Step 1: Remove old lock file and node_modules**

  ```bash
  rm -rf node_modules package-lock.json
  ```

- [ ] **Step 2: Install dependencies**

  ```bash
  npm install
  ```

  **Expected:** Install completes with zero errors. If peer dependency warnings appear for `@make-software/csprclick-*` packages, note them but do not use `--legacy-peer-deps` yet — only use it if Step 3 fails.

  **If install fails due to peer deps:**

  ```bash
  npm install --legacy-peer-deps
  ```

- [ ] **Step 3: Verify installed versions**

  ```bash
  npm list next react react-dom
  ```

  **Expected output:**

  ```
  csprclick-nextjs-template@0.1.0
  ├── next@16.2.6
  ├── react@19.x.x
  └── react-dom@19.x.x
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add package-lock.json
  git commit -m "deps: regenerate lock file for Next.js 16 / React 19"
  ```

---

### Task 3: Verify and Fix Build

**Files:**

- Potentially modify: `next.config.mjs`, `tsconfig.json`, or any source file causing errors

- [ ] **Step 1: Run production build**

  ```bash
  npm run build
  ```

  **Expected:** Build completes with zero errors and zero TypeScript errors.

- [ ] **Step 2: If build fails, diagnose and fix**

  Common failures and fixes:

  - **Styled-components v5 incompatibility with React 19:**

    - Upgrade `styled-components` to `^6.1.0` in `package.json`
    - Upgrade `@types/styled-components` to `^5.1.34` (latest) or remove if v6 includes types
    - Run `npm install` again
    - Re-run `npm run build`

  - **TypeScript type errors from `@types/react` vs React 19 built-in types:**

    - Try removing `@types/react` and `@types/react-dom` from `devDependencies`
    - Run `npm install` again
    - Re-run `npm run build`

  - **Next.js config warnings:**

    - If `next.config.mjs` produces warnings, consult the error message and update accordingly. Next.js 16 may deprecate certain config options.

  - **ESLint config incompatibility:**
    - If `eslint-config-next` 16 conflicts with ESLint 8, upgrade `eslint` to `^9` in `devDependencies`
    - Run `npm install` again
    - Re-run `npm run build`

- [ ] **Step 3: Commit any fixes**

  ```bash
  git add -A
  git commit -m "fix: resolve build issues for Next.js 16 / React 19"
  ```

---

### Task 4: Verify Lint Passes

**Files:**

- Potentially modify: any source file with lint errors

- [ ] **Step 1: Run linter**

  ```bash
  npm run lint
  ```

  **Expected:** Lint passes with zero errors and zero warnings.

- [ ] **Step 2: If lint fails, fix errors**

  Auto-fix where possible:

  ```bash
  npm run lint:fix
  ```

  Manually fix any remaining errors. Common issues:

  - React 19 may deprecate certain JSX patterns
  - ESLint 9 config format changes (`eslint.config.mjs` instead of `.eslintrc`)

- [ ] **Step 3: Commit lint fixes**

  ```bash
  git add -A
  git commit -m "style: fix lint errors for Next.js 16 / React 19"
  ```

---

### Task 5: Runtime Smoke Test

**Files:**

- None (verification only)

- [ ] **Step 1: Start development server**

  ```bash
  npm run dev
  ```

  **Expected:** Server starts on `http://localhost:3000` with no terminal errors.

- [ ] **Step 2: Verify in browser**

  Open `http://localhost:3000` in a browser.

  **Verify:**

  - Page loads without a blank screen
  - No critical errors in the browser console (F12 → Console)
  - CSPR.click integration renders correctly
  - No React hydration errors

- [ ] **Step 3: Stop dev server**

  Press `Ctrl+C` in the terminal.

---

### Task 6: Final Verification & Summary Commit

**Files:**

- Potentially modify: `README.md` (update Node.js version requirements if needed)

- [ ] **Step 1: Run full verification suite**

  ```bash
  npm run build
  npm run lint
  ```

  **Expected:** Both commands pass with zero errors.

- [ ] **Step 2: Update README if Node.js version changed**

  Next.js 16 requires Node.js 18.17 or later. Check `README.md` line 19:

  ```markdown
  Node.js version >= v18.17.0
  ```

  If the requirement is already `>= v18.17.0`, no change needed.

- [ ] **Step 3: Final commit**

  ```bash
  git add -A
  git commit -m "chore: upgrade to Next.js 16.2.6 and React 19"
  ```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Every dependency update in the spec is reflected in Task 1. Build, lint, and runtime verification are all covered.
- [ ] **No placeholders:** No "TBD", "TODO", or vague steps remain. Every step has exact commands or code.
- [ ] **Type consistency:** `package.json` field names and version strings are consistent throughout.
