import { CheckIn } from 'generated/prisma'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface checkInUseCaseRequest {
  userId: string
  gymId: string
}

interface checkInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: checkInUseCaseRequest): Promise<checkInUseCaseResponse> {
    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error()
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
