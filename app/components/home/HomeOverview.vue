<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  totalLogs: number
  totalSubjects: number
  countsByStatus: {
    done: number
    doing: number
    mark: number
  }
}>()

const statCards = computed(() => [
  { label: '已看完', value: 'done' },
  { label: '在观看', value: 'doing' },
  { label: '想看单', value: 'mark' },
])
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
    <article class="watchlog-panel-strong rounded-[2rem] p-8 md:p-10">
      <div class="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/45">
        <span>观迹</span>
        <span class="h-px w-10 bg-white/10" />
        <span>私人放映目录</span>
      </div>

      <div class="mt-6 max-w-2xl space-y-5">
        <h3 class="watchlog-serif text-4xl leading-tight font-semibold md:text-5xl">
          把零散的观影记录，整理成一份带情绪温度的电影档案。
        </h3>
        <p class="max-w-xl text-sm leading-7 text-white/70 md:text-base">
          这里展示的是一个长期维护的个人看片索引：最近看完什么、正在补什么、还在等待什么，
          都会被收进同一张时间地图里。
        </p>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
          <p class="text-xs uppercase tracking-[0.3em] text-white/45">记录总数</p>
          <p class="mt-3 text-4xl font-semibold text-white">{{ totalLogs }}</p>
        </div>
        <div class="rounded-[1.75rem] border border-[#c8ff6a]/25 bg-[#c8ff6a]/10 p-5">
          <p class="text-xs uppercase tracking-[0.3em] text-[#c8ff6a]/70">作品总数</p>
          <p class="mt-3 text-4xl font-semibold text-white">{{ totalSubjects }}</p>
        </div>
      </div>
    </article>

    <article class="watchlog-panel rounded-[2rem] p-6 md:p-8">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.34em] text-white/45">状态分布</p>
          <h3 class="watchlog-serif mt-2 text-2xl font-semibold">当前片单体温</h3>
        </div>
        <div class="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
          updated daily
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <div
          v-for="card in statCards"
          :key="card.value"
          class="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-white/68">{{ card.label }}</p>
            <span class="text-2xl font-semibold text-white">
              {{ countsByStatus[card.value as keyof typeof countsByStatus] }}
            </span>
          </div>
          <div class="mt-4 h-2 rounded-full bg-white/6">
            <div
              class="h-2 rounded-full bg-gradient-to-r from-[#c8ff6a] to-[#f97f5f]"
              :style="{
                width: `${Math.max(
                  10,
                  (countsByStatus[card.value as keyof typeof countsByStatus] / Math.max(totalLogs, 1)) * 100,
                )}%`,
              }"
            />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
