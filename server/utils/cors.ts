const CORS_ENABLED_PATHS = new Set(['/api/widget', '/api/image'])
const CORS_ENABLED_PREFIXES = ['/widget/']
const CORS_ALLOWED_METHODS = 'GET, HEAD, OPTIONS'
const CORS_ALLOWED_HEADERS = 'Content-Type'

function normalizeOrigin(origin: string) {
  const trimmedOrigin = origin.trim()

  if (!trimmedOrigin) {
    return null
  }

  try {
    const parsedOrigin = new URL(trimmedOrigin)

    if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
      return null
    }

    return parsedOrigin.origin
  } catch {
    return null
  }
}

export function parseCorsAllowedOrigins(rawOrigins: string | null | undefined) {
  const normalizedOrigins = new Set<string>()

  for (const origin of (rawOrigins ?? '').split(/[\n,]/)) {
    const normalizedOrigin = normalizeOrigin(origin)

    if (normalizedOrigin) {
      normalizedOrigins.add(normalizedOrigin)
    }
  }

  return [...normalizedOrigins]
}

export function isCorsEnabledPath(pathname: string) {
  return CORS_ENABLED_PATHS.has(pathname) || CORS_ENABLED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function buildCorsHeaders(input: {
  pathname: string
  origin: string | null | undefined
  allowedOrigins: string[]
}) {
  if (!isCorsEnabledPath(input.pathname)) {
    return null
  }

  const normalizedOrigin = input.origin ? normalizeOrigin(input.origin) : null

  if (!normalizedOrigin) {
    return null
  }

  if (!input.allowedOrigins.includes(normalizedOrigin)) {
    return {
      Vary: 'Origin',
    }
  }

  return {
    'Access-Control-Allow-Origin': normalizedOrigin,
    'Access-Control-Allow-Methods': CORS_ALLOWED_METHODS,
    'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS,
    Vary: 'Origin',
  }
}
