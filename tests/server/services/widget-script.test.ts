import { describe, expect, it } from 'vitest'

import {
  getWidgetScriptPath,
  WIDGET_SCRIPT_CONTENT_TYPE,
  WIDGET_SCRIPT_FILENAMES,
} from '../../../server/services/widget/script'

describe('widget script service', () => {
  it('resolves supported script filenames into dist paths', () => {
    expect(getWidgetScriptPath('/workspace/watch-log', 'watch-log-widget.es.js')).toBe(
      '/workspace/watch-log/packages/widget/dist/watch-log-widget.es.js',
    )
    expect(getWidgetScriptPath('/workspace/watch-log', 'watch-log-widget.iife.js')).toBe(
      '/workspace/watch-log/packages/widget/dist/watch-log-widget.iife.js',
    )
    expect(WIDGET_SCRIPT_FILENAMES).toEqual(['watch-log-widget.es.js', 'watch-log-widget.iife.js'])
    expect(WIDGET_SCRIPT_CONTENT_TYPE).toBe('text/javascript; charset=utf-8')
  })

  it('rejects unsupported script filenames', () => {
    expect(getWidgetScriptPath('/workspace/watch-log', 'other.js')).toBeNull()
    expect(getWidgetScriptPath('/workspace/watch-log', null)).toBeNull()
  })
})
