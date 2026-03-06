import { createDatabaseClient } from '../../database/client'
import { createRecordsQueryService } from '../../services/query/records-query'

const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

export async function getRecordByIdResponse(
  subjectId: string,
  options: {
    queryService: {
      getRecordById: (subjectId: string) => unknown
    }
  },
) {
  return options.queryService.getRecordById(subjectId)
}

export default defineEventHandlerCompat(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))
  return getRecordByIdResponse(getRouterParam(event, 'id') || '', { queryService })
})
