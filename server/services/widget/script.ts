import { resolve } from 'node:path'

export const WIDGET_SCRIPT_CONTENT_TYPE = 'text/javascript; charset=utf-8'
export const WIDGET_SCRIPT_FILENAMES = [
  'watch-log-widget.es.js',
  'watch-log-widget.iife.js',
] as const

export function getWidgetScriptPath(rootDir: string, filename: string | null | undefined) {
  if (!filename || !WIDGET_SCRIPT_FILENAMES.includes(filename as (typeof WIDGET_SCRIPT_FILENAMES)[number])) {
    return null
  }

  return resolve(rootDir, 'packages/widget/dist', filename)
}
