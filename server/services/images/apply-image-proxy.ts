import type { ImageProxyMode } from '../../../shared/types/watchlog'
import { resolveImageUrl } from './resolve-image-url'

export interface PublicImageProxyOptions {
  mode: ImageProxyMode
  prefix?: string | null
  relayPath?: string
}

interface HasCoverUrl {
  coverUrl: string | null
}

export function applyImageProxyToItem<T extends HasCoverUrl>(item: T, options: PublicImageProxyOptions): T {
  return {
    ...item,
    coverUrl: resolveImageUrl({
      url: item.coverUrl,
      mode: options.mode,
      prefix: options.prefix,
      relayPath: options.relayPath,
    }),
  }
}

export function applyImageProxyToItems<T extends HasCoverUrl>(items: T[], options: PublicImageProxyOptions): T[] {
  return items.map((item) => applyImageProxyToItem(item, options))
}
