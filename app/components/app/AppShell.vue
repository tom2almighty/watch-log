<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
  }>(),
  {
    description: '',
    eyebrow: '观迹 · WatchLog',
  },
)

const route = useRoute()

const navigationItems = [
  { label: '首页', to: '/' },
  { label: '记录', to: '/records' },
  { label: '管理', to: '/admin' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(200,255,106,0.18),transparent_55%)]" />

    <header class="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <div class="min-w-0">
          <p class="text-[11px] uppercase tracking-[0.38em] text-white/45">{{ props.eyebrow }}</p>
          <h1 class="watchlog-serif mt-1 truncate text-xl font-semibold md:text-2xl">{{ props.title }}</h1>
        </div>

        <nav class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 text-sm transition"
            :class="
              route.path === item.to
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-white/70 hover:bg-white/8 hover:text-white'
            "
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <section class="watchlog-panel rounded-[2rem] p-8 md:p-10">
        <div class="max-w-3xl space-y-4">
          <p class="text-xs uppercase tracking-[0.45em] text-[#c8ff6a]">{{ props.eyebrow }}</p>
          <h2 class="watchlog-serif text-4xl leading-tight font-semibold md:text-6xl">
            {{ props.title }}
          </h2>
          <p v-if="props.description" class="max-w-2xl text-sm leading-7 text-white/68 md:text-base">
            {{ props.description }}
          </p>
        </div>
      </section>

      <slot />
    </main>
  </div>
</template>
