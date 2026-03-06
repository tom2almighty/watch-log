import { MAX_DOUBAN_PAGE_SIZE } from '../../providers/douban/client'
import type { ProviderFetchOptions, ProviderPage } from '../../providers/types'
import { WATCH_STATUSES } from '../../../shared/constants/watchlog'
import type { SyncRunRecord, WatchStatus } from '../../utils/types'

interface SyncStateRecord {
  source: 'douban' | 'tmdb'
  status: WatchStatus
  nextStart: number
  lastSyncedAt: string | null
  lastSuccessAt: string | null
  lastError: string | null
}

interface SyncStatusSnapshot {
  latestRun: SyncRunRecord | null
  cursors: SyncStateRecord[]
}

interface SyncStatusResult {
  status: WatchStatus
  items: number
  pages: number
}

interface WatchLogSyncRunResult {
  runId: string
  status: 'success'
  totalItems: number
  statuses: SyncStatusResult[]
  finishedAt: string
}

interface WatchLogSyncProvider {
  fetchPage: (options: ProviderFetchOptions) => Promise<ProviderPage>
}

interface WatchLogSyncServiceDeps {
  provider: WatchLogSyncProvider
  subjects: {
    upsert: (subject: ProviderPage['items'][number]['subject']) => void
  }
  watchLogs: {
    upsert: (watchLog: ProviderPage['items'][number]['watchLog']) => void
  }
  syncState: {
    get: (source: 'douban', status: WatchStatus) => SyncStateRecord | null
    upsert: (record: SyncStateRecord) => void
  }
  syncRuns: {
    create: (record: SyncRunRecord) => void
    finish: (
      id: string,
      status: SyncRunRecord['status'],
      finishedAt: string,
      message: string | null,
    ) => void
    getLatest: () => SyncRunRecord | null
  }
  now?: () => string
}

interface RunSyncInput {
  statuses?: WatchStatus[]
}

export function createWatchLogSyncService(deps: WatchLogSyncServiceDeps) {
  const now = deps.now ?? (() => new Date().toISOString())

  return {
    async runSync(input: RunSyncInput = {}): Promise<WatchLogSyncRunResult> {
      const runId = `sync_${Date.now()}`
      const startedAt = now()
      const statuses = input.statuses?.length ? input.statuses : WATCH_STATUSES
      const statusResults: SyncStatusResult[] = []

      deps.syncRuns.create({
        id: runId,
        source: 'douban',
        status: 'running',
        startedAt,
        finishedAt: null,
        message: null,
      })

      let totalItems = 0

      try {
        for (const status of statuses) {
          let start = deps.syncState.get('douban', status)?.nextStart ?? 1
          let pages = 0
          let items = 0

          while (true) {
            const page = await deps.provider.fetchPage({
              status,
              start,
              count: MAX_DOUBAN_PAGE_SIZE,
            })

            pages += 1
            items += page.items.length
            totalItems += page.items.length

            for (const item of page.items) {
              deps.subjects.upsert(item.subject)
              deps.watchLogs.upsert(item.watchLog)
            }

            if (!page.pagination.hasMore) {
              break
            }

            start = page.pagination.nextStart
          }

          const finishedAt = now()
          deps.syncState.upsert({
            source: 'douban',
            status,
            nextStart: 1,
            lastSyncedAt: finishedAt,
            lastSuccessAt: finishedAt,
            lastError: null,
          })

          statusResults.push({
            status,
            items,
            pages,
          })
        }

        const finishedAt = now()
        deps.syncRuns.finish(runId, 'success', finishedAt, `Synced ${totalItems} items`)

        return {
          runId,
          status: 'success',
          totalItems,
          statuses: statusResults,
          finishedAt,
        }
      } catch (error) {
        const finishedAt = now()
        const message = error instanceof Error ? error.message : 'Unknown sync error'
        deps.syncRuns.finish(runId, 'error', finishedAt, message)
        throw error
      }
    },
    getSyncStatus(): SyncStatusSnapshot {
      return {
        latestRun: deps.syncRuns.getLatest(),
        cursors: WATCH_STATUSES.map((status) => deps.syncState.get('douban', status)).filter(
          (value): value is SyncStateRecord => Boolean(value),
        ),
      }
    },
  }
}
