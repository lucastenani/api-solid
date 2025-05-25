import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Iron Strength Gym',
      description: 'Fully equipped gym with modern machines and group classes.',
      phone: '+1 (555) 123-4567',
      latitude: 40.712776,
      longitude: -74.005974,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
