// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HomeOverview from '../../../app/components/home/HomeOverview.vue'
import RecordGrid from '../../../app/components/records/RecordGrid.vue'
import RecordPagination from '../../../app/components/records/RecordPagination.vue'

describe('watchlog ui smoke', () => {
  it('renders the home overview hero copy', () => {
    const wrapper = mount(HomeOverview, {
      props: {
        totalLogs: 128,
        totalSubjects: 96,
        countsByStatus: {
          done: 72,
          doing: 8,
          mark: 48,
        },
      },
    })

    expect(wrapper.text()).toContain('观迹')
    expect(wrapper.text()).toContain('128')
  })

  it('renders responsive record cards, external link button, and empty state', () => {
    const populated = mount(RecordGrid, {
      props: {
        items: [
          {
            logId: 'douban:interest:1',
            source: 'douban',
            subjectId: 'douban:subject:1',
            title: '首尔之春',
            year: '2023',
            subtype: 'movie',
            coverUrl: 'https://img2.doubanio.com/example.jpg',
            sourceUrl: 'https://movie.douban.com/subject/35712804/',
            status: 'done',
            rating: 4,
            watchedAt: '2026-01-28 19:51:19',
          },
        ],
      },
    })

    const empty = mount(RecordGrid, {
      props: {
        items: [],
      },
    })

    expect(populated.text()).toContain('首尔之春')
    expect(populated.text()).toContain('查看原条目')
    expect(populated.get('a[href="https://movie.douban.com/subject/35712804/"]').attributes('target')).toBe('_blank')
    expect(populated.find('.watchlog-record-grid-compact').exists()).toBe(true)
    expect(populated.find('.watchlog-record-grid-responsive').exists()).toBe(true)
    expect(populated.find('.watchlog-record-grid-responsive').classes()).toContain('grid-cols-2')
    expect(populated.find('.watchlog-record-card-compact').exists()).toBe(true)
    expect(empty.text()).toContain('还没有可展示的记录')
  })

  it('renders pagination controls and emits page changes', async () => {
    const wrapper = mount(RecordPagination, {
      props: {
        page: 3,
        totalPages: 8,
      },
    })

    expect(wrapper.find('.watchlog-pagination').exists()).toBe(true)
    expect(wrapper.text()).toContain('上一页')
    expect(wrapper.text()).toContain('下一页')
    expect(wrapper.text()).toContain('3')

    await wrapper.get('[data-page="4"]').trigger('click')

    expect(wrapper.emitted('select')).toEqual([[4]])
  })
})
