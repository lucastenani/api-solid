import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('should hash user password upon registration', async () => {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    })

    const isPasswordCorrectlyHashed = await compare(
      '1234567',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
