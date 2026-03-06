import { describe, expect, it } from 'vitest'

import { ALIGNED_RECORD_GRID_LIMIT } from '../../app/constants/record-grid'

describe('record grid config', () => {
  it('uses a count that fills 2, 3, and 4-column rows', () => {
    expect(ALIGNED_RECORD_GRID_LIMIT).toBe(12)
    expect(ALIGNED_RECORD_GRID_LIMIT % 2).toBe(0)
    expect(ALIGNED_RECORD_GRID_LIMIT % 3).toBe(0)
    expect(ALIGNED_RECORD_GRID_LIMIT % 4).toBe(0)
  })
})
