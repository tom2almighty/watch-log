// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'

import { createWatchLogWidgetElement } from '../../packages/widget/src/widget-element'

describe('watchlog widget element', () => {
  it('registers and renders fetched items', async () => {
    const fetchFeed = vi.fn().mockResolvedValue({
      items: [
        {
          subjectId: 'douban:subject:1',
          title: '首尔之春',
          year: '2023',
          coverUrl: '/api/image?url=demo',
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
    document.body.appendChild(element)

    await Promise.resolve()
    await Promise.resolve()

    expect(fetchFeed).toHaveBeenCalled()
    expect(element.shadowRoot?.textContent).toContain('首尔之春')
  })
})
