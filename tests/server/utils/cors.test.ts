import { describe, expect, it } from 'vitest'

import {
  buildCorsHeaders,
  isCorsEnabledPath,
  parseCorsAllowedOrigins,
} from '../../../server/utils/cors'

describe('cors utilities', () => {
  it('parses and normalizes configured origins', () => {
    expect(
      parseCorsAllowedOrigins(' https://blog.example.com/ , http://localhost:3000 , ,https://foo.bar '),
    ).toEqual([
      'https://blog.example.com',
      'http://localhost:3000',
      'https://foo.bar',
    ])
  })

  it('matches widget assets and public widget endpoints', () => {
    expect(isCorsEnabledPath('/widget/watch-log-widget.es.js')).toBe(true)
    expect(isCorsEnabledPath('/api/widget')).toBe(true)
    expect(isCorsEnabledPath('/api/image')).toBe(true)
    expect(isCorsEnabledPath('/api/admin/sync')).toBe(false)
  })

  it('returns CORS headers only for allowed origins on supported paths', () => {
    const allowedOrigins = parseCorsAllowedOrigins('https://blog.example.com,http://localhost:3000')

    expect(
      buildCorsHeaders({
        pathname: '/api/widget',
        origin: 'https://blog.example.com',
        allowedOrigins,
      }),
    ).toMatchObject({
      'Access-Control-Allow-Origin': 'https://blog.example.com',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    })

    expect(
      buildCorsHeaders({
        pathname: '/api/widget',
        origin: 'https://evil.example.com',
        allowedOrigins,
      }),
    ).toEqual({
      Vary: 'Origin',
    })

    expect(
      buildCorsHeaders({
        pathname: '/api/admin/sync',
        origin: 'https://blog.example.com',
        allowedOrigins,
      }),
    ).toBeNull()
  })
})
