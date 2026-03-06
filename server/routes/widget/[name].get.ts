import { readFile } from 'node:fs/promises'

import { getWidgetScriptPath, WIDGET_SCRIPT_CONTENT_TYPE } from '../../services/widget/script'
import { markEventHandler } from '../../utils/event-handler'

export default markEventHandler(async (event) => {
  const scriptPath = getWidgetScriptPath(process.cwd(), getRouterParam(event, 'name'))

  if (!scriptPath) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Widget script not found',
    })
  }

  setResponseHeader(event, 'Content-Type', WIDGET_SCRIPT_CONTENT_TYPE)

  try {
    return await readFile(scriptPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Widget script bundle is missing',
      })
    }

    throw error
  }
})
