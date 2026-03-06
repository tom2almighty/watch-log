import { createDatabaseClient } from '../database/client'
import { createRecordsQueryService } from '../services/query/records-query'

const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

export async function getStatsResponse(options: {
  queryService: {
    getStats: () => unknown
  }
}) {
  return options.queryService.getStats()
}

export default defineEventHandlerCompat(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))
  return getStatsResponse({ queryService })
})
