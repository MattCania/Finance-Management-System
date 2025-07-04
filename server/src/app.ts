import Fastify from "fastify";
import cors from '@fastify/cors' 
import prismaPlugin from './plugins/prisma'
import accountsRoute from "./routes/accounts.ts";

const fastify = Fastify({
	logger: false
})

fastify.register(cors, {
	methods: ['POST', 'GET', 'DELETE', 'PUT']
})

fastify.register(prismaPlugin)
fastify.register(accountsRoute, {prefix: '/account'})

export {fastify}