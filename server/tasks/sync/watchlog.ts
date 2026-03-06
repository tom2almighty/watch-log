import syncHandler from '../../api/admin/sync.post'

const defineTaskCompat =
  (globalThis as typeof globalThis & {
    defineTask?: <T>(task: T) => T
  }).defineTask ?? ((task) => task)

export default defineTaskCompat({
  meta: {
    name: 'sync:watchlog',
    description: 'Sync watchlog data from Douban into SQLite',
  },
  async run() {
    return syncHandler({
      headers: {
        'x-admin-token': useRuntimeConfig().adminToken,
      },
    } as never)
  },
})
