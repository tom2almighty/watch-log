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

afterEach(() => {
  while (databases.length > 0) {
    databases.pop()?.close()
  }
})

describe('public read api helpers', () => {
  it('returns records list, details, stats, and widget feed', async () => {
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
      coverUrl: 'https://img2.doubanio.com/example.jpg',
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 8.8,
      ratingCount: 307074,
      pubdates: ['2023-11-22(韩国)'],
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

    const queryService = createRecordsQueryService(database)

    const records = await getRecordsResponse(
      { status: 'done', page: 1, limit: 10 },
      { queryService },
    )
    const detail = await getRecordByIdResponse('douban:subject:35712804', { queryService })
    const stats = await getStatsResponse({ queryService })
    const widget = await getWidgetResponse({ status: 'done', limit: 1 }, { queryService })

    expect(records).toMatchObject({
      total: 1,
      page: 1,
      limit: 10,
      items: [
        {
          subjectId: 'douban:subject:35712804',
          title: '首尔之春',
          status: 'done',
        },
      ],
    })
    expect(detail).toMatchObject({
      subject: {
        id: 'douban:subject:35712804',
        title: '首尔之春',
      },
      watchLogs: [
        {
          status: 'done',
          rating: 4,
        },
      ],
    })
    expect(stats).toMatchObject({
      totalSubjects: 1,
      totalLogs: 1,
      countsByStatus: {
        done: 1,
        doing: 0,
        mark: 0,
      },
    })
    expect(widget).toMatchObject({
      items: [
        {
          subjectId: 'douban:subject:35712804',
          title: '首尔之春',
        },
      ],
    })
  })
})
