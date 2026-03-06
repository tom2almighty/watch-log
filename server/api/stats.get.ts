import { markEventHandler } from '../utils/event-handler'
import { createDatabaseClient } from '../database/client'
import { createRecordsQueryService } from '../services/query/records-query'

export async function getStatsResponse(options: {
  queryService: {
    getStats: () => unknown
  }
}) {
  return options.queryService.getStats()
}

export default markEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))
  return getStatsResponse({ queryService })
})
