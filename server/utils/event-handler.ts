export function markEventHandler<T extends (event: unknown) => unknown>(handler: T): T {
  Object.assign(handler, {
    __is_handler__: true,
  })

  return handler
}
