import { IMAGE_PROXY_MODES } from '../../../shared/constants/watchlog'
import type { ImageProxyMode, SubjectRecord, WatchLogRecord } from '../../../shared/types/watchlog'
import { createDatabaseClient } from '../../database/client'
import { applyImageProxyToItem, type PublicImageProxyOptions } from '../../services/images/apply-image-proxy'
import { createRecordsQueryService } from '../../services/query/records-query'

const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

interface RecordDetailResponse {
  subject: SubjectRecord
  watchLogs: WatchLogRecord[]
}

function toImageProxyMode(value: unknown, fallback: ImageProxyMode): ImageProxyMode {
  return typeof value === 'string' && IMAGE_PROXY_MODES.includes(value as ImageProxyMode)
    ? (value as ImageProxyMode)
    : fallback
}

export async function getRecordByIdResponse(
  subjectId: string,
  options: {
    queryService: {
      getRecordById: (subjectId: string) => unknown
    }
    imageProxy?: PublicImageProxyOptions
  },
) {
  const detail = options.queryService.getRecordById(subjectId) as RecordDetailResponse | null

  if (!detail) {
    return null
  }

  return {
    ...detail,
    subject: options.imageProxy
      ? applyImageProxyToItem(detail.subject, options.imageProxy)
      : detail.subject,
  }
}

export default defineEventHandlerCompat(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const queryService = createRecordsQueryService(createDatabaseClient(runtimeConfig.dbPath))
  return getRecordByIdResponse(getRouterParam(event, 'id') || '', {
    queryService,
    imageProxy: {
      mode: toImageProxyMode(runtimeConfig.imageProxyMode, 'relay'),
      prefix: runtimeConfig.imageProxyPrefix,
      relayPath: '/api/image',
    },
  })
})
