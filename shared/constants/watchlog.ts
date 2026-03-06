import type { ImageProxyMode, WatchStatus } from '../types/watchlog'

export const WATCH_STATUSES: WatchStatus[] = ['doing', 'done', 'mark']

export const IMAGE_PROXY_MODES: ImageProxyMode[] = ['direct', 'prefix', 'relay']
