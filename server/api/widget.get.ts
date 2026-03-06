import { markEventHandler } from '../utils/event-handler'
import { IMAGE_PROXY_MODES } from '../../shared/constants/watchlog'
import type { ImageProxyMode, WatchStatus } from '../../shared/types/watchlog'
import { createDatabaseClient } from '../database/client'
import { applyImageProxyToItems, type PublicImageProxyOptions } from '../services/images/apply-image-proxy'
import { createRecordsQueryService } from '../services/query/records-query'

interface WidgetFeedItem {
  subjectId: string
  title: string
  year: string | null
  coverUrl: string | null
  status: WatchStatus
  rating: number | null
  watchedAt: string | null
}

interface WidgetFeedResponse {
  items: WidgetFeedItem[]
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

export async function getWidgetResponse(
  filters: {
    status?: WatchStatus
    limit?: number
  },
  options: {
    queryService: {
      getWidgetFeed: (filters: { status?: WatchStatus; limit?: number }) => unknown
    }
    imageProxy?: PublicImageProxyOptions
  },
) {
  const feed = options.queryService.getWidgetFeed(filters) as WidgetFeedResponse

  return {
    items: options.imageProxy
      ? applyImageProxyToItems(feed.items, options.imageProxy)
      : feed.items,
  }
}

export default markEventHandler(async (event) => {
  const query = getQuery(event)
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))
  const requestUrl = getRequestURL(event)
  const runtimeMode = toImageProxyMode(runtimeConfig.imageProxyMode, 'relay')

  return getWidgetResponse(
    {
      status: query.status as WatchStatus | undefined,
      limit: toPositiveInteger(query.limit, 6, 50),
    },
    {
      queryService,
      imageProxy: {
        mode: toImageProxyMode(query.proxyMode, runtimeMode),
        prefix:
          typeof query.proxyPrefix === 'string'
            ? query.proxyPrefix
            : runtimeConfig.imageProxyPrefix,
        relayPath: new URL('/api/image', requestUrl).toString(),
      },
    },
  )
})
