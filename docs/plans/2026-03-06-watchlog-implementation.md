# WatchLog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a lightweight self-hosted WatchLog app with a Nuxt 4 SPA, a separate embeddable Web Component widget, Douban sync into SQLite, selectable image proxy strategies, and optional cron-based sync.

**Architecture:** The Nuxt app owns server APIs, sync orchestration, runtime configuration, and SQLite persistence. A separate `packages/widget` build produces a script-loaded Web Component that consumes the same public read APIs and uses isolated Shadow DOM styling. Data ingestion flows through a provider abstraction so Douban is first and TMDB can be added later without replacing UI or storage.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, better-sqlite3, Tailwind CSS v4, Vite library mode, pnpm, Docker.

---

### Task 1: Replace starter app shell

**Files:**
- Modify: `app/app.vue`
- Create: `app/pages/index.vue`
- Create: `app/pages/records.vue`
- Create: `app/pages/admin.vue`
- Create: `app/components/app/AppShell.vue`
- Modify: `README.md`

**Step 1: Write the failing test**

Create a lightweight route smoke test placeholder for home and admin navigation.

**Step 2: Run test to verify it fails**

Run: `pnpm test app-shell`
Expected: FAIL because no test runner or route components exist yet.

**Step 3: Write minimal implementation**

- Replace `NuxtWelcome` with the app shell.
- Add three base pages: home, records, admin.
- Add minimal header and navigation structure.

**Step 4: Run test to verify it passes**

Run: `pnpm build`
Expected: PASS and Nuxt builds without the default starter page.

**Step 5: Commit**

```bash
git add app/app.vue app/pages/index.vue app/pages/records.vue app/pages/admin.vue app/components/app/AppShell.vue README.md
git commit -m "feat: replace starter app shell"
```

### Task 2: Add shared domain models

**Files:**
- Create: `shared/types/watchlog.ts`
- Create: `shared/constants/watchlog.ts`
- Create: `server/utils/types.ts`
- Test: `tests/shared/watchlog-schema.test.ts`

**Step 1: Write the failing test**

Create `tests/shared/watchlog-schema.test.ts` to assert the exported types/constants cover supported statuses and proxy modes.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/shared/watchlog-schema.test.ts`
Expected: FAIL because shared files do not exist.

**Step 3: Write minimal implementation**

- Define `WatchStatus`, `ImageProxyMode`, `SubjectRecord`, `WatchLogRecord`, `SyncRunRecord`, `WidgetQueryOptions`.
- Export constant arrays for supported statuses and proxy modes.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/shared/watchlog-schema.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add shared/types/watchlog.ts shared/constants/watchlog.ts server/utils/types.ts tests/shared/watchlog-schema.test.ts
git commit -m "feat: add shared watchlog domain models"
```

### Task 3: Set up lightweight test tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/fixtures/.gitkeep`

**Step 1: Write the failing test**

Use the previous shared schema test as the first real test target.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest`
Expected: FAIL because Vitest is not configured.

**Step 3: Write minimal implementation**

- Add `vitest` and minimal test script.
- Configure a simple Node test environment.
- Keep setup intentionally lightweight.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/shared/watchlog-schema.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json vitest.config.ts tests/setup.ts tests/fixtures/.gitkeep
git commit -m "test: add lightweight vitest setup"
```

### Task 4: Add SQLite schema and repository layer

**Files:**
- Create: `server/database/schema.ts`
- Create: `server/database/client.ts`
- Create: `server/database/repositories/subjects.ts`
- Create: `server/database/repositories/watch-logs.ts`
- Create: `server/database/repositories/sync-state.ts`
- Test: `tests/server/database/repositories.test.ts`

**Step 1: Write the failing test**

Create repository tests for insert/upsert/read of `subjects`, `watch_logs`, and `sync_state`.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/database/repositories.test.ts`
Expected: FAIL because database files do not exist.

**Step 3: Write minimal implementation**

- Create SQLite initialization helpers.
- Create schema bootstrap SQL.
- Implement focused repository helpers for reads and upserts only.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/database/repositories.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add server/database/schema.ts server/database/client.ts server/database/repositories/subjects.ts server/database/repositories/watch-logs.ts server/database/repositories/sync-state.ts tests/server/database/repositories.test.ts
git commit -m "feat: add sqlite schema and repositories"
```

