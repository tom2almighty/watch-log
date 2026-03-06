# Widget 嵌入指南

## 1. 构建产物

```bash
pnpm --filter ./packages/widget build
```

输出位于：`packages/widget/dist`

在 WatchLog 主应用里，执行 `pnpm build` 后会自动通过以下路径提供：
- `/widget/watch-log-widget.es.js`
- `/widget/watch-log-widget.iife.js`

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
- `proxy-mode`：`direct`、`prefix`、`relay`；不填时沿用 WatchLog 服务端默认模式
- `proxy-prefix`：`prefix` 模式下使用的图片前缀代理；只填写前缀即可

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

### prefix 模式怎么填

在 `prefix` 模式下，你只需要填写代理前缀，不需要把图片地址手工拼进去。WatchLog 会自动把原始封面地址编码后追加到前缀后面。

```html
<watch-log-widget
  endpoint="https://your-watchlog-site.example.com/api/widget"
  status="done"
  limit="4"
  proxy-mode="prefix"
  proxy-prefix="https://images.weserv.nl/?url="
></watch-log-widget>
```

例如原图是：

```
https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg
```

最终生成的图片地址会类似：

```
https://images.weserv.nl/?url=https%3A%2F%2Fimg2.doubanio.com%2Fview%2Fphoto%2Fm_ratio_poster%2Fpublic%2Fp2905141611.jpg
```

另一个例子：

```html
<watch-log-widget
  endpoint="https://your-watchlog-site.example.com/api/widget"
  proxy-mode="prefix"
  proxy-prefix="https://imageproxy.example.com/fetch?url="
></watch-log-widget>
```

### relay 跨域说明

如果 Widget 被嵌入在别的域名博客中，`relay` 模式不会去请求博客自己的 `/api/image`。它会根据 `endpoint` 自动请求 WatchLog 站点自己的图片中继地址，例如：

```
https://your-watchlog-site.example.com/api/image?url=...
```

## 6. 跨域白名单

如果你把 Widget 嵌入到其他域名的博客或本地预览页，WatchLog 服务端需要放行对应来源：

```bash
NUXT_CORS_ALLOWED_ORIGINS=https://blog.example.com,http://localhost:3000
```

白名单会同时覆盖：

- `watch-log-widget.es.js` / `watch-log-widget.iife.js`
- `/api/widget`
- `/api/image`

请使用 HTTP 本地地址预览；直接用 `file://` 打开 HTML 时，浏览器通常会发送 `Origin: null`，默认不会在白名单中通过。
