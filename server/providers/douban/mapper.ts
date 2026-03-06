import type { ProviderPage } from '../types'
import type { SubjectRecord, WatchLogRecord, WatchStatus } from '../../../shared/types/watchlog'

interface DoubanNamedPerson {
  name: string
}

interface DoubanInterestSubject {
  id: string
  title: string
  year?: string | null
  type?: string | null
  subtype?: string | null
  genres?: string[]
  directors?: DoubanNamedPerson[]
  actors?: DoubanNamedPerson[]
  cover_url?: string | null
  url?: string | null
  pic?: {
    large?: string | null
    normal?: string | null
  }
  rating?: {
    value?: number | null
    count?: number | null
  }
  pubdate?: string[]
}

interface DoubanInterest {
  id: number | string
  comment?: string | null
  create_time?: string | null
  status: WatchStatus
  is_private?: boolean
  rating?: {
    value?: number | null
  }
  subject: DoubanInterestSubject
}

interface DoubanInterestsResponse {
  count: number
  start: number
  total: number
  interests?: DoubanInterest[]
}

function toSubjectRecord(subject: DoubanInterestSubject): SubjectRecord {
  const coverUrl = subject.cover_url ?? subject.pic?.large ?? subject.pic?.normal ?? null

  return {
    id: `douban:subject:${subject.id}`,
    source: 'douban',
    sourceSubjectId: String(subject.id),
    title: subject.title,
    originalTitle: null,
    year: subject.year ?? null,
    subtype: subject.subtype ?? subject.type ?? null,
    genres: subject.genres ?? [],
    directors: (subject.directors ?? []).map((item) => item.name),
    actors: (subject.actors ?? []).map((item) => item.name),
    coverUrl,
    doubanUrl: subject.url ?? null,
    ratingAverage: subject.rating?.value ?? null,
    ratingCount: subject.rating?.count ?? null,
    pubdates: subject.pubdate ?? [],
  }
}

function toWatchLogRecord(interest: DoubanInterest, subjectId: string): WatchLogRecord {
  const timestamp = interest.create_time ?? new Date(0).toISOString()

  return {
    id: `douban:interest:${interest.id}`,
    source: 'douban',
    sourceInterestId: String(interest.id),
    subjectId,
    status: interest.status,
    rating: interest.rating?.value ?? null,
    comment: interest.comment ?? null,
    watchedAt: interest.create_time ?? null,
    isPrivate: Boolean(interest.is_private),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function mapDoubanInterestsPage(response: DoubanInterestsResponse): ProviderPage {
  const interests = response.interests ?? []
  const items = interests.map((interest) => {
    const subject = toSubjectRecord(interest.subject)
    const watchLog = toWatchLogRecord(interest, subject.id)

    return {
      subject,
      watchLog,
    }
  })

  return {
    items,
    pagination: {
      count: response.count,
      start: response.start,
      total: response.total,
      hasMore: response.start + response.count <= response.total,
      nextStart: response.start + response.count,
    },
  }
}
