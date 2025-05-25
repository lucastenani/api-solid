import { Decimal } from 'generated/prisma/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(37.42219885095506),
      longitude: new Decimal(-122.08508817896211),
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
      userLatitude: 37.42219885095506,
      userLongitude: -122.08508817896211,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 37.42219885095506,
      userLongitude: -122.08508817896211,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 37.42219885095506,
        userLongitude: -122.08508817896211,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to do a check in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 37.42219885095506,
      userLongitude: -122.08508817896211,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 37.42219885095506,
      userLongitude: -122.08508817896211,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'React Gym',
      description: '',
      phone: '',
      latitude: new Decimal(37.42219885095506),
      longitude: new Decimal(-122.08508817896211),
    })

    expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 37.4074606,
        userLongitude: -122.0866141,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
