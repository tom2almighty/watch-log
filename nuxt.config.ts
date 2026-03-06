import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    doubanApiKey: '',
    doubanApiBase: 'https://frodo.douban.com/api/v2',
    doubanUserId: '',
    doubanUserAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001023) NetType/WIFI Language/zh_CN',
    doubanReferer: 'https://servicewechat.com/wx2f9b06c1de1ccfca/99/page-frame.html',
    doubanAcceptLanguage: 'zh-CN,zh;q=0.9,en;q=0.8',
    adminToken: '',
    dbPath: './data/watchlog.sqlite',
    enableSyncCron: false,
    syncCronExpression: '0 */6 * * *',
    imageProxyMode: 'relay',
    imageProxyPrefix: '',
    public: {
      appName: 'watchlog',
      appTitle: '观迹',
      imageProxyMode: 'relay',
    },
  },
})
