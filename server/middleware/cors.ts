import { buildCorsHeaders, isCorsEnabledPath, parseCorsAllowedOrigins } from '../utils/cors'

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname

  if (!isCorsEnabledPath(pathname)) {
    return
  }

  const runtimeConfig = useRuntimeConfig(event)
  const allowedOrigins = parseCorsAllowedOrigins(runtimeConfig.corsAllowedOrigins)
  const origin = getHeader(event, 'origin')
  const headers = buildCorsHeaders({
    pathname,
    origin,
    allowedOrigins,
  })

  if (headers) {
    for (const [name, value] of Object.entries(headers)) {
      setResponseHeader(event, name, value)
    }
  }

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
