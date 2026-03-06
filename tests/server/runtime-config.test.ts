import { describe, expect, it } from 'vitest'

import config from '../../nuxt.config'

describe('runtime config', () => {
  it('exposes required server runtime keys', () => {
    expect(config.runtimeConfig).toMatchObject({
      doubanApiKey: '',
      doubanApiBase: 'https://frodo.douban.com/api/v2',
      doubanUserId: '',
      doubanUserAgent: expect.any(String),
      doubanReferer: expect.any(String),
      adminToken: '',
      dbPath: './data/watchlog.sqlite',
      corsAllowedOrigins: '',
      enableSyncCron: false,
      syncCronExpression: '0 */6 * * *',
      imageProxyMode: 'relay',
      imageProxyPrefix: '',
      public: {
        appName: 'watchlog',
        appTitle: '观迹',
        imageProxyMode: 'relay',
      },
    })
  })
})
