# 观迹 | WatchLog

一个自部署、轻量、可扩展的个人观影记录项目。

WatchLog 由两部分组成：

- Nuxt 4 主应用：浏览观影记录、查看统计、触发同步、管理图片代理与部署配置
- 可嵌入 Widget：以 `<script>` + Web Component 的形式嵌入 Hugo、Astro 等静态博客

## 功能概览

- 豆瓣观影数据同步到 SQLite
- 公开读 API 与 `ADMIN_TOKEN` 保护的管理 API
- 可选定时同步（默认关闭）
- 三种图片代理模式：`direct`、`prefix`、`relay`
- 独立 Widget 构建产物，支持 `endpoint`、`status`、`limit`、`layout`、`proxy-mode`、`proxy-prefix`

## 快速开始

1. 复制环境变量模板：

   ```bash
   cp .env.example .env
   ```

2. 安装依赖并启动开发环境：

   ```bash
   pnpm install
   pnpm dev
   ```

默认开发地址：`http://localhost:3000`

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动 Nuxt 开发环境 |
| `pnpm test` | 启动 Vitest 交互式测试 |
| `pnpm test:run` | 一次性运行全部测试 |
| `pnpm build` | 构建 Nuxt 主应用 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm --filter ./packages/widget build` | 单独构建 Widget |
| `pnpm verify` | 运行测试 + 主应用构建 + Widget 构建 |

## 环境变量

### 豆瓣同步

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NUXT_DOUBAN_API_KEY` | 空 | 豆瓣接口 `apiKey` |
| `NUXT_DOUBAN_API_BASE` | `https://frodo.douban.com/api/v2` | 豆瓣 API 根地址 |
| `NUXT_DOUBAN_USER_ID` | 空 | 豆瓣用户 ID |
| `NUXT_DOUBAN_USER_AGENT` | 内置移动 UA | 请求豆瓣时使用的 `User-Agent` |
| `NUXT_DOUBAN_REFERER` | 内置微信小程序 Referer | 请求豆瓣时使用的 `Referer` |
| `NUXT_DOUBAN_ACCEPT_LANGUAGE` | `zh-CN,zh;q=0.9,en;q=0.8` | 请求豆瓣时使用的 `Accept-Language` |

> 同步器按状态分页拉取豆瓣数据，单次请求的 `count` 最大为 `50`；当前实现也按这个上限工作。

### 应用与存储

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NUXT_ADMIN_TOKEN` | 空 | 保护 `/api/admin/*` 的管理令牌，生产环境必须设置 |
| `NUXT_DB_PATH` | `./data/watchlog.sqlite` | SQLite 数据库文件路径 |
| `NUXT_PUBLIC_APP_NAME` | `watchlog` | 公开应用英文名 |
| `NUXT_PUBLIC_APP_TITLE` | `观迹` | 公开应用中文名 |

### 定时同步

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NUXT_ENABLE_SYNC_CRON` | `false` | 是否启用定时同步 |
| `NUXT_SYNC_CRON_EXPRESSION` | `0 */6 * * *` | Nitro scheduled task 使用的 cron 表达式 |

### 图片代理

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NUXT_IMAGE_PROXY_MODE` | `relay` | 服务端默认图片代理模式 |
| `NUXT_IMAGE_PROXY_PREFIX` | 空 | `prefix` 模式的代理前缀，格式为 `PREFIX + encodeURIComponent(url)` |
| `NUXT_PUBLIC_IMAGE_PROXY_MODE` | `relay` | 前端默认图片代理模式；Widget 可单独覆盖 |

## 图片代理策略

| 模式 | 行为 | 适用场景 | 建议 |
| --- | --- | --- | --- |
| `direct` | 直接使用豆瓣图片地址 | 图片源稳定且可直连的内网/科学上网环境 | 仅在你确认源图可稳定访问时使用 |
| `prefix` | 通过 `代理前缀 + encodeURIComponent(url)` 访问图片 | 你已有第三方图片代理/CDN 服务 | 适合接入现成代理服务 |
| `relay` | 通过本站 `/api/image?url=...` 中继 | 希望降低前端配置成本，统一由服务端处理 | 默认推荐 |

### 如何选择

- 想要最省心的部署体验：优先用 `relay`
- 已经有稳定的图片代理服务：选择 `prefix`
- 确认豆瓣图片地址可长期直连：才考虑 `direct`

### 相关配置关系

| 位置 | 配置项 | 作用 |
| --- | --- | --- |
| 服务端默认值 | `NUXT_IMAGE_PROXY_MODE` | 后端和默认输出使用的代理模式 |
| 服务端前缀 | `NUXT_IMAGE_PROXY_PREFIX` | `prefix` 模式时的代理前缀 |
| 前端默认值 | `NUXT_PUBLIC_IMAGE_PROXY_MODE` | 主站前端默认使用的代理模式 |
| Widget 覆盖 | `proxy-mode` / `proxy-prefix` | 单个嵌入组件可按需覆盖默认代理 |

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

## Widget 嵌入

先构建 Widget：

```bash
pnpm --filter ./packages/widget build
```

### 可用属性

| 属性 | 说明 | 示例 |
| --- | --- | --- |
| `endpoint` | Widget 拉取数据的 API 地址 | `https://watchlog.example.com/api/widget` |
| `status` | 过滤状态，支持 `done` / `doing` / `mark` | `done` |
| `limit` | 展示条目数量 | `6` |
| `layout` | 布局模式，当前支持 `grid` | `grid` |
| `proxy-mode` | 覆盖默认图片代理模式 | `relay` |
| `proxy-prefix` | 覆盖默认代理前缀 | `https://imageproxy.example/?url=` |

### 嵌入示例

```html
<script src="https://watchlog.example.com/widget/watch-log-widget.iife.js" defer></script>
<watch-log-widget
  endpoint="https://watchlog.example.com/api/widget"
  status="done"
  limit="6"
  proxy-mode="relay"
></watch-log-widget>
```

详细嵌入说明见 `docs/widget-embed.md`。

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
- 本轮优化设计：`docs/plans/2026-03-06-watchlog-docs-ui-polish-design.md`
- 本轮优化计划：`docs/plans/2026-03-06-watchlog-docs-ui-polish-implementation.md`
- Widget 嵌入：`docs/widget-embed.md`
- 部署说明：`docs/deployment.md`
