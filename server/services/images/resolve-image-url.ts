import type { ImageProxyMode } from '../../utils/types'

interface ResolveImageUrlOptions {
  url: string | null | undefined
  mode: ImageProxyMode
  prefix?: string | null
  relayPath?: string
}

export function resolveImageUrl(options: ResolveImageUrlOptions) {
  if (!options.url) {
    return null
  }

  if (options.mode === 'direct') {
    return options.url
  }

  if (options.mode === 'prefix') {
    return `${options.prefix || ''}${encodeURIComponent(options.url)}`
  }

  return `${options.relayPath || '/api/image'}?url=${encodeURIComponent(options.url)}`
}
