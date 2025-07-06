import Fastify from "fastify";
// import Redis from '@fastify/redis'
import cors from '@fastify/cors' 

import prismaPlugin from './plugins/prisma.ts'
import bcryptPlugin from './plugins/bcrypt.ts'
import jwtPlugin from './plugins/jwt.ts'

import accountsRoute from "./routes/accounts.ts";
import authRoute from './routes/authenticate.ts'
import walletRoute from "./routes/wallet.ts";

const fastify = Fastify({
	logger: false
})

fastify.register(cors, {
	methods: ['POST', 'GET', 'DELETE', 'PUT'],
	credentials: true,
	origin: true
})

// Caching (Havent setup redis-server yet)
// fastify.register(Redis, {
// 	host: '127.0.0.1',
// 	password: 'test_password',
// 	port: 6379,
// 	family: 4
// })

// Plugins
fastify.register(bcryptPlugin)
fastify.register(prismaPlugin)
fastify.register(jwtPlugin)

// Routes
fastify.register(accountsRoute, { prefix: '/account' })
fastify.register(authRoute, { prefix: '/auth' })
fastify.register(walletRoute, { prefix: '/wallet' })

export {fastify}