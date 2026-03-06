<script setup lang="ts">
import AppShell from '~/components/app/AppShell.vue'
import RecordGrid from '~/components/records/RecordGrid.vue'
import RecordPagination from '~/components/records/RecordPagination.vue'
import type { WatchStatus } from '../../shared/types/watchlog'

const watchlogApi = useWatchlogApi()
const route = useRoute()

const statusTabs: Array<{ label: string; value?: WatchStatus }> = [
  { label: '全部', value: undefined },
  { label: '已看完', value: 'done' },
  { label: '在观看', value: 'doing' },
  { label: '想看', value: 'mark' },
]

function parsePositiveInteger(value: unknown, fallback = 1) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return Math.floor(parsed)
}

const selectedStatus = computed(() => {
  const rawValue = Array.isArray(route.query.status) ? route.query.status[0] : route.query.status
  return (rawValue as WatchStatus | undefined) || undefined
})

const currentPage = computed(() => parsePositiveInteger(route.query.page, 1))
const recordsKey = computed(
  () => `watchlog-records-${selectedStatus.value || 'all'}-${currentPage.value}`,
)

const { data: records } = await useAsyncData(
  recordsKey,
  () =>
    watchlogApi.fetchRecords({
      status: selectedStatus.value,
      page: currentPage.value,
      limit: 12,
    }),
  {
    watch: [selectedStatus, currentPage],
  },
)

function selectStatus(status?: WatchStatus) {
  return navigateTo({
    path: '/records',
    query: status ? { status } : {},
  })
}

function selectPage(page: number) {
  return navigateTo({
    path: '/records',
    query: {
      ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
      ...(page > 1 ? { page } : {}),
    },
  })
}
</script>

<template>
  <AppShell
    title="观影记录总览"
    description="像翻阅放映目录一样浏览你的看片历史：用状态切换节奏，用分页和卡片墙查看每一部作品的停驻位置。"
    eyebrow="Archive Browser"
  >
    <section class="watchlog-panel rounded-[2rem] p-5 md:p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
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

        <p class="text-xs uppercase tracking-[0.24em] text-white/38">
          共 {{ records?.total || 0 }} 条记录
        </p>
      </div>
    </section>

    <RecordGrid :items="records?.items || []" />
    <RecordPagination
      :page="records?.page || currentPage"
      :total-pages="records?.totalPages || 1"
      @select="selectPage"
    />
  </AppShell>
</template>
