import { markEventHandler } from '../../utils/event-handler'
import { createDatabaseClient } from '../../database/client'
import { createSubjectsRepository } from '../../database/repositories/subjects'
import { createSyncRunsRepository } from '../../database/repositories/sync-runs'
import { createSyncStateRepository } from '../../database/repositories/sync-state'
import { createWatchLogsRepository } from '../../database/repositories/watch-logs'
import { fetchDoubanInterestsPage } from '../../providers/douban/client'
import { mapDoubanInterestsPage } from '../../providers/douban/mapper'
import { createWatchLogSyncService } from '../../services/sync/watchlog-sync'
import { assertAdminToken, requireAdminToken } from '../../utils/auth'
import type { WatchStatus } from '../../../shared/types/watchlog'
import type { ProviderFetchOptions } from '../../providers/types'

const readBodyCompat =
  (globalThis as typeof globalThis & {
    readBody?: <T>(event: unknown) => Promise<T>
  }).readBody ?? (async <T>() => undefined as T)

interface ExecuteAdminSyncOptions {
  providedToken?: string | null
  adminToken: string
  syncService: {
    runSync: (input: { statuses?: WatchStatus[] }) => Promise<unknown>
  }
}

interface AdminSyncBody {
  statuses?: WatchStatus[]
}

function createRuntimeSyncService(event?: unknown) {
  const runtimeConfig = useRuntimeConfig(event)
  const database = createDatabaseClient(runtimeConfig.dbPath)

  return createWatchLogSyncService({
    provider: {
      async fetchPage(options: ProviderFetchOptions) {
        const response = await fetchDoubanInterestsPage(
          $fetch,
          {
            apiBase: runtimeConfig.doubanApiBase,
            apiKey: runtimeConfig.doubanApiKey,
            userId: runtimeConfig.doubanUserId,
            userAgent: runtimeConfig.doubanUserAgent,
            referer: runtimeConfig.doubanReferer,
            acceptLanguage: runtimeConfig.doubanAcceptLanguage,
          },
          options,
        )

        return mapDoubanInterestsPage(response)
      },
    },
    subjects: createSubjectsRepository(database),
    watchLogs: createWatchLogsRepository(database),
    syncState: createSyncStateRepository(database),
    syncRuns: createSyncRunsRepository(database),
  })
}

export async function executeAdminSync(body: AdminSyncBody, options: ExecuteAdminSyncOptions) {
  assertAdminToken(options.providedToken, options.adminToken)

  return options.syncService.runSync({
    statuses: body.statuses,
  })
}

export default markEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  requireAdminToken(event, runtimeConfig.adminToken)

  const body = await readBodyCompat<AdminSyncBody>(event)
  return createRuntimeSyncService(event).runSync({
    statuses: body?.statuses,
  })
})
