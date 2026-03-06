import { describe, expect, it } from 'vitest'

import { IMAGE_PROXY_MODES, WATCH_STATUSES } from '../../shared/constants/watchlog'
import type {
  ImageProxyMode,
  SubjectRecord,
  SyncRunRecord,
  WatchLogRecord,
  WidgetQueryOptions,
} from '../../shared/types/watchlog'

describe('watchlog shared schema', () => {
  it('exports supported statuses and proxy modes', () => {
    expect(WATCH_STATUSES).toEqual(['doing', 'done', 'mark'])
    expect(IMAGE_PROXY_MODES).toEqual(['direct', 'prefix', 'relay'])
  })

  it('keeps shared record contracts assignable', () => {
    const proxyMode: ImageProxyMode = 'relay'

    const subject: SubjectRecord = {
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
      coverUrl: 'https://img2.doubanio.com/example.jpg',
      doubanUrl: 'https://movie.douban.com/subject/35712804/',
      ratingAverage: 8.8,
      ratingCount: 307074,
      pubdates: ['2023-11-22(韩国)'],
    }

    const watchLog: WatchLogRecord = {
      id: 'log_1',
      source: 'douban',
      sourceInterestId: '4496137804',
      subjectId: subject.id,
      status: 'done',
      rating: 4,
      comment: '',
      watchedAt: '2026-01-28 19:51:19',
      isPrivate: false,
      createdAt: '2026-01-28 19:51:19',
      updatedAt: '2026-01-28 19:51:19',
    }

    const syncRun: SyncRunRecord = {
      id: 'sync_1',
      source: 'douban',
      status: 'success',
      startedAt: '2026-03-06T08:00:00.000Z',
      finishedAt: '2026-03-06T08:01:00.000Z',
      message: null,
    }

    const widgetOptions: WidgetQueryOptions = {
      status: 'done',
      limit: 6,
      layout: 'grid',
      proxyMode,
      proxyPrefix: null,
    }

    expect(subject.title).toBe('首尔之春')
    expect(watchLog.status).toBe('done')
    expect(syncRun.status).toBe('success')
    expect(widgetOptions.proxyMode).toBe('relay')
  })
})
