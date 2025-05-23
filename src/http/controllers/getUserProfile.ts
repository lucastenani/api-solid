import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserProfileBodySchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserProfileBodySchema.parse(request.body)

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const {
      id: userId,
      name,
      email,
    } = await getUserProfileUseCase.execute({ userId: id })

    return reply.status(200).send({
      id: userId,
      name,
      email,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
