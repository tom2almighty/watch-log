import { createDatabaseClient } from '../../database/client'
import { createRecordsQueryService } from '../../services/query/records-query'
import type { WatchStatus } from '../../../shared/types/watchlog'

const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

interface GetRecordsOptions {
  queryService: {
    listRecords: (filters: {
      status?: WatchStatus
      subtype?: string
      year?: string
      page?: number
      limit?: number
    }) => unknown
  }
}

export async function getRecordsResponse(
  filters: {
    status?: WatchStatus
    subtype?: string
    year?: string
    page?: number
    limit?: number
  },
  options: GetRecordsOptions,
) {
  return options.queryService.listRecords(filters)
}

export default defineEventHandlerCompat(async (event) => {
  const query = getQuery(event)
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))

  return getRecordsResponse(
    {
      status: query.status as WatchStatus | undefined,
      subtype: query.subtype as string | undefined,
      year: query.year as string | undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    },
    { queryService },
  )
})
