import { Prisma, User } from 'generated/prisma'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    return user || null
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      created_at: new Date(),
      password_hash: data.password_hash,
    }

    this.items.push(user)

    return user
  }
}
