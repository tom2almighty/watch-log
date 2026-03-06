import type { WatchStatus } from '../../shared/types/watchlog'

interface RecordQueryInput {
  status?: WatchStatus
  page?: number
  limit?: number
  subtype?: string
  year?: string
}

export function useWatchlogApi() {
  return {
    fetchStats() {
      return $fetch('/api/stats')
    },
    fetchRecords(query: RecordQueryInput) {
      return $fetch('/api/records', {
        params: query,
      })
    },
    fetchWidgetFeed(query: { status?: WatchStatus; limit?: number }) {
      return $fetch('/api/widget', {
        params: query,
      })
    },
    fetchRecordDetail(subjectId: string) {
      return $fetch(`/api/records/${encodeURIComponent(subjectId)}`)
    },
    fetchSyncStatus(token: string) {
      return $fetch('/api/admin/sync-status', {
        headers: {
          'x-admin-token': token,
        },
      })
    },
    runSync(token: string, statuses?: WatchStatus[]) {
      return $fetch('/api/admin/sync', {
        method: 'POST',
        headers: {
          'x-admin-token': token,
        },
        body: {
          statuses,
        },
      })
    },
  }
}
