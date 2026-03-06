<script setup lang="ts">
import type { WatchSource } from '../../../shared/types/watchlog'

interface RecordGridItem {
  logId: string
  source: WatchSource
  subjectId: string
  title: string
  year: string | null
  subtype: string | null
  coverUrl: string | null
  sourceUrl: string | null
  status: 'doing' | 'done' | 'mark'
  rating: number | null
  watchedAt: string | null
}

defineProps<{
  items: RecordGridItem[]
}>()

const statusLabelMap = {
  done: '已看完',
  doing: '在观看',
  mark: '想看',
} as const
</script>

<template>
  <section>
    <div v-if="items.length === 0" class="watchlog-panel rounded-[2rem] p-10 text-center">
      <p class="text-xs uppercase tracking-[0.32em] text-white/40">No entries</p>
      <h3 class="watchlog-serif mt-4 text-3xl font-semibold">还没有可展示的记录</h3>
      <p class="mt-3 text-sm leading-7 text-white/65">同步豆瓣数据后，这里会自动生成一整面观影卡片。</p>
    </div>

    <div
      v-else
      class="watchlog-record-grid watchlog-record-grid-compact watchlog-record-grid-responsive grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-3"
    >
      <article
        v-for="item in items"
        :key="item.logId"
        class="watchlog-record-card watchlog-record-card-compact watchlog-panel group overflow-hidden rounded-[1.35rem] xl:rounded-[1.2rem]"
      >
        <div class="relative aspect-[4/5] overflow-hidden bg-white/5">
          <img
            v-if="item.coverUrl"
            :src="item.coverUrl"
            :alt="item.title"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          >
          <div v-else class="flex h-full items-center justify-center text-[11px] text-white/35">NO COVER</div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div class="absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/45 px-2 py-1 text-[10px] text-white/78 xl:left-2 xl:top-2">
            {{ statusLabelMap[item.status] }}
          </div>
        </div>

        <div class="space-y-2.5 p-3 xl:space-y-2 xl:p-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.24em] text-white/35">{{ item.year || '未知年代' }}</p>
            <h3 class="watchlog-serif mt-1.5 text-base font-semibold leading-snug xl:text-lg">{{ item.title }}</h3>
          </div>

          <div class="flex items-center justify-between gap-2 text-[11px] text-white/58 xl:text-[11px]">
            <span>{{ item.subtype || 'movie' }}</span>
            <span v-if="item.rating">{{ '★'.repeat(item.rating) }}</span>
          </div>

          <p class="text-[11px] leading-5 text-white/46">
            {{ item.watchedAt ? `记录时间 ${item.watchedAt}` : '等待同步记录时间' }}
          </p>

          <a
            v-if="item.sourceUrl"
            class="inline-flex items-center justify-center rounded-full border border-white/12 px-3 py-1.5 text-[11px] text-white/82 transition hover:border-white/24 hover:text-white"
            :href="item.sourceUrl"
            target="_blank"
            rel="noreferrer"
          >
            查看原条目
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
