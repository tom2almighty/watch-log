<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
  }>(),
  {
    page: 1,
    totalPages: 1,
  },
)

const emit = defineEmits<{
  select: [page: number]
}>()

const visiblePages = computed<Array<number | 'ellipsis'>>(() => {
  const totalPages = Math.max(props.totalPages, 1)
  const page = Math.min(Math.max(props.page, 1), totalPages)

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sortedPages = Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right)

  const output: Array<number | 'ellipsis'> = []

  for (const [index, value] of sortedPages.entries()) {
    const previous = sortedPages[index - 1]

    if (typeof previous === 'number' && value - previous > 1) {
      output.push('ellipsis')
    }

    output.push(value)
  }

  return output
})

function selectPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) {
    return
  }

  emit('select', page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="watchlog-pagination watchlog-panel mt-6 flex flex-col gap-4 rounded-[1.4rem] p-4 md:flex-row md:items-center md:justify-between"
    aria-label="记录分页"
  >
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="watchlog-pill rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-45"
        :disabled="page <= 1"
        @click="selectPage(page - 1)"
      >
        上一页
      </button>

      <template v-for="(item, index) in visiblePages" :key="`${item}-${index}`">
        <button
          v-if="typeof item === 'number'"
          class="watchlog-pill rounded-full px-3.5 py-2 text-sm"
          :class="item === page ? 'watchlog-pill-active watchlog-pagination-current' : ''"
          :data-page="item"
          @click="selectPage(item)"
        >
          {{ item }}
        </button>
        <span v-else class="px-1 text-sm text-white/38">…</span>
      </template>

      <button
        class="watchlog-pill rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-45"
        :disabled="page >= totalPages"
        @click="selectPage(page + 1)"
      >
        下一页
      </button>
    </div>

    <p class="text-xs uppercase tracking-[0.24em] text-white/38">
      第 {{ page }} / {{ totalPages }} 页
    </p>
  </nav>
</template>
