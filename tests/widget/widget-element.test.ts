// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'

import { buildWidgetFeedUrl } from '../../packages/widget/src/api'
import { createWatchLogWidgetElement } from '../../packages/widget/src/widget-element'

describe('watchlog widget element', () => {
  it('builds widget feed URLs with proxy overrides', () => {
    const url = buildWidgetFeedUrl(
      'https://watchlog.example.com/api/widget',
      'done',
      6,
      'prefix',
      'https://images.weserv.nl/?url=',
    )

    expect(url.toString()).toContain('status=done')
    expect(url.toString()).toContain('limit=6')
    expect(url.toString()).toContain('proxyMode=prefix')
    expect(url.toString()).toContain(encodeURIComponent('https://images.weserv.nl/?url='))
  })

  it('registers, forwards proxy config, and renders fetched items', async () => {
    const fetchFeed = vi.fn().mockResolvedValue({
      items: [
        {
          subjectId: 'douban:subject:1',
          title: '首尔之春',
          year: '2023',
          coverUrl: 'https://watchlog.example.com/api/image?url=demo',
          status: 'done',
          rating: 4,
          watchedAt: '2026-01-28 19:51:19',
        },
      ],
    })

    const WidgetElement = createWatchLogWidgetElement({ fetchFeed })
    customElements.define('watch-log-widget-test', WidgetElement)

    const element = document.createElement('watch-log-widget-test')
    element.setAttribute('endpoint', 'https://watchlog.example.com/api/widget')
    element.setAttribute('status', 'done')
    element.setAttribute('limit', '1')
    element.setAttribute('proxy-mode', 'relay')
    document.body.appendChild(element)

    await Promise.resolve()
    await Promise.resolve()

    expect(fetchFeed).toHaveBeenCalledWith(
      'https://watchlog.example.com/api/widget',
      'done',
      1,
      'relay',
      null,
    )
    expect(element.shadowRoot?.textContent).toContain('首尔之春')
    expect(element.shadowRoot?.querySelector('.widget-list-compact')).toBeTruthy()
    expect(element.shadowRoot?.querySelector('.widget-card-compact')).toBeTruthy()
    expect(element.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe(
      'https://watchlog.example.com/api/image?url=demo',
    )
  })
})
