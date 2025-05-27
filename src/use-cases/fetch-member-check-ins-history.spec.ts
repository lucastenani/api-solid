import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInHistoryUseCase } from './fetch-member-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let fetchUserCheckInHistoryUseCase: FetchUserCheckInHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchUserCheckInHistoryUseCase = new FetchUserCheckInHistoryUseCase(
      checkInsRepository,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch check in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })
})
