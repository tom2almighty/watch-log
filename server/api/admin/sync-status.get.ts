import { markEventHandler } from '../../utils/event-handler'
import { createDatabaseClient } from '../../database/client'
import { createSyncRunsRepository } from '../../database/repositories/sync-runs'
import { createSyncStateRepository } from '../../database/repositories/sync-state'
import { createWatchLogSyncService } from '../../services/sync/watchlog-sync'
import { assertAdminToken, requireAdminToken } from '../../utils/auth'

interface GetAdminSyncStatusOptions {
  providedToken?: string | null
  adminToken: string
  syncService: {
    getSyncStatus: () => unknown
  }
}

function createRuntimeSyncStatusService(event?: unknown) {
  const runtimeConfig = useRuntimeConfig(event)
  const database = createDatabaseClient(runtimeConfig.dbPath)

  return createWatchLogSyncService({
    provider: {
      async fetchPage() {
        throw new Error('fetchPage is not used by getSyncStatus')
      },
    },
    subjects: {
      upsert() {},
    },
    watchLogs: {
      upsert() {},
    },
    syncState: createSyncStateRepository(database),
    syncRuns: createSyncRunsRepository(database),
  })
}

export async function getAdminSyncStatus(options: GetAdminSyncStatusOptions) {
  assertAdminToken(options.providedToken, options.adminToken)
  return options.syncService.getSyncStatus()
}

export default markEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  requireAdminToken(event, runtimeConfig.adminToken)

  return createRuntimeSyncStatusService(event).getSyncStatus()
})
