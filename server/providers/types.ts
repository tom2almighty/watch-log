import type { SubjectRecord, WatchLogRecord, WatchStatus } from '../utils/types'

export interface ProviderPageItem {
  subject: SubjectRecord
  watchLog: WatchLogRecord
}

export interface ProviderPagination {
  count: number
  start: number
  total: number
  hasMore: boolean
  nextStart: number
}

export interface ProviderPage {
  items: ProviderPageItem[]
  pagination: ProviderPagination
}

export interface ProviderFetchOptions {
  status: WatchStatus
  start?: number
  count?: number
}
