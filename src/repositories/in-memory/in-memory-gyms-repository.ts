import { randomUUID } from 'crypto'
import { Gym, Prisma } from 'generated/prisma'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    return gym || null
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({
    latitude,
    longitude,
    page,
  }: FindManyNearbyParams): Promise<Gym[]> {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )

        console.log(distance)

        return distance < 10
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
