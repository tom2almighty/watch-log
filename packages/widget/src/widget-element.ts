import widgetStyles from './styles.css?inline'
import { fetchWidgetFeed, resolveWidgetCoverUrl } from './api'

interface WidgetDependencies {
  fetchFeed?: typeof fetchWidgetFeed
}

export function createWatchLogWidgetElement(deps: WidgetDependencies = {}) {
  const fetchFeed = deps.fetchFeed ?? fetchWidgetFeed

  return class WatchLogWidgetElement extends HTMLElement {
    static get observedAttributes() {
      return ['endpoint', 'status', 'limit', 'layout', 'proxy-mode', 'proxy-prefix']
    }

    #shadow = this.attachShadow({ mode: 'open' })

    connectedCallback() {
      void this.renderFeed()
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        void this.renderFeed()
      }
    }

    async renderFeed() {
      const endpoint = this.getAttribute('endpoint')

      if (!endpoint) {
        this.#shadow.innerHTML = this.renderShell('<div class="widget-empty">Missing `endpoint` attribute.</div>')
        return
      }

      this.#shadow.innerHTML = this.renderShell('<div class="widget-empty">Loading WatchLog…</div>')

      const status = this.getAttribute('status') || undefined
      const limit = this.getAttribute('limit') ? Number(this.getAttribute('limit')) : undefined
      const layout = this.getAttribute('layout') || 'grid'
      const proxyMode = (this.getAttribute('proxy-mode') || 'direct') as 'direct' | 'prefix' | 'relay'
      const proxyPrefix = this.getAttribute('proxy-prefix')

      const payload = await fetchFeed(endpoint, status, limit)
      const cards = payload.items
        .map((item) => {
          const coverUrl = resolveWidgetCoverUrl(item.coverUrl, proxyMode, proxyPrefix)
          return `
            <article class="widget-card widget-card-compact">
              ${coverUrl ? `<img src="${coverUrl}" alt="${item.title}" />` : '<div class="widget-placeholder"></div>'}
              <div class="widget-meta">
                <span class="widget-status">${item.status}</span>
                <h3>${item.title}</h3>
                <p>${item.year || '未知年代'} · ${item.rating ? `评分 ${item.rating}` : '未评分'}</p>
                <p>${item.watchedAt || '等待时间记录'}</p>
              </div>
            </article>
          `
        })
        .join('')

      this.#shadow.innerHTML = this.renderShell(
        payload.items.length
          ? `<div class="widget-list widget-list-compact ${layout}">${cards}</div>`
          : '<div class="widget-empty">暂时还没有同步到可展示的观影记录。</div>',
      )
    }

    renderShell(content: string) {
      return `
        <style>${widgetStyles}</style>
        <section class="widget-root">
          <header class="widget-header">
            <small>WatchLog Widget</small>
            <h2>观迹 · 最近观影</h2>
          </header>
          ${content}
        </section>
      `
    }
  }
}
