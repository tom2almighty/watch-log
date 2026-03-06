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

export function assertAdminToken(providedToken: string | null | undefined, adminToken: string) {
  if (!adminToken) {
    throw createStatusError(500, 'ADMIN_TOKEN is not configured')
  }

  if (providedToken !== adminToken) {
    throw createStatusError(403, 'Invalid admin token')
  }
}

export function readAdminToken(event: {
  node?: { req?: { headers?: Record<string, string | string[] | undefined> } }
  headers?: Record<string, string | string[] | undefined>
}) {
  const getHeaderCompat = (globalThis as typeof globalThis & {
    getHeader?: (target: unknown, name: string) => string | undefined
  }).getHeader

  if (getHeaderCompat) {
    return getHeaderCompat(event, 'x-admin-token')
  }

  const header = event.headers?.['x-admin-token'] ?? event.node?.req?.headers?.['x-admin-token']
  return Array.isArray(header) ? header[0] : header
}

export function requireAdminToken(
  event: {
    node?: { req?: { headers?: Record<string, string | string[] | undefined> } }
    headers?: Record<string, string | string[] | undefined>
  },
  adminToken: string,
) {
  assertAdminToken(readAdminToken(event), adminToken)
}
