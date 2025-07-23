import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

export default fp(async function prismaPlugin(fastify: FastifyInstance) {
	const prisma = new PrismaClient()
		
	fastify.decorate('prisma', prisma)
		
	fastify.addHook('onClose', async () => {
		await prisma.$disconnect()
	})
})