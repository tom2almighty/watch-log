import { markEventHandler } from '../utils/event-handler'
function createStatusError(statusCode: number, statusMessage: string) {
  const createErrorCompat = (globalThis as typeof globalThis & {
    createError?: (input: { statusCode: number; statusMessage: string }) => Error
  }).createError

  if (createErrorCompat) {
    return createErrorCompat({ statusCode, statusMessage })
  }

  return Object.assign(new Error(statusMessage), {
    statusCode,
    statusMessage,
  })
}

export default markEventHandler(async (event: any) => {
  const query = getQuery(event)
  const target = Array.isArray(query.url) ? query.url[0] : query.url

  if (!target) {
    throw createStatusError(400, 'Missing image url')
  }

  setResponseHeader(event, 'Cache-Control', 'public, max-age=15552000')

  return sendProxy(event, target)
})
