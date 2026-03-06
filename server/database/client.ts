import BetterSqlite3 from 'better-sqlite3'

import { bootstrapDatabase } from './schema'

export type DatabaseClient = ReturnType<typeof createDatabaseClient>

export function createDatabaseClient(location: string) {
  const database = new BetterSqlite3(location)
  bootstrapDatabase(database)
  return database
}
