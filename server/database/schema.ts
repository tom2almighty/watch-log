import type { Database } from 'better-sqlite3'

const schemaStatements = [
  `
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      source_subject_id TEXT NOT NULL,
      title TEXT NOT NULL,
      original_title TEXT,
      year TEXT,
      subtype TEXT,
      genres TEXT NOT NULL,
      directors TEXT NOT NULL,
      actors TEXT NOT NULL,
      cover_url TEXT,
      douban_url TEXT,
      rating_average REAL,
      rating_count INTEGER,
      pubdates TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS watch_logs (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      source_interest_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      status TEXT NOT NULL,
      rating INTEGER,
      comment TEXT,
      watched_at TEXT,
      is_private INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS sync_state (
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      next_start INTEGER NOT NULL DEFAULT 0,
      last_synced_at TEXT,
      last_success_at TEXT,
      last_error TEXT,
      PRIMARY KEY (source, status)
    )
  `,
]

export function bootstrapDatabase(database: Database) {
  database.pragma('foreign_keys = ON')

  for (const statement of schemaStatements) {
    database.exec(statement)
  }
}
