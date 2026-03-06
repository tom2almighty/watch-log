<script setup lang="ts">
interface RecordGridItem {
  logId: string
  subjectId: string
  title: string
  year: string | null
  subtype: string | null
  coverUrl: string | null
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
      class="watchlog-record-grid watchlog-record-grid-compact watchlog-record-grid-responsive grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-3 2xl:grid-cols-5"
    >
      <article
        v-for="item in items"
        :key="item.logId"
        class="watchlog-record-card watchlog-record-card-compact watchlog-panel group overflow-hidden rounded-[1.45rem] xl:rounded-[1.25rem]"
      >
        <div class="relative aspect-[4/5] overflow-hidden bg-white/5">
          <img
            v-if="item.coverUrl"
            :src="item.coverUrl"
            :alt="item.title"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          >
          <div v-else class="flex h-full items-center justify-center text-xs text-white/35">NO COVER</div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div class="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] text-white/78 xl:left-2.5 xl:top-2.5 xl:px-2 xl:text-[10px]">
            {{ statusLabelMap[item.status] }}
          </div>
        </div>

        <div class="space-y-3 p-4 xl:space-y-2 xl:p-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.28em] text-white/35 xl:text-[10px]">{{ item.year || '未知年代' }}</p>
            <h3 class="watchlog-serif mt-2 text-xl font-semibold leading-snug xl:text-lg">{{ item.title }}</h3>
          </div>

          <div class="flex items-center justify-between gap-3 text-xs text-white/58 xl:text-[11px]">
            <span>{{ item.subtype || 'movie' }}</span>
            <span v-if="item.rating">{{ '★'.repeat(item.rating) }}</span>
          </div>

          <p class="text-xs leading-6 text-white/46 xl:text-[11px] xl:leading-5">
            {{ item.watchedAt ? `记录时间 ${item.watchedAt}` : '等待同步记录时间' }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
