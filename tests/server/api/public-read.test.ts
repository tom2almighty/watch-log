import { afterEach, describe, expect, it } from 'vitest'

import { getRecordByIdResponse } from '../../../server/api/records/[id].get'
import { getRecordsResponse } from '../../../server/api/records/index.get'
import { getStatsResponse } from '../../../server/api/stats.get'
import { getWidgetResponse } from '../../../server/api/widget.get'
import { createDatabaseClient } from '../../../server/database/client'
import { createSubjectsRepository } from '../../../server/database/repositories/subjects'
import { createWatchLogsRepository } from '../../../server/database/repositories/watch-logs'
import { createRecordsQueryService } from '../../../server/services/query/records-query'

const databases: Array<{ close: () => void }> = []
const proxyPrefix = 'https://images.weserv.nl/?url='
const firstCover = 'https://img2.doubanio.com/example-1.jpg'
const secondCover = 'https://img2.doubanio.com/example-2.jpg'

afterEach(() => {
  while (databases.length > 0) {
    databases.pop()?.close()
  }
})

describe('public read api helpers', () => {
  it('returns records list, details, stats, and widget feed with proxy-aware images and pagination metadata', async () => {
    const database = createDatabaseClient(':memory:')
    databases.push(database)

    const subjects = createSubjectsRepository(database)
    const watchLogs = createWatchLogsRepository(database)

    subjects.upsert({
      id: 'douban:subject:35712804',
      source: 'douban',
      sourceSubjectId: '35712804',
      title: '首尔之春',
      originalTitle: null,
      year: '2023',
      subtype: 'movie',
      genres: ['剧情'],
      directors: ['金性洙'],
      actors: ['黄政民', '郑雨盛'],
      coverUrl: firstCover,
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 8.8,
      ratingCount: 307074,
      pubdates: ['2023-11-22(韩国)'],
    })

    subjects.upsert({
      id: 'douban:subject:3011091',
      source: 'douban',
      sourceSubjectId: '3011091',
      title: '让子弹飞',
      originalTitle: null,
      year: '2010',
      subtype: 'movie',
      genres: ['剧情'],
      directors: ['姜文'],
      actors: ['姜文', '葛优'],
      coverUrl: secondCover,
      doubanUrl: 'https://movie.douban.com/subject/3011091/',
      ratingAverage: 9.0,
      ratingCount: 1000000,
      pubdates: ['2010-12-16(中国大陆)'],
    })

    watchLogs.upsert({
      id: 'douban:interest:4496137804',
      source: 'douban',
      sourceInterestId: '4496137804',
      subjectId: 'douban:subject:35712804',
      status: 'done',
      rating: 4,
      comment: '',
      watchedAt: '2026-01-28 19:51:19',
      isPrivate: false,
      createdAt: '2026-01-28 19:51:19',
      updatedAt: '2026-01-28 19:51:19',
    })

    watchLogs.upsert({
      id: 'douban:interest:4496137805',
      source: 'douban',
      sourceInterestId: '4496137805',
      subjectId: 'douban:subject:3011091',
      status: 'done',
      rating: 5,
      comment: '',
      watchedAt: '2025-12-18 20:00:00',
      isPrivate: false,
      createdAt: '2025-12-18 20:00:00',
      updatedAt: '2025-12-18 20:00:00',
    })

    const queryService = createRecordsQueryService(database)

    const records = await getRecordsResponse(
      { status: 'done', page: 2, limit: 1 },
      {
        queryService,
        imageProxy: {
          mode: 'prefix',
          prefix: proxyPrefix,
        },
      },
    )
    const detail = await getRecordByIdResponse('douban:subject:35712804', {
      queryService,
      imageProxy: {
        mode: 'prefix',
        prefix: proxyPrefix,
      },
    })
    const stats = await getStatsResponse({ queryService })
    const widget = await getWidgetResponse(
      { status: 'done', limit: 1 },
      {
        queryService,
        imageProxy: {
          mode: 'relay',
          relayPath: 'https://watchlog.example.com/api/image',
        },
      },
    )

    expect(records).toMatchObject({
      total: 2,
      page: 2,
      limit: 1,
      totalPages: 2,
      hasPrev: true,
      hasNext: false,
      items: [
        {
          subjectId: 'douban:subject:3011091',
          title: '让子弹飞',
          status: 'done',
          coverUrl: `${proxyPrefix}${encodeURIComponent(secondCover)}`,
        },
      ],
    })
    expect(detail).toMatchObject({
      subject: {
        id: 'douban:subject:35712804',
        title: '首尔之春',
        coverUrl: `${proxyPrefix}${encodeURIComponent(firstCover)}`,
      },
      watchLogs: [
        {
          status: 'done',
          rating: 4,
        },
      ],
    })
    expect(stats).toMatchObject({
      totalSubjects: 2,
      totalLogs: 2,
      countsByStatus: {
        done: 2,
        doing: 0,
        mark: 0,
      },
    })
    expect(widget).toMatchObject({
      items: [
        {
          subjectId: 'douban:subject:35712804',
          title: '首尔之春',
          coverUrl: `https://watchlog.example.com/api/image?url=${encodeURIComponent(firstCover)}`,
        },
      ],
    })
  })
})
