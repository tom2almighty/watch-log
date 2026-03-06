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

export function buildWidgetFeedUrl(endpoint: string, status?: string, limit?: number) {
  const url = new URL(endpoint)

  if (status) {
    url.searchParams.set('status', status)
  }

  if (limit) {
    url.searchParams.set('limit', String(limit))
  }

  return url
}

export async function fetchWidgetFeed(endpoint: string, status?: string, limit?: number) {
  const response = await fetch(buildWidgetFeedUrl(endpoint, status, limit))
  return (await response.json()) as WidgetFeedResponse
}

export function resolveWidgetCoverUrl(
  coverUrl: string | null,
  proxyMode: 'direct' | 'prefix' | 'relay',
  proxyPrefix?: string | null,
) {
  if (!coverUrl) {
    return null
  }

  if (proxyMode === 'direct') {
    return coverUrl
  }

  if (proxyMode === 'prefix') {
    return `${proxyPrefix || ''}${encodeURIComponent(coverUrl)}`
  }

  return `/api/image?url=${encodeURIComponent(coverUrl)}`
}
