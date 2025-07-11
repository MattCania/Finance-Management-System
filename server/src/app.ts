import Fastify from "fastify";
// import Redis from '@fastify/redis'
import cors from '@fastify/cors' 
import compress from '@fastify/compress'

import prismaPlugin from './plugins/prisma.ts'
import bcryptPlugin from './plugins/bcrypt.ts'
import jwtPlugin from './plugins/jwt.ts'

import accountsRoute from "./routes/accounts.ts";
import authRoute from './routes/authenticate.ts'
import walletRoute from "./routes/wallet.ts";
import transactionsRoute from "./routes/transactions.ts";

const fastify = Fastify({
	logger: false
})

fastify.register(cors, {
	methods: ['POST', 'GET', 'DELETE', 'PUT'],
	credentials: true,
	origin: true
})

fastify.register(compress, {
	global: true,
	threshold: 1024,
	encodings: ["br", "gzip"],
	customTypes: /^text\/|\+json$/,
	zlib: true,
	zlibOptions: {
		level: 6
	},
	onUnsupportedEncoding: (encoding, request, reply) => {
      reply.code(406)
      return 'We do not support the ' + encoding + ' encoding.'
    }
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
fastify.register(transactionsRoute, { prefix: '/transaction' })

export {fastify}