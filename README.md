# 观迹 | WatchLog

一个自部署、轻量、可扩展的个人观影记录项目。

WatchLog 由两部分组成：
- Nuxt 4 主应用：浏览观影记录、查看统计、触发同步、管理代理策略
- 可嵌入 Widget：以 `<script>` + Web Component 的形式嵌入 Hugo、Astro 等静态博客

## 功能概览

- 豆瓣观影数据同步到 SQLite
- 公开读 API 与 `ADMIN_TOKEN` 保护的管理 API
- 可选定时同步（默认关闭）
- 三种图片代理模式：`direct`、`prefix`、`relay`
- 独立 Widget 构建产物，支持 `endpoint`、`status`、`limit`、`layout`、`proxy-mode`、`proxy-prefix`

## 本地开发

```bash
pnpm install
pnpm dev
```

默认开发地址：`http://localhost:3000`

## 常用命令

```bash
pnpm test
pnpm build
pnpm preview
pnpm --filter ./packages/widget build
```

## 环境变量

复制 `.env.example` 到 `.env` 后填写：

- `NUXT_DOUBAN_API_KEY`：豆瓣接口 `apiKey`
- `NUXT_DOUBAN_API_BASE`：豆瓣 API 根地址，默认 `https://frodo.douban.com/api/v2`
- `NUXT_DOUBAN_USER_ID`：豆瓣用户 ID
- `NUXT_DOUBAN_USER_AGENT`：请求豆瓣时的 `User-Agent`
- `NUXT_DOUBAN_REFERER`：请求豆瓣时的 `Referer`
- `NUXT_DOUBAN_ACCEPT_LANGUAGE`：请求豆瓣时的 `Accept-Language`
- `NUXT_ADMIN_TOKEN`：保护 `/api/admin/*` 接口
- `NUXT_DB_PATH`：SQLite 文件路径，默认 `./data/watchlog.sqlite`
- `NUXT_ENABLE_SYNC_CRON`：是否启用定时同步，默认 `false`
- `NUXT_SYNC_CRON_EXPRESSION`：定时同步 cron 表达式，默认 `0 */6 * * *`
- `NUXT_IMAGE_PROXY_MODE`：默认图片代理模式，支持 `direct`、`prefix`、`relay`
- `NUXT_IMAGE_PROXY_PREFIX`：`prefix` 模式下的代理前缀
- `NUXT_PUBLIC_APP_NAME`：公开应用英文名
- `NUXT_PUBLIC_APP_TITLE`：公开应用中文名
- `NUXT_PUBLIC_IMAGE_PROXY_MODE`：前端默认图片代理模式

## 同步方式

### 手动同步

向管理接口发送请求，并在 Header 中带上 `x-admin-token`：

```bash
curl -X POST http://localhost:3000/api/admin/sync \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"statuses":["done","doing","mark"]}'
```

查询同步状态：

```bash
curl http://localhost:3000/api/admin/sync-status \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

### 定时同步

设置：

```bash
NUXT_ENABLE_SYNC_CRON=true
NUXT_SYNC_CRON_EXPRESSION=0 */6 * * *
```

当前实现使用 Nitro scheduled tasks，在 `node-server` 预设下按 cron 表达式触发 `sync:watchlog`。

## 图片代理策略

- `direct`：直接使用豆瓣图片地址
- `prefix`：使用前缀代理，格式为 `PREFIX + encodeURIComponent(url)`
- `relay`：使用 `/api/image?url=...` 服务端中继

推荐默认使用 `relay`，博客嵌入时也可以在 Widget 上按需改成 `prefix`。

## Widget 嵌入

构建 Widget：

```bash
pnpm --filter ./packages/widget build
```

详细嵌入示例见 `docs/widget-embed.md`。

## Docker 部署

详细部署步骤见 `docs/deployment.md`。

快速启动：

```bash
docker compose up -d --build
```

## 文档

- 需求说明：`docs/plans/spec.md`
- 设计说明：`docs/plans/2026-03-06-watchlog-design.md`
- 实施计划：`docs/plans/2026-03-06-watchlog-implementation.md`
- Widget 嵌入：`docs/widget-embed.md`
- 部署说明：`docs/deployment.md`
