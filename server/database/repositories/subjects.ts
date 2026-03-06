import type { DatabaseClient } from '../client'
import type { SubjectRecord } from '../../../shared/types/watchlog'

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
  source_url: string | null
  rating_average: number | null
  rating_count: number | null
  pubdates: string
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
    sourceUrl: row.source_url,
    ratingAverage: row.rating_average,
    ratingCount: row.rating_count,
    pubdates: JSON.parse(row.pubdates),
  }
}

export function createSubjectsRepository(database: DatabaseClient) {
  const upsertStatement = database.prepare(`
    INSERT INTO subjects (
      id, source, source_subject_id, title, original_title, year, subtype,
      genres, directors, actors, cover_url, source_url, rating_average,
      rating_count, pubdates, updated_at
    ) VALUES (
      @id, @source, @sourceSubjectId, @title, @originalTitle, @year, @subtype,
      @genres, @directors, @actors, @coverUrl, @sourceUrl, @ratingAverage,
      @ratingCount, @pubdates, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source,
      source_subject_id = excluded.source_subject_id,
      title = excluded.title,
      original_title = excluded.original_title,
      year = excluded.year,
      subtype = excluded.subtype,
      genres = excluded.genres,
      directors = excluded.directors,
      actors = excluded.actors,
      cover_url = excluded.cover_url,
      source_url = excluded.source_url,
      rating_average = excluded.rating_average,
      rating_count = excluded.rating_count,
      pubdates = excluded.pubdates,
      updated_at = CURRENT_TIMESTAMP
  `)

  const getByIdStatement = database.prepare('SELECT * FROM subjects WHERE id = ?')

  return {
    upsert(subject: SubjectRecord) {
      upsertStatement.run({
        ...subject,
        genres: JSON.stringify(subject.genres),
        directors: JSON.stringify(subject.directors),
        actors: JSON.stringify(subject.actors),
        pubdates: JSON.stringify(subject.pubdates),
      })
    },
    getById(id: string) {
      const row = getByIdStatement.get(id) as SubjectRow | undefined
      return row ? toSubjectRecord(row) : null
    },
  }
}
