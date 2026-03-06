import type { DatabaseClient } from '../client'
import type { WatchLogRecord } from '../../../shared/types/watchlog'

interface WatchLogRow {
  id: string
  source: WatchLogRecord['source']
  source_interest_id: string
  subject_id: string
  status: WatchLogRecord['status']
  rating: number | null
  comment: string | null
  watched_at: string | null
  is_private: number
  created_at: string
  updated_at: string
}

function toWatchLogRecord(row: WatchLogRow): WatchLogRecord {
  return {
    id: row.id,
    source: row.source,
    sourceInterestId: row.source_interest_id,
    subjectId: row.subject_id,
    status: row.status,
    rating: row.rating,
    comment: row.comment,
    watchedAt: row.watched_at,
    isPrivate: Boolean(row.is_private),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function createWatchLogsRepository(database: DatabaseClient) {
  const upsertStatement = database.prepare(`
    INSERT INTO watch_logs (
      id, source, source_interest_id, subject_id, status, rating, comment,
      watched_at, is_private, created_at, updated_at
    ) VALUES (
      @id, @source, @sourceInterestId, @subjectId, @status, @rating, @comment,
      @watchedAt, @isPrivate, @createdAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source,
      source_interest_id = excluded.source_interest_id,
      subject_id = excluded.subject_id,
      status = excluded.status,
      rating = excluded.rating,
      comment = excluded.comment,
      watched_at = excluded.watched_at,
      is_private = excluded.is_private,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at
  `)

  const listBySubjectIdStatement = database.prepare(
    'SELECT * FROM watch_logs WHERE subject_id = ? ORDER BY created_at DESC',
  )

  return {
    upsert(watchLog: WatchLogRecord) {
      upsertStatement.run({
        ...watchLog,
        isPrivate: watchLog.isPrivate ? 1 : 0,
      })
    },
    listBySubjectId(subjectId: string) {
      const rows = listBySubjectIdStatement.all(subjectId) as WatchLogRow[]
      return rows.map(toWatchLogRecord)
    },
  }
}
