import type { DatabaseClient } from '../client'
import type { SyncRunRecord, SyncRunStatus, WatchSource } from '../../utils/types'

interface SyncRunRow {
  id: string
  source: WatchSource
  status: SyncRunStatus
  started_at: string
  finished_at: string | null
  message: string | null
}

function toSyncRunRecord(row: SyncRunRow): SyncRunRecord {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    message: row.message,
  }
}

export function createSyncRunsRepository(database: DatabaseClient) {
  const insertStatement = database.prepare(`
    INSERT INTO sync_runs (id, source, status, started_at, finished_at, message)
    VALUES (@id, @source, @status, @startedAt, @finishedAt, @message)
  `)

  const updateStatement = database.prepare(`
    UPDATE sync_runs
    SET status = @status,
        finished_at = @finishedAt,
        message = @message
    WHERE id = @id
  `)

  const latestStatement = database.prepare(
    'SELECT * FROM sync_runs ORDER BY started_at DESC LIMIT 1',
  )

  return {
    create(run: SyncRunRecord) {
      insertStatement.run(run)
    },
    finish(id: string, status: SyncRunStatus, finishedAt: string, message: string | null) {
      updateStatement.run({ id, status, finishedAt, message })
    },
    getLatest() {
      const row = latestStatement.get() as SyncRunRow | undefined
      return row ? toSyncRunRecord(row) : null
    },
  }
}