### Task 5: Add runtime config and environment docs

**Files:**
- Modify: `nuxt.config.ts`
- Create: `.env.example`
- Modify: `README.md`

**Step 1: Write the failing test**

Create a config smoke check that asserts required runtime keys are exposed server-side.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/runtime-config.test.ts`
Expected: FAIL because config keys are missing.

**Step 3: Write minimal implementation**

- Add runtime config keys for Douban headers, API key, DB path, admin token, cron toggle, image proxy defaults.
- Document each variable in `.env.example` and `README.md`.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/runtime-config.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add nuxt.config.ts .env.example README.md tests/server/runtime-config.test.ts
git commit -m "chore: add runtime config and env docs"
```

### Task 6: Implement provider abstraction

**Files:**
- Create: `server/providers/types.ts`
- Create: `server/providers/index.ts`
- Create: `server/providers/douban/client.ts`
- Create: `server/providers/douban/mapper.ts`
- Test: `tests/server/providers/douban-mapper.test.ts`

**Step 1: Write the failing test**

Create a mapper test using a fixture copied from `docs/plans/spec.md` data to assert normalized output shape.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/providers/douban-mapper.test.ts`
Expected: FAIL because provider code does not exist.

**Step 3: Write minimal implementation**

- Define provider contracts.
- Implement Douban fetch client with runtime headers.
- Implement mappers that keep only necessary fields.
- Respect `count <= 50` and supported statuses.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/providers/douban-mapper.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add server/providers/types.ts server/providers/index.ts server/providers/douban/client.ts server/providers/douban/mapper.ts tests/server/providers/douban-mapper.test.ts
git commit -m "feat: add douban provider abstraction"
```

### Task 7: Build sync service with manual and cron entrypoints

**Files:**
- Create: `server/services/sync/watchlog-sync.ts`
- Create: `server/utils/auth.ts`
- Create: `server/api/admin/sync.post.ts`
- Create: `server/api/admin/sync-status.get.ts`
- Create: `server/plugins/sync-cron.server.ts`
- Test: `tests/server/services/watchlog-sync.test.ts`
- Test: `tests/server/api/admin-sync.test.ts`

**Step 1: Write the failing test**

Create tests for successful sync, invalid admin token rejection, and sync status response.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/services/watchlog-sync.test.ts tests/server/api/admin-sync.test.ts`
Expected: FAIL because sync service and admin endpoints do not exist.

**Step 3: Write minimal implementation**

- Implement sync orchestration by status and pagination.
- Record sync runs and last successful cursors.
- Protect admin endpoints with `ADMIN_TOKEN`.
- Add optional cron bootstrap guarded by config.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/services/watchlog-sync.test.ts tests/server/api/admin-sync.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add server/services/sync/watchlog-sync.ts server/utils/auth.ts server/api/admin/sync.post.ts server/api/admin/sync-status.get.ts server/plugins/sync-cron.server.ts tests/server/services/watchlog-sync.test.ts tests/server/api/admin-sync.test.ts
git commit -m "feat: add manual and cron sync flows"
```

### Task 8: Add public read APIs

**Files:**
- Create: `server/api/records/index.get.ts`
- Create: `server/api/records/[id].get.ts`
- Create: `server/api/stats.get.ts`
- Create: `server/api/widget.get.ts`
- Create: `server/services/query/records-query.ts`
- Test: `tests/server/api/public-read.test.ts`

**Step 1: Write the failing test**

Create smoke tests for records list, details, stats, and widget feed outputs.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/api/public-read.test.ts`
Expected: FAIL because public endpoints do not exist.

**Step 3: Write minimal implementation**

- Add read endpoints for the SPA and widget.
- Support status, subtype, year, page, and limit filters.
- Keep the widget response compact.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/api/public-read.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add server/api/records/index.get.ts server/api/records/[id].get.ts server/api/stats.get.ts server/api/widget.get.ts server/services/query/records-query.ts tests/server/api/public-read.test.ts
git commit -m "feat: add public watchlog read api"
```

### Task 9: Add selectable image proxy strategies

**Files:**
- Create: `server/services/images/resolve-image-url.ts`
- Create: `server/api/image.get.ts`
- Create: `shared/constants/image-proxy.ts`
- Test: `tests/server/services/resolve-image-url.test.ts`

**Step 1: Write the failing test**

