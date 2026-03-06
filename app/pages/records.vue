<script setup lang="ts">
import AppShell from '~/components/app/AppShell.vue'
import RecordGrid from '~/components/records/RecordGrid.vue'
import type { WatchStatus } from '../../shared/types/watchlog'

const watchlogApi = useWatchlogApi()
const route = useRoute()

const statusTabs: Array<{ label: string; value?: WatchStatus }> = [
  { label: '全部', value: undefined },
  { label: '已看完', value: 'done' },
  { label: '在观看', value: 'doing' },
  { label: '想看', value: 'mark' },
]

const selectedStatus = computed(() => (route.query.status as WatchStatus | undefined) || undefined)

const { data: records, refresh } = await useAsyncData(
  () => `watchlog-records-${selectedStatus.value || 'all'}`,
  () =>
    watchlogApi.fetchRecords({
      status: selectedStatus.value,
      page: 1,
      limit: 12,
    }),
)

watch(selectedStatus, () => refresh())

function selectStatus(status?: WatchStatus) {
  return navigateTo({
    path: '/records',
    query: status ? { status } : {},
  })
}
</script>

<template>
  <AppShell
    title="观影记录总览"
    description="像翻阅放映目录一样浏览你的看片历史：用状态切换节奏，用卡片墙查看每一部作品的停驻位置。"
    eyebrow="Archive Browser"
  >
    <section class="watchlog-panel rounded-[2rem] p-5 md:p-6">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="tab in statusTabs"
          :key="tab.label"
          class="watchlog-pill rounded-full px-4 py-2 text-sm"
          :class="selectedStatus === tab.value ? 'watchlog-pill-active' : ''"
          @click="selectStatus(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <RecordGrid :items="records?.items || []" />
  </AppShell>
</template>
