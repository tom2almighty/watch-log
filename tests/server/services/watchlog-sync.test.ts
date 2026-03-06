import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDatabaseClient } from '../../../server/database/client'
import { createSubjectsRepository } from '../../../server/database/repositories/subjects'
import { createSyncRunsRepository } from '../../../server/database/repositories/sync-runs'
import { createSyncStateRepository } from '../../../server/database/repositories/sync-state'
import { createWatchLogsRepository } from '../../../server/database/repositories/watch-logs'
import { createWatchLogSyncService } from '../../../server/services/sync/watchlog-sync'

const databases: Array<{ close: () => void }> = []

afterEach(() => {
  while (databases.length > 0) {
    databases.pop()?.close()
  }
})

describe('watchlog sync service', () => {
  it('syncs provider pages into sqlite and records sync status', async () => {
    const database = createDatabaseClient(':memory:')
    databases.push(database)

    const fetchPage = vi.fn().mockResolvedValue({
      items: [
        {
          subject: {
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
          },
          watchLog: {
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
          },
        },
      ],
      pagination: {
        count: 1,
        start: 1,
        total: 1,
        hasMore: false,
        nextStart: 2,
      },
    })

    const service = createWatchLogSyncService({
      provider: { fetchPage },
      subjects: createSubjectsRepository(database),
      watchLogs: createWatchLogsRepository(database),
      syncState: createSyncStateRepository(database),
      syncRuns: createSyncRunsRepository(database),
      now: () => '2026-03-06T09:00:00.000Z',
    })

    const result = await service.runSync({ statuses: ['done'] })

    expect(fetchPage).toHaveBeenCalledWith({ status: 'done', start: 1, count: 50 })
    expect(result).toMatchObject({
      status: 'success',
      totalItems: 1,
      statuses: [
        {
          status: 'done',
          items: 1,
          pages: 1,
        },
      ],
    })
    expect(service.getSyncStatus()).toMatchObject({
      latestRun: {
        status: 'success',
      },
      cursors: [
        {
          status: 'done',
          nextStart: 1,
          lastSuccessAt: '2026-03-06T09:00:00.000Z',
        },
      ],
    })
  })
})
