export type WatchSource = 'douban' | 'tmdb'

export type WatchStatus = 'doing' | 'done' | 'mark'

export type ImageProxyMode = 'direct' | 'prefix' | 'relay'

export type SyncRunStatus = 'pending' | 'running' | 'success' | 'error'

export interface SubjectRecord {
  id: string
  source: WatchSource
  sourceSubjectId: string
  title: string
  originalTitle: string | null
  year: string | null
  subtype: string | null
  genres: string[]
  directors: string[]
  actors: string[]
  coverUrl: string | null
  sourceUrl: string | null
  ratingAverage: number | null
  ratingCount: number | null
  pubdates: string[]
}

export interface WatchLogRecord {
  id: string
  source: WatchSource
  sourceInterestId: string
  subjectId: string
  status: WatchStatus
  rating: number | null
  comment: string | null
  watchedAt: string | null
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface SyncRunRecord {
  id: string
  source: WatchSource
  status: SyncRunStatus
  startedAt: string
  finishedAt: string | null
  message: string | null
}

export interface WidgetQueryOptions {
  status?: WatchStatus
  limit?: number
  layout?: 'grid' | 'list'
  proxyMode?: ImageProxyMode
  proxyPrefix?: string | null
}
