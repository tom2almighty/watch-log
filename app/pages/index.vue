<script setup lang="ts">
import AppShell from '~/components/app/AppShell.vue'
</script>

<template>
  <AppShell title="欢迎来到观迹" description="主应用将承载观影记录浏览、统计摘要与同步入口。">
    <section class="grid gap-4 md:grid-cols-2">
      <article class="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 class="text-lg font-medium">项目方向</h3>
        <p class="mt-3 text-sm leading-6 text-neutral-300">
          使用 Nuxt 4 构建单页应用，后端同步豆瓣观影记录并落库到 SQLite。
        </p>
      </article>
      <article class="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
        <h3 class="text-lg font-medium">接下来</h3>
        <p class="mt-3 text-sm leading-6 text-neutral-200">
          下一阶段将补齐数据模型、同步链路、图片代理和可嵌入 Widget。
        </p>
      </article>
    </section>
  </AppShell>
</template>
