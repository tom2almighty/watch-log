import type { ProviderFetchOptions } from '../types'

export const MAX_DOUBAN_PAGE_SIZE = 50

export interface DoubanRuntimeConfig {
  apiBase: string
  apiKey: string
  userId: string
  userAgent: string
  referer: string
  acceptLanguage: string
}

export interface DoubanRequestDetails {
  url: URL
  headers: Record<string, string>
}

export function buildDoubanInterestsRequest(
  config: DoubanRuntimeConfig,
  options: ProviderFetchOptions,
): DoubanRequestDetails {
  const pageSize = Math.min(options.count ?? MAX_DOUBAN_PAGE_SIZE, MAX_DOUBAN_PAGE_SIZE)
  const start = options.start ?? 1
  const apiBase = config.apiBase.endsWith('/') ? config.apiBase : `${config.apiBase}/`
  const url = new URL(`user/${config.userId}/interests`, apiBase)

  url.searchParams.set('type', 'movie')
  url.searchParams.set('status', options.status)
  url.searchParams.set('start', String(start))
  url.searchParams.set('count', String(pageSize))
  url.searchParams.set('apiKey', config.apiKey)

  return {
    url,
    headers: {
      Host: url.host,
      'User-Agent': config.userAgent,
      Referer: config.referer,
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': config.acceptLanguage,
    },
  }
}

export async function fetchDoubanInterestsPage<TResponse>(
  fetcher: (url: string, options?: { headers?: Record<string, string> }) => Promise<TResponse>,
  config: DoubanRuntimeConfig,
  options: ProviderFetchOptions,
) {
  const request = buildDoubanInterestsRequest(config, options)
  return fetcher(request.url.toString(), { headers: request.headers })
}
