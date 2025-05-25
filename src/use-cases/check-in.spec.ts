import { Decimal } from 'generated/prisma/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Iron Strength Gym',
      description: 'Fully equipped gym with modern machines and group classes.',
      phone: '+1 (555) 123-4567',
      latitude: 40.712776,
      longitude: -74.005974,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to do a check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.712776,
      userLongitude: -74.005974,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.712776,
      userLongitude: -74.005974,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 40.712776,
        userLongitude: -74.005974,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to do a check in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.712776,
      userLongitude: -74.005974,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.712776,
      userLongitude: -74.005974,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'React Gym',
      description: '',
      phone: '',
      latitude: new Decimal(40.712776),
      longitude: new Decimal(-74.005974),
    })

    expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 40.711282601375814,

        userLongitude: -74.00877802597236,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
