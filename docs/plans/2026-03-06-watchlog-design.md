# WatchLog 设计说明

> 已确认方案：`Nuxt 主应用 + 独立 Widget 构建`，Widget 使用 `<script>` 注入的 Web Component。

## 目标

构建一个自部署、轻量、可扩展的个人观影记录系统：主应用提供完整单页体验，Widget 提供可嵌入 Hugo、Astro 等静态博客的观影展示能力；后端先接入豆瓣数据源并落库到 SQLite，同时保留未来接入 TMDB 的扩展能力。

## 核心决策

### 1. 应用架构

- 主应用使用 Nuxt 4，负责页面渲染、服务端 API、同步控制、SQLite 读写。
- Widget 独立放在 `packages/widget`，使用 Vite library mode 输出浏览器可直接加载的脚本。
- Widget 通过自定义元素挂载，使用 Shadow DOM 做样式隔离，避免污染博客现有样式。

### 2. 数据源设计

- 建立统一的 provider 抽象层，第一阶段仅实现 `douban` provider。
- 内部统一使用规范化领域模型，前端和 Widget 只消费统一模型，不直接依赖豆瓣原始返回结构。
- 后续新增 `tmdb` provider 时，只扩展 provider 与字段映射，不重写页面和存储层。

### 3. 数据存储

- 使用 SQLite 存储前端展示所需的最小必要字段，不全量存储豆瓣原始响应。
- 建议表结构最少包含：
  - `subjects`：影视条目主数据
  - `watch_logs`：用户观影记录、评分、状态、时间
  - `sync_runs`：同步任务记录
  - `sync_state`：增量同步游标与最后同步状态
- 原始 JSON 仅作为可选调试能力，不作为第一阶段必做项。

### 4. 同步机制

- 同步仅在服务端执行，前端不直接请求豆瓣接口。
- 首版支持：
  - 手动触发同步
  - 可选 cron 定时同步，默认关闭
  - 按 `status` 分页抓取
- 豆瓣接口 `count` 最大按 `50` 设计，同步器每页默认使用 `50`，以减少请求次数。
- 同步支持 `doing`、`done`、`mark` 三种状态。

### 5. API 安全策略

- 公开读 API：列表、详情、统计、筛选、Widget 数据读取。
- 受保护写 API：同步触发、同步重置、诊断操作。
- 保护方式采用 `ADMIN_TOKEN`，适合个人部署与 cron 调用。

### 6. 图片代理策略

- 图片访问提供可选策略，不绑定单一代理实现。
- 支持三种模式：
  - `direct`：直接返回原图地址
  - `prefix`：使用自定义前缀代理，例如 `https://image.baidu.com/search/down?url=`
  - `relay`：通过服务端图片转发接口 `/api/image`
- 主应用通过环境变量配置默认代理策略。
- Widget 允许通过属性覆盖代理策略与代理前缀。

## 建议目录结构

```text
app/
  app.vue
  pages/
  components/
packages/
  widget/
    src/
    vite.config.ts
server/
  api/
  utils/
  services/
  providers/
  database/
shared/
  types/
  constants/
docs/
  plans/
```

## 领域模型建议

### Subject

- `id`
- `source`
- `sourceSubjectId`
- `title`
- `originalTitle`
- `year`
- `subtype`
- `genres`
- `directors`
- `actors`
- `coverUrl`
- `doubanUrl`
- `ratingAverage`
- `ratingCount`
- `pubdates`

### WatchLog

- `id`
- `source`
- `sourceInterestId`
- `subjectId`
- `status`
- `rating`
- `comment`
- `watchedAt`
- `isPrivate`
- `createdAt`
- `updatedAt`

## 前端产品形态

### 主应用

- 首页：个人简介、统计卡片、最近观影
- 记录页：按状态、年份、形式筛选
- 详情弹层或详情页：展示作品信息与个人记录
- 管理页：同步状态、同步按钮、代理策略与接口诊断

### Widget

- 使用 `<watch-log-widget></watch-log-widget>` 嵌入
- 通过属性传入：
  - `endpoint`
  - `status`
  - `limit`
  - `layout`
  - `proxy-mode`
  - `proxy-prefix`
- 默认自适应容器宽度，支持卡片流与紧凑列表两种模式

## 数据流

1. 管理端触发同步或 cron 到时执行同步。
2. 服务端按状态与分页请求豆瓣接口。
3. provider 清洗数据并映射到统一领域模型。
4. 仓储层将数据 upsert 到 SQLite。
5. 主应用与 Widget 从 Nuxt API 读取标准化数据。
6. 图片地址根据代理策略在服务端或前端统一转换。

## 错误处理

- 豆瓣接口失败时记录 `sync_runs`，不清空已有展示数据。
- 单页同步失败可重试，保留上次成功游标。
- 图片代理失败时回退到占位图或隐藏封面。
- 非法 `ADMIN_TOKEN` 返回明确的 `401/403`。

## 轻量验证策略

- 不引入复杂 E2E。
- 只保留轻量测试：
  - 豆瓣字段映射测试
  - SQLite 仓储读写测试
  - 同步 API 的 smoke test
- 页面与 Widget 主要靠本地运行与构建验证。

## 文档要求

- 提供 `.env.example`，说明所有环境变量。
- 更新 `README.md`，覆盖本地开发、同步方式、部署方式、Widget 嵌入方式。
- 提供 Docker 部署说明与 cron 示例。

## Context7 结论摘要

- Nuxt 4 适合将服务端逻辑组织在 `server/api` 下，并通过 `useRuntimeConfig(event)` 读取环境变量。
- Widget 构建适合使用 Vite library mode，以独立入口输出浏览器消费的脚本产物。

## 下一步

下一步进入实现计划拆分，按轻量 TDD 和小步提交方式组织任务，但不引入沉重测试流程。
