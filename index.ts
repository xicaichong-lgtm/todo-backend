import 'dotenv/config'
import Fastify from 'fastify'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import bcrypt from 'bcryptjs'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const fastify = Fastify({ logger: true })

fastify.register(jwt, { secret: process.env.JWT_SECRET as string })
fastify.register(cors, { origin: 'http://localhost:3001', methods: ['GET', 'POST', 'PATCH', 'DELETE'] })

const authenticate = async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}

fastify.get('/todos', { preHandler: authenticate }, async (request) => {
  const { id } = request.user as { id: number }
  return prisma.todo.findMany({ where: { userId: id } })
})

fastify.post('/todos', { preHandler: authenticate }, async (request, reply) => {
  const { id } = request.user as { id: number }
  const { title } = request.body as { title: string }
  const todo = await prisma.todo.create({ data: { title, userId: id } })
  reply.code(201)
  return todo
})

fastify.delete('/todos/:id', { preHandler: authenticate }, async (request, reply) => {
  const user = request.user as { id: number }
  const { id } = request.params as { id: string }

  const result = await prisma.todo.deleteMany({
    where: { id: Number(id), userId: user.id }
  })

  if (result.count === 0) {
    reply.code(404)
    return { message: 'Todo not found' }
  }
  return { message: 'Deleted' }
})

fastify.patch('/todos/:id', { preHandler: authenticate }, async (request, reply) => {
  const user = request.user as { id: number }
  const { id } = request.params as { id: string }
  const { done } = request.body as { done: boolean }

  const result = await prisma.todo.updateMany({
    where: { id: Number(id), userId: user.id },
    data: { done }
  })

  if (result.count === 0) {
    reply.code(404)
    return { message: 'Todo not found' }
  }
  return prisma.todo.findUnique({ where: { id: Number(id) } })
})

fastify.post('/auth/register', async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    reply.code(409)
    return { message: 'Email already registered' }
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hashed } })

  reply.code(201)
  return { id: user.id, email: user.email }
})

fastify.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    reply.code(401)
    return { message: 'Invalid email or password' }
  }

  const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '30d' })
  return { token }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})