import { markEventHandler } from '../../utils/event-handler'
import { IMAGE_PROXY_MODES } from '../../../shared/constants/watchlog'
import type { ImageProxyMode, WatchStatus } from '../../../shared/types/watchlog'
import { createDatabaseClient } from '../../database/client'
import { createRecordsQueryService } from '../../services/query/records-query'
import {
  applyImageProxyToItems,
  type PublicImageProxyOptions,
} from '../../services/images/apply-image-proxy'

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

interface RecordListResponse {
  total: number
  page: number
  limit: number
  items: RecordListItem[]
}

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
  imageProxy?: PublicImageProxyOptions
}

function toPositiveInteger(value: unknown, fallback: number, max?: number) {
  const parsed = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  const normalized = Math.floor(parsed)
  return max ? Math.min(normalized, max) : normalized
}

function toImageProxyMode(value: unknown, fallback: ImageProxyMode): ImageProxyMode {
  return typeof value === 'string' && IMAGE_PROXY_MODES.includes(value as ImageProxyMode)
    ? (value as ImageProxyMode)
    : fallback
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
  const response = options.queryService.listRecords(filters) as RecordListResponse
  const totalPages = Math.max(1, Math.ceil(response.total / Math.max(response.limit, 1)))

  return {
    ...response,
    totalPages,
    hasPrev: response.page > 1,
    hasNext: response.page < totalPages,
    items: options.imageProxy
      ? applyImageProxyToItems(response.items, options.imageProxy)
      : response.items,
  }
}

export default markEventHandler(async (event) => {
  const query = getQuery(event)
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))

  return getRecordsResponse(
    {
      status: query.status as WatchStatus | undefined,
      subtype: query.subtype as string | undefined,
      year: query.year as string | undefined,
      page: toPositiveInteger(query.page, 1),
      limit: toPositiveInteger(query.limit, 20, 50),
    },
    {
      queryService,
      imageProxy: {
        mode: toImageProxyMode(runtimeConfig.imageProxyMode, 'relay'),
        prefix: runtimeConfig.imageProxyPrefix,
        relayPath: '/api/image',
      },
    },
  )
})
