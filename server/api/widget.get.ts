import { createDatabaseClient } from '../database/client'
import { createRecordsQueryService } from '../services/query/records-query'
import type { WatchStatus } from '../../shared/types/watchlog'

const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

export async function getWidgetResponse(
  filters: {
    status?: WatchStatus
    limit?: number
  },
  options: {
    queryService: {
      getWidgetFeed: (filters: { status?: WatchStatus; limit?: number }) => unknown
    }
  },
) {
  return options.queryService.getWidgetFeed(filters)
}

export default defineEventHandlerCompat(async (event) => {
  const query = getQuery(event)
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))

  return getWidgetResponse(
    {
      status: query.status as WatchStatus | undefined,
      limit: query.limit ? Number(query.limit) : 6,
    },
    { queryService },
  )
})
