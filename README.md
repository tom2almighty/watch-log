# 观迹 | WatchLog

一个自部署、轻量、可扩展的个人观影记录项目。

## 当前状态

- 使用 Nuxt 4 作为主应用框架
- 计划提供 SPA 主界面与可嵌入的 Web Component Widget
- 数据源首期接入豆瓣，后续保留 TMDB 扩展能力
- 存储方案使用 SQLite（`better-sqlite3`）

## 开发命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
```

## 环境变量

请复制 `.env.example` 到 `.env` 并填写：

- `NUXT_DOUBAN_API_KEY`：豆瓣接口 `apiKey`
- `NUXT_DOUBAN_API_BASE`：豆瓣 API 根地址
- `NUXT_DOUBAN_USER_ID`：豆瓣用户 ID
- `NUXT_DOUBAN_USER_AGENT`：服务端请求豆瓣时使用的 User-Agent
- `NUXT_DOUBAN_REFERER`：服务端请求豆瓣时使用的 Referer
- `NUXT_DOUBAN_ACCEPT_LANGUAGE`：服务端请求豆瓣时使用的 Accept-Language
- `NUXT_ADMIN_TOKEN`：保护同步与管理接口
- `NUXT_DB_PATH`：SQLite 文件路径
- `NUXT_ENABLE_SYNC_CRON`：是否启用定时同步，默认 `false`
- `NUXT_SYNC_CRON_EXPRESSION`：定时同步表达式，默认每 6 小时一次
- `NUXT_IMAGE_PROXY_MODE`：默认图片代理模式，支持 `direct`、`prefix`、`relay`
- `NUXT_IMAGE_PROXY_PREFIX`：`prefix` 模式下的前缀代理地址
- `NUXT_PUBLIC_APP_NAME`：公开应用英文名
- `NUXT_PUBLIC_APP_TITLE`：公开应用中文名
- `NUXT_PUBLIC_IMAGE_PROXY_MODE`：前端默认图片代理模式

## 文档

- 需求说明：`docs/plans/spec.md`
- 设计说明：`docs/plans/2026-03-06-watchlog-design.md`
- 实施计划：`docs/plans/2026-03-06-watchlog-implementation.md`
