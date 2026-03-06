import type { DatabaseClient } from '../client'
import type { WatchSource, WatchStatus } from '../../../shared/types/watchlog'

export interface SyncStateRecord {
  source: WatchSource
  status: WatchStatus
  nextStart: number
  lastSyncedAt: string | null
  lastSuccessAt: string | null
  lastError: string | null
}

interface SyncStateRow {
  source: WatchSource
  status: WatchStatus
  next_start: number
  last_synced_at: string | null
  last_success_at: string | null
  last_error: string | null
}

function toSyncStateRecord(row: SyncStateRow): SyncStateRecord {
  return {
    source: row.source,
    status: row.status,
    nextStart: row.next_start,
    lastSyncedAt: row.last_synced_at,
    lastSuccessAt: row.last_success_at,
    lastError: row.last_error,
  }
}

export function createSyncStateRepository(database: DatabaseClient) {
  const upsertStatement = database.prepare(`
    INSERT INTO sync_state (
      source, status, next_start, last_synced_at, last_success_at, last_error
    ) VALUES (
      @source, @status, @nextStart, @lastSyncedAt, @lastSuccessAt, @lastError
    )
    ON CONFLICT(source, status) DO UPDATE SET
      next_start = excluded.next_start,
      last_synced_at = excluded.last_synced_at,
      last_success_at = excluded.last_success_at,
      last_error = excluded.last_error
  `)

  const getStatement = database.prepare(
    'SELECT * FROM sync_state WHERE source = ? AND status = ?',
  )

  return {
    upsert(syncState: SyncStateRecord) {
      upsertStatement.run(syncState)
    },
    get(source: WatchSource, status: WatchStatus) {
      const row = getStatement.get(source, status) as SyncStateRow | undefined
      return row ? toSyncStateRecord(row) : null
    },
  }
}
