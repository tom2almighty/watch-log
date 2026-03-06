# 部署说明

## 环境准备

- Node.js 24+
- pnpm 10+
- 一份填写好的 `.env`
- 可写目录 `./data` 用于 SQLite

## 直接运行

```bash
pnpm install
pnpm build
node .output/server/index.mjs
```

## Docker Compose

```bash
docker compose up -d --build
```

应用默认监听 `3000` 端口。

## 首次部署建议

1. 准备 `.env`
2. 设置 `NUXT_ADMIN_TOKEN`
3. 启动服务
4. 使用 `/api/admin/sync` 触发第一次全量同步
5. 如果需要，再启用 `NUXT_ENABLE_SYNC_CRON=true`

## 数据目录

- SQLite 默认路径：`./data/watchlog.sqlite`
- 在 Docker Compose 中挂载为宿主机 `./data`

## Widget 脚本路由

应用构建时会先生成 Widget bundle，并通过以下路由提供：
- `/widget/watch-log-widget.es.js`
- `/widget/watch-log-widget.iife.js`

可直接使用这些地址嵌入博客。

## 管理接口安全

以下接口需要 `x-admin-token`：
- `POST /api/admin/sync`
- `GET /api/admin/sync-status`

请不要在公开页面中暴露 `ADMIN_TOKEN`。

## Widget 跨域白名单

如果 Widget 需要被其他域名的博客、站点或本地 HTTP 预览页加载，请配置：

```bash
NUXT_CORS_ALLOWED_ORIGINS=https://blog.example.com,http://localhost:3000
```

当前白名单会作用于：

- `/widget/**`
- `/api/widget`
- `/api/image`

说明：

- 只对白名单中的 `Origin` 返回 `Access-Control-Allow-Origin`
- 默认不放行 `file://` 对应的 `Origin: null`
- 本地预览请使用 HTTP 地址，而不是直接双击打开 `index.html`
