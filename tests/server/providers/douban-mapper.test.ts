import { describe, expect, it } from 'vitest'

import { buildDoubanInterestsRequest, MAX_DOUBAN_PAGE_SIZE } from '../../../server/providers/douban/client'
import { mapDoubanInterestsPage } from '../../../server/providers/douban/mapper'

const doubanFixture = {
  count: 1,
  start: 1,
  total: 880,
  interests: [
    {
      comment: '',
      rating: {
        count: 1,
        max: 5,
        star_count: 4,
        value: 4,
      },
      create_time: '2026-01-28 19:51:19',
      status: 'done',
      id: 4496137804,
      is_private: false,
      subject: {
        rating: {
          count: 307074,
          max: 10,
          star_count: 4.5,
          value: 8.8,
        },
        pubdate: ['2023-11-22(韩国)'],
        pic: {
          large: 'https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg',
          normal: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2905141611.jpg',
        },
        year: '2023',
        card_subtitle: '2023 / 韩国 / 剧情 / 金性洙 / 黄政民 郑雨盛',
        id: '35712804',
        genres: ['剧情'],
        title: '首尔之春',
        actors: [{ name: '黄政民' }, { name: '郑雨盛' }],
        type: 'movie',
        cover_url: 'https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg',
        url: 'https://movie.douban.com/subject/35712804/',
        subtype: 'movie',
        directors: [{ name: '金性洙' }],
      },
    },
  ],
}

describe('douban provider', () => {
  it('maps the raw interests page into normalized records', () => {
    const page = mapDoubanInterestsPage(doubanFixture)

    expect(page.pagination).toEqual({
      count: 1,
      start: 1,
      total: 880,
      hasMore: true,
      nextStart: 2,
    })

    expect(page.items).toHaveLength(1)
    expect(page.items[0]).toMatchObject({
      subject: {
        source: 'douban',
        sourceSubjectId: '35712804',
        title: '首尔之春',
        year: '2023',
        genres: ['剧情'],
        directors: ['金性洙'],
        actors: ['黄政民', '郑雨盛'],
        coverUrl: 'https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg',
        sourceUrl: 'https://movie.douban.com/subject/35712804/',
        ratingAverage: 8.8,
        ratingCount: 307074,
      },
      watchLog: {
        source: 'douban',
        sourceInterestId: '4496137804',
        status: 'done',
        rating: 4,
        watchedAt: '2026-01-28 19:51:19',
        isPrivate: false,
      },
    })
  })

  it('builds request details with a max page size of 50', () => {
    const request = buildDoubanInterestsRequest(
      {
        apiBase: 'https://frodo.douban.com/api/v2',
        apiKey: 'demo-key',
        userId: 'alice',
        userAgent: 'watchlog-agent',
        referer: 'https://servicewechat.com/demo/123/page-frame.html',
        acceptLanguage: 'zh-CN,zh;q=0.9',
      },
      {
        status: 'done',
        start: 1,
        count: 100,
      },
    )

    expect(request.url.toString()).toBe(
      'https://frodo.douban.com/api/v2/user/alice/interests?type=movie&status=done&start=1&count=50&apiKey=demo-key',
    )
    expect(request.headers).toMatchObject({
      Host: 'frodo.douban.com',
      'User-Agent': 'watchlog-agent',
      Referer: 'https://servicewechat.com/demo/123/page-frame.html',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    })
    expect(MAX_DOUBAN_PAGE_SIZE).toBe(50)
  })
})
