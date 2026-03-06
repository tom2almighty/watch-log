export interface WidgetFeedItem {
  subjectId: string
  title: string
  year: string | null
  coverUrl: string | null
  status: 'doing' | 'done' | 'mark'
  rating: number | null
  watchedAt: string | null
}

export interface WidgetFeedResponse {
  items: WidgetFeedItem[]
}

export function buildWidgetFeedUrl(
  endpoint: string,
  status?: string,
  limit?: number,
  proxyMode?: 'direct' | 'prefix' | 'relay',
  proxyPrefix?: string | null,
) {
  const url = new URL(endpoint)

  if (status) {
    url.searchParams.set('status', status)
  }

  if (limit) {
    url.searchParams.set('limit', String(limit))
  }

  if (proxyMode) {
    url.searchParams.set('proxyMode', proxyMode)
  }

  if (proxyPrefix) {
    url.searchParams.set('proxyPrefix', proxyPrefix)
  }

  return url
}

export async function fetchWidgetFeed(
  endpoint: string,
  status?: string,
  limit?: number,
  proxyMode?: 'direct' | 'prefix' | 'relay',
  proxyPrefix?: string | null,
) {
  const response = await fetch(buildWidgetFeedUrl(endpoint, status, limit, proxyMode, proxyPrefix))
  return (await response.json()) as WidgetFeedResponse
}
