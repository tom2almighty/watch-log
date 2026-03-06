// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HomeOverview from '../../../app/components/home/HomeOverview.vue'
import RecordGrid from '../../../app/components/records/RecordGrid.vue'

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

  it('renders record cards and empty state', () => {
    const populated = mount(RecordGrid, {
      props: {
        items: [
          {
            logId: 'douban:interest:1',
            subjectId: 'douban:subject:1',
            title: '首尔之春',
            year: '2023',
            subtype: 'movie',
            coverUrl: 'https://img2.doubanio.com/example.jpg',
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
    expect(populated.find('.watchlog-record-grid-compact').exists()).toBe(true)
    expect(populated.find('.watchlog-record-card-compact').exists()).toBe(true)
    expect(empty.text()).toContain('还没有可展示的记录')
  })
})
