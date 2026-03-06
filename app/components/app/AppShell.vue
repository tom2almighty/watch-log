<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)

const navigationItems = [
  { label: '首页', to: '/' },
  { label: '记录', to: '/records' },
  { label: '管理', to: '/admin' },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100">
    <header class="border-b border-white/10 bg-black/30 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-neutral-400">观迹 · WatchLog</p>
          <h1 class="mt-1 text-lg font-semibold">{{ props.title }}</h1>
        </div>
        <nav class="flex items-center gap-3 text-sm text-neutral-300">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-emerald-400/50 hover:text-white"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <section class="max-w-2xl space-y-3">
        <p class="text-sm uppercase tracking-[0.25em] text-emerald-300">Personal watch archive</p>
        <h2 class="text-3xl font-semibold tracking-tight">{{ props.title }}</h2>
        <p v-if="props.description" class="text-sm leading-6 text-neutral-300">
          {{ props.description }}
        </p>
      </section>

      <slot />
    </main>
  </div>
</template>
