import { hash } from 'bcryptjs'
import { User } from 'generated/prisma'

import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExitsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExitsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