Create tests for `direct`, `prefix`, and `relay` modes.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/server/services/resolve-image-url.test.ts`
Expected: FAIL because image proxy logic does not exist.

**Step 3: Write minimal implementation**

- Implement URL resolver for three modes.
- Add server relay endpoint `/api/image`.
- Keep the resolver reusable by the SPA and widget feeds.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/server/services/resolve-image-url.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add server/services/images/resolve-image-url.ts server/api/image.get.ts shared/constants/image-proxy.ts tests/server/services/resolve-image-url.test.ts
git commit -m "feat: add selectable image proxy strategies"
```

### Task 10: Design and build the SPA UI

**Files:**
- Create: `app/components/home/*.vue`
- Create: `app/components/records/*.vue`
- Create: `app/components/admin/*.vue`
- Modify: `app/pages/index.vue`
- Modify: `app/pages/records.vue`
- Modify: `app/pages/admin.vue`
- Create: `app/composables/useWatchlogApi.ts`

**Step 1: Write the failing test**

Create minimal component smoke tests or route-level render checks for the home and records pages.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/app/pages/ui-smoke.test.ts`
Expected: FAIL because the pages do not render the expected sections yet.

**Step 3: Write minimal implementation**

- REQUIRED SUB-SKILL: `frontend-design`
- Implement the approved SPA information architecture.
- Build a refined but lightweight UI for summary, record browsing, and admin sync controls.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/app/pages/ui-smoke.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/components/home app/components/records app/components/admin app/pages/index.vue app/pages/records.vue app/pages/admin.vue app/composables/useWatchlogApi.ts tests/app/pages/ui-smoke.test.ts
git commit -m "feat: build watchlog spa ui"
```

### Task 11: Build the embeddable Web Component widget

**Files:**
- Create: `packages/widget/package.json`
- Create: `packages/widget/vite.config.ts`
- Create: `packages/widget/src/main.ts`
- Create: `packages/widget/src/widget-element.ts`
- Create: `packages/widget/src/api.ts`
- Create: `packages/widget/src/styles.css`
- Create: `packages/widget/README.md`
- Test: `tests/widget/widget-element.test.ts`

**Step 1: Write the failing test**

Create tests that assert the custom element registers, reads attributes, and renders a compact feed.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/widget/widget-element.test.ts`
Expected: FAIL because the widget package does not exist.

**Step 3: Write minimal implementation**

- REQUIRED SUB-SKILL: `frontend-design`
- Create a Shadow DOM-based custom element.
- Support `endpoint`, `status`, `limit`, `layout`, `proxy-mode`, and `proxy-prefix` attributes.
- Build with Vite library mode as a browser-consumable script.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/widget/widget-element.test.ts && pnpm --filter ./packages/widget build`
Expected: PASS and widget bundle is generated.

**Step 5: Commit**

```bash
git add packages/widget tests/widget/widget-element.test.ts
git commit -m "feat: add embeddable watchlog widget"
```

### Task 12: Finalize documentation and deployment

**Files:**
- Modify: `README.md`
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docs/widget-embed.md`
- Create: `docs/deployment.md`

**Step 1: Write the failing test**

Create a docs checklist covering env setup, sync, widget embed, and Docker run instructions.

**Step 2: Run test to verify it fails**

Run: `pnpm build`
Expected: PASS or FAIL unrelated to docs, while the checklist still shows missing deployment instructions.

**Step 3: Write minimal implementation**

- Document local development, environment variables, admin token usage, manual sync, cron sync, widget embedding, and Docker deployment.
- Add a simple production container setup.

**Step 4: Run test to verify it passes**

Run: `pnpm build && pnpm --filter ./packages/widget build`
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md Dockerfile docker-compose.yml docs/widget-embed.md docs/deployment.md
git commit -m "docs: add deployment and widget usage guides"
```

### Task 13: Verification pass

**Files:**
- Modify: `package.json`
- Modify: `README.md`

**Step 1: Write the failing test**

No new tests. Use the full verification command as the release gate.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest && pnpm build && pnpm --filter ./packages/widget build`
Expected: FAIL until every previous task is complete.

**Step 3: Write minimal implementation**

- Add a convenience verification script if helpful.
- Fix only issues caused by the planned tasks.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest && pnpm build && pnpm --filter ./packages/widget build`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json README.md
git commit -m "chore: add final verification workflow"
```

