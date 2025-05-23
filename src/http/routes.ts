import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate'
import { getUserProfile } from './controllers/getUserProfile'
import { register } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/user', getUserProfile)
}
