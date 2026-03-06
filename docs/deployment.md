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

## Widget 静态资源

Docker 镜像会把 Widget 构建产物复制到：
- `/public/widget/watch-log-widget.es.js`
- `/public/widget/watch-log-widget.iife.js`

可通过主站静态资源路径直接访问并嵌入博客。

## 管理接口安全

以下接口需要 `x-admin-token`：
- `POST /api/admin/sync`
- `GET /api/admin/sync-status`

请不要在公开页面中暴露 `ADMIN_TOKEN`。
