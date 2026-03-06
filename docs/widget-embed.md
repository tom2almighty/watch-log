# Widget 嵌入指南

## 1. 构建产物

```bash
pnpm --filter ./packages/widget build
```

输出位于：`packages/widget/dist`

推荐将以下文件部署到你的主站静态目录：
- `watch-log-widget.es.js`
- `watch-log-widget.iife.js`

## 2. 基础嵌入

```html
<script type="module" src="https://your-watchlog-site.example.com/widget/watch-log-widget.es.js"></script>
<watch-log-widget
  endpoint="https://your-watchlog-site.example.com/api/widget"
  status="done"
  limit="6"
  layout="grid"
  proxy-mode="relay"
></watch-log-widget>
```

## 3. 可用属性

- `endpoint`：Widget 数据源地址，通常是 `/api/widget`
- `status`：筛选状态，可选 `done`、`doing`、`mark`
- `limit`：最多显示多少条
- `layout`：`grid` 或 `list`
- `proxy-mode`：`direct`、`prefix`、`relay`
- `proxy-prefix`：`prefix` 模式下使用的图片前缀代理

## 4. Hugo / Astro 示例

### Hugo

```html
<script type="module" src="https://your-watchlog-site.example.com/widget/watch-log-widget.es.js"></script>
<watch-log-widget endpoint="https://your-watchlog-site.example.com/api/widget" status="done" limit="4"></watch-log-widget>
```

### Astro

```astro
<script type="module" src="https://your-watchlog-site.example.com/widget/watch-log-widget.es.js"></script>
<watch-log-widget endpoint="https://your-watchlog-site.example.com/api/widget" layout="list" limit="5" />
```

## 5. 图片代理建议

- 主站与 Widget 同源时，推荐 `proxy-mode="relay"`
- 静态博客想复用第三方前缀代理时，使用 `proxy-mode="prefix"` 并设置 `proxy-prefix`
