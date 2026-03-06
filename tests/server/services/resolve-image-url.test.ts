import { describe, expect, it } from 'vitest'

import { resolveImageUrl } from '../../../server/services/images/resolve-image-url'

describe('resolveImageUrl', () => {
  const targetUrl = 'https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg'

  it('returns the original URL in direct mode', () => {
    expect(
      resolveImageUrl({
        url: targetUrl,
        mode: 'direct',
      }),
    ).toBe(targetUrl)
  })

  it('prepends the configured proxy prefix in prefix mode', () => {
    expect(
      resolveImageUrl({
        url: targetUrl,
        mode: 'prefix',
        prefix: 'https://image.baidu.com/search/down?url=',
      }),
    ).toBe(`https://image.baidu.com/search/down?url=${encodeURIComponent(targetUrl)}`)
  })

  it('returns the relay endpoint in relay mode', () => {
    expect(
      resolveImageUrl({
        url: targetUrl,
        mode: 'relay',
      }),
    ).toBe(`/api/image?url=${encodeURIComponent(targetUrl)}`)
  })
})
