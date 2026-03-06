<script setup lang="ts">
const props = defineProps<{
  token: string
  syncing: boolean
  lastRun: {
    status?: string
    finishedAt?: string | null
    message?: string | null
  } | null
  countsByStatus?: Record<string, number>
}>()

const emit = defineEmits<{
  'update:token': [value: string]
  sync: []
}>()
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
    <article class="watchlog-panel-strong rounded-[2rem] p-8">
      <p class="text-xs uppercase tracking-[0.34em] text-white/45">管理入口</p>
      <h3 class="watchlog-serif mt-3 text-3xl font-semibold">同步控制台</h3>
      <p class="mt-4 max-w-xl text-sm leading-7 text-white/68">
        输入 `ADMIN_TOKEN` 后可以手动触发同步，并查看最近一次同步状态。
      </p>

      <label class="mt-8 block space-y-2">
        <span class="text-xs uppercase tracking-[0.28em] text-white/45">Admin Token</span>
        <input
          :value="props.token"
          type="password"
          class="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#c8ff6a]/40"
          placeholder="输入同步令牌"
          @input="emit('update:token', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <button
        class="mt-6 inline-flex items-center gap-3 rounded-full border border-[#c8ff6a]/30 bg-[#c8ff6a]/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-[#c8ff6a]/22 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="props.syncing || !props.token"
        @click="emit('sync')"
      >
        <span class="h-2 w-2 rounded-full bg-[#c8ff6a]" :class="props.syncing ? 'animate-pulse' : ''" />
        {{ props.syncing ? '同步进行中...' : '立即同步' }}
      </button>
    </article>

    <article class="watchlog-panel rounded-[2rem] p-8">
      <p class="text-xs uppercase tracking-[0.34em] text-white/45">最近状态</p>
      <div class="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
        <p class="text-sm text-white/55">最近一次执行</p>
        <p class="mt-2 text-2xl font-semibold text-white">
          {{ props.lastRun?.status || '尚未运行' }}
        </p>
        <p class="mt-3 text-sm text-white/55">
          {{ props.lastRun?.finishedAt || '等待第一次同步' }}
        </p>
        <p v-if="props.lastRun?.message" class="mt-3 text-sm text-white/45">{{ props.lastRun.message }}</p>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div v-for="(value, key) in props.countsByStatus || {}" :key="key" class="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
          <p class="text-xs uppercase tracking-[0.28em] text-white/40">{{ key }}</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ value }}</p>
        </div>
      </div>
    </article>
  </section>
</template>
