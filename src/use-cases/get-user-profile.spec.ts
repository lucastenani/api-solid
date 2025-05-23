import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('1234567', 6),
    })

    const { id, email } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(id).toEqual(createdUser.id)
    expect(email).toEqual('johndoe@example.com')
  })

  it('should not be able to get user profile with wrong ID', async () => {
    expect(() =>
      getUserProfileUseCase.execute({
        userId: 'wrongId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
