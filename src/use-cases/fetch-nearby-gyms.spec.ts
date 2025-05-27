import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: 40.712776,
      longitude: -74.005974,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: 40.793752918006255,
      longitude: -73.94755692374527,
    })

    const { gyms } = await sut.execute({
      userLatitude: 40.712776,
      userLongitude: -74.005974,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Near Gym ${i}`,
        description: null,
        phone: null,
        latitude: 40.712776,
        longitude: -74.005974,
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: 40.712776,
      userLongitude: -74.005974,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 21' }),
      expect.objectContaining({ title: 'Near Gym 22' }),
    ])
  })
})
