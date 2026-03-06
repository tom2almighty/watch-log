import { afterEach, describe, expect, it } from 'vitest'

import { createDatabaseClient } from '../../../server/database/client'
import { createSubjectsRepository } from '../../../server/database/repositories/subjects'
import { createSyncStateRepository } from '../../../server/database/repositories/sync-state'
import { createWatchLogsRepository } from '../../../server/database/repositories/watch-logs'

const databases: Array<{ close: () => void }> = []

afterEach(() => {
  while (databases.length > 0) {
    databases.pop()?.close()
  }
})

describe('sqlite repositories', () => {
  it('inserts and reads subjects, watch logs, and sync state', () => {
    const database = createDatabaseClient(':memory:')
    databases.push(database)

    const subjects = createSubjectsRepository(database)
    const watchLogs = createWatchLogsRepository(database)
    const syncState = createSyncStateRepository(database)

    subjects.upsert({
      id: 'subject_1',
      source: 'douban',
      sourceSubjectId: '35712804',
      title: '首尔之春',
      originalTitle: null,
      year: '2023',
      subtype: 'movie',
      genres: ['剧情'],
      directors: ['金性洙'],
      actors: ['黄政民', '郑雨盛'],
      coverUrl: 'https://img2.doubanio.com/view/photo/public/example.jpg',
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 8.8,
      ratingCount: 307074,
      pubdates: ['2023-11-22(韩国)'],
    })

    watchLogs.upsert({
      id: 'log_1',
      source: 'douban',
      sourceInterestId: '4496137804',
      subjectId: 'subject_1',
      status: 'done',
      rating: 4,
      comment: '',
      watchedAt: '2026-01-28 19:51:19',
      isPrivate: false,
      createdAt: '2026-01-28 19:51:19',
      updatedAt: '2026-01-28 19:51:19',
    })

    syncState.upsert({
      source: 'douban',
      status: 'done',
      nextStart: 51,
      lastSyncedAt: '2026-03-06T08:00:00.000Z',
      lastSuccessAt: '2026-03-06T08:00:00.000Z',
      lastError: null,
    })

    expect(subjects.getById('subject_1')?.title).toBe('首尔之春')
    expect(watchLogs.listBySubjectId('subject_1')).toHaveLength(1)
    expect(syncState.get('douban', 'done')?.nextStart).toBe(51)
  })

  it('updates existing rows on upsert', () => {
    const database = createDatabaseClient(':memory:')
    databases.push(database)

    const subjects = createSubjectsRepository(database)

    subjects.upsert({
      id: 'subject_1',
      source: 'douban',
      sourceSubjectId: '35712804',
      title: '首尔之春',
      originalTitle: null,
      year: '2023',
      subtype: 'movie',
      genres: ['剧情'],
      directors: ['金性洙'],
      actors: ['黄政民'],
      coverUrl: null,
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 8.8,
      ratingCount: 307074,
      pubdates: ['2023-11-22(韩国)'],
    })

    subjects.upsert({
      id: 'subject_1',
      source: 'douban',
      sourceSubjectId: '35712804',
      title: '首尔之春（导演剪辑版）',
      originalTitle: null,
      year: '2023',
      subtype: 'movie',
      genres: ['剧情', '历史'],
      directors: ['金性洙'],
      actors: ['黄政民', '郑雨盛'],
      coverUrl: null,
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 9.1,
      ratingCount: 307075,
      pubdates: ['2023-11-22(韩国)'],
    })

    const subject = subjects.getById('subject_1')
    expect(subject?.title).toBe('首尔之春（导演剪辑版）')
    expect(subject?.genres).toEqual(['剧情', '历史'])
    expect(subject?.ratingAverage).toBe(9.1)
  })
})
