<script setup lang="ts">
import SyncControlPanel from '~/components/admin/SyncControlPanel.vue'
import AppShell from '~/components/app/AppShell.vue'

const watchlogApi = useWatchlogApi()
const adminToken = ref('')
const syncing = ref(false)
const syncStatus = ref<{
  latestRun: {
    status?: string
    finishedAt?: string | null
    message?: string | null
  } | null
  cursors: Array<{ status: string; nextStart: number }>
} | null>(null)

const countsByStatus = computed(() => {
  const counts: Record<string, number> = {
    done: 0,
    doing: 0,
    mark: 0,
  }

  for (const item of syncStatus.value?.cursors || []) {
    counts[item.status] = item.nextStart
  }

  return counts
})

async function loadSyncStatus() {
  if (!adminToken.value) {
    return
  }

  syncStatus.value = await watchlogApi.fetchSyncStatus(adminToken.value)
}

async function triggerSync() {
  if (!adminToken.value) {
    return
  }

  syncing.value = true
  try {
    await watchlogApi.runSync(adminToken.value)
    await loadSyncStatus()
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  adminToken.value = window.localStorage.getItem('watchlog-admin-token') || ''
  if (adminToken.value) {
    loadSyncStatus()
  }
})

watch(adminToken, (value) => {
  if (import.meta.client) {
    window.localStorage.setItem('watchlog-admin-token', value)
  }
})
</script>

<template>
  <AppShell
    title="同步与代理设置"
    description="这里是 WatchLog 的后台入口：同步豆瓣数据、查看上次执行结果，并为后续图片代理与 Widget 配置打底。"
    eyebrow="Ops Console"
  >
    <SyncControlPanel
      :token="adminToken"
      :syncing="syncing"
      :last-run="syncStatus?.latestRun || null"
      :counts-by-status="countsByStatus"
      @update:token="adminToken = $event"
      @sync="triggerSync"
    />
  </AppShell>
</template>
