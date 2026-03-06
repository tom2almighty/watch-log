const defineEventHandlerCompat =
  (globalThis as typeof globalThis & {
    defineEventHandler?: <T>(handler: T) => T
  }).defineEventHandler ?? ((handler) => handler)

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

export default defineEventHandlerCompat(async (event) => {
  const query = getQuery(event)
  const target = Array.isArray(query.url) ? query.url[0] : query.url

  if (!target) {
    throw createStatusError(400, 'Missing image url')
  }

  return sendProxy(event, target)
})
