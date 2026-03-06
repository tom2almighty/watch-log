const defineNitroPluginCompat =
  (globalThis as typeof globalThis & {
    defineNitroPlugin?: <T>(plugin: T) => T
  }).defineNitroPlugin ?? ((plugin) => plugin)

export default defineNitroPluginCompat(() => {
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig.enableSyncCron) {
    console.info(
      `[watchlog] Nitro scheduled task enabled for sync:watchlog with cron ${runtimeConfig.syncCronExpression}`,
    )
  }
})
