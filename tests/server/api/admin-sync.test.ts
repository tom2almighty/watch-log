import { describe, expect, it, vi } from 'vitest'

import { getAdminSyncStatus } from '../../../server/api/admin/sync-status.get'
import { executeAdminSync } from '../../../server/api/admin/sync.post'

describe('admin sync api helpers', () => {
  it('rejects requests with an invalid admin token', async () => {
    const syncService = {
      runSync: vi.fn(),
      getSyncStatus: vi.fn(),
    }

    await expect(
      executeAdminSync(
        {
          statuses: ['done'],
        },
        {
          providedToken: 'bad-token',
          adminToken: 'secret-token',
          syncService,
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
    })
  })

  it('returns sync status for authorized requests', async () => {
    const syncService = {
      runSync: vi.fn(),
      getSyncStatus: vi.fn().mockReturnValue({
        latestRun: {
          status: 'success',
          finishedAt: '2026-03-06T09:00:00.000Z',
        },
        cursors: [
          {
            source: 'douban',
            status: 'done',
            nextStart: 1,
          },
        ],
      }),
    }

    const status = await getAdminSyncStatus({
      providedToken: 'secret-token',
      adminToken: 'secret-token',
      syncService,
    })

    expect(status).toMatchObject({
      latestRun: {
        status: 'success',
      },
      cursors: [
        {
          status: 'done',
          nextStart: 1,
        },
      ],
    })
  })
})
