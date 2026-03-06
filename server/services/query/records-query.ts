import type { DatabaseClient } from '../../database/client'
import type { SubjectRecord, WatchLogRecord, WatchStatus } from '../../utils/types'

interface SubjectRow {
  id: string
  source: SubjectRecord['source']
  source_subject_id: string
  title: string
  original_title: string | null
  year: string | null
  subtype: string | null
  genres: string
  directors: string
  actors: string
  cover_url: string | null
  douban_url: string | null
  rating_average: number | null
  rating_count: number | null
  pubdates: string
}

interface WatchLogRow {
  id: string
  source: WatchLogRecord['source']
  source_interest_id: string
  subject_id: string
  status: WatchStatus
  rating: number | null
  comment: string | null
  watched_at: string | null
  is_private: number
  created_at: string
  updated_at: string
}

interface RecordListItem {
  logId: string
  subjectId: string
  title: string
  year: string | null
  subtype: string | null
  coverUrl: string | null
  status: WatchStatus
  rating: number | null
  watchedAt: string | null
}

interface RecordFilters {
  status?: WatchStatus
  subtype?: string
  year?: string
  page?: number
  limit?: number
}

function toSubjectRecord(row: SubjectRow): SubjectRecord {
  return {
    id: row.id,
    source: row.source,
    sourceSubjectId: row.source_subject_id,
    title: row.title,
    originalTitle: row.original_title,
    year: row.year,
    subtype: row.subtype,
    genres: JSON.parse(row.genres),
    directors: JSON.parse(row.directors),
    actors: JSON.parse(row.actors),
    coverUrl: row.cover_url,
    doubanUrl: row.douban_url,
    ratingAverage: row.rating_average,
    ratingCount: row.rating_count,
    pubdates: JSON.parse(row.pubdates),
  }
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

function buildRecordWhere(filters: RecordFilters) {
  const clauses = ['1 = 1']
  const values: Array<string | number> = []

  if (filters.status) {
    clauses.push('wl.status = ?')
    values.push(filters.status)
  }

  if (filters.subtype) {
    clauses.push('s.subtype = ?')
    values.push(filters.subtype)
  }

  if (filters.year) {
    clauses.push('s.year = ?')
    values.push(filters.year)
  }

  return {
    sql: clauses.join(' AND '),
    values,
  }
}

export function createRecordsQueryService(database: DatabaseClient) {
  return {
    listRecords(filters: RecordFilters = {}) {
      const page = filters.page ?? 1
      const limit = filters.limit ?? 20
      const offset = (page - 1) * limit
      const where = buildRecordWhere(filters)

      const rows = database
        .prepare(
          `
            SELECT wl.id AS log_id,
                   wl.subject_id,
                   wl.status,
                   wl.rating,
                   wl.watched_at,
                   s.title,
                   s.year,
                   s.subtype,
                   s.cover_url
            FROM watch_logs wl
            INNER JOIN subjects s ON s.id = wl.subject_id
            WHERE ${where.sql}
            ORDER BY COALESCE(wl.watched_at, wl.created_at) DESC
            LIMIT ? OFFSET ?
          `,
        )
        .all(...where.values, limit, offset) as Array<{
        log_id: string
        subject_id: string
        title: string
        year: string | null
        subtype: string | null
        cover_url: string | null
        status: WatchStatus
        rating: number | null
        watched_at: string | null
      }>

      const total = database
        .prepare(
          `
            SELECT COUNT(*) AS total
            FROM watch_logs wl
            INNER JOIN subjects s ON s.id = wl.subject_id
            WHERE ${where.sql}
          `,
        )
        .get(...where.values) as { total: number }

      const items: RecordListItem[] = rows.map((row) => ({
        logId: row.log_id,
        subjectId: row.subject_id,
        title: row.title,
        year: row.year,
        subtype: row.subtype,
        coverUrl: row.cover_url,
        status: row.status,
        rating: row.rating,
        watchedAt: row.watched_at,
      }))

      return {
        total: total.total,
        page,
        limit,
        items,
      }
    },
    getRecordById(subjectId: string) {
      const subjectRow = database.prepare('SELECT * FROM subjects WHERE id = ?').get(subjectId) as
        | SubjectRow
        | undefined

      if (!subjectRow) {
        return null
      }

      const watchLogRows = database
        .prepare(
          'SELECT * FROM watch_logs WHERE subject_id = ? ORDER BY COALESCE(watched_at, created_at) DESC',
        )
        .all(subjectId) as WatchLogRow[]

      return {
        subject: toSubjectRecord(subjectRow),
        watchLogs: watchLogRows.map(toWatchLogRecord),
      }
    },
    getStats() {
      const counts = database
        .prepare(
          `
            SELECT status, COUNT(*) AS total
            FROM watch_logs
            GROUP BY status
          `,
        )
        .all() as Array<{ status: WatchStatus; total: number }>

      const totals = database
        .prepare(
          `
            SELECT
              (SELECT COUNT(*) FROM subjects) AS total_subjects,
              (SELECT COUNT(*) FROM watch_logs) AS total_logs
          `,
        )
        .get() as { total_subjects: number; total_logs: number }

      const countsByStatus = {
        doing: 0,
        done: 0,
        mark: 0,
      }

      for (const row of counts) {
        countsByStatus[row.status] = row.total
      }

      return {
        totalSubjects: totals.total_subjects,
        totalLogs: totals.total_logs,
        countsByStatus,
      }
    },
    getWidgetFeed(filters: Pick<RecordFilters, 'status' | 'limit'> = {}) {
      const list = this.listRecords({
        status: filters.status,
        limit: filters.limit ?? 6,
        page: 1,
      })

      return {
        items: list.items,
      }
    },
  }
}
