<script setup lang="ts">
import AppShell from '~/components/app/AppShell.vue'
import HomeOverview from '~/components/home/HomeOverview.vue'
import RecordGrid from '~/components/records/RecordGrid.vue'
import { ALIGNED_RECORD_GRID_LIMIT } from '~/constants/record-grid'

const watchlogApi = useWatchlogApi()

const { data: stats } = await useAsyncData('watchlog-stats', () => watchlogApi.fetchStats())
const { data: recentRecords } = await useAsyncData('watchlog-recent-records', () =>
  watchlogApi.fetchRecords({ status: 'done', page: 1, limit: ALIGNED_RECORD_GRID_LIMIT }),
)

const statsSummary = computed(() =>
  stats.value || {
    totalSubjects: 0,
    totalLogs: 0,
    countsByStatus: {
      done: 0,
      doing: 0,
      mark: 0,
    },
  },
)
</script>

<template>
  <AppShell
    title="私人观影档案馆"
    description="一份适合长期自托管的看片记录系统：主站负责浏览和管理，Widget 负责安静地嵌入你的博客侧栏与正文。"
    eyebrow="WatchLog · Night Edition"
  >
    <HomeOverview
      :total-logs="statsSummary.totalLogs"
      :total-subjects="statsSummary.totalSubjects"
      :counts-by-status="statsSummary.countsByStatus"
    />

    <section class="space-y-5">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.34em] text-white/45">Recent Screenings</p>
          <h3 class="watchlog-serif mt-2 text-3xl font-semibold">最近看完</h3>
        </div>
        <NuxtLink to="/records" class="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-white/25 hover:text-white">
          查看完整片单
        </NuxtLink>
      </div>

      <RecordGrid :items="recentRecords?.items || []" />
    </section>
  </AppShell>
</template>
