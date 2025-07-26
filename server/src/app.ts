import Fastify from "fastify";
// import Redis from '@fastify/redis'
import cors from '@fastify/cors' 
import compress from '@fastify/compress'

import prismaPlugin from './plugins/prisma.ts'
import bcryptPlugin from './plugins/bcrypt.ts'
import jwtPlugin from './plugins/jwt.ts'

import accountsRoute from "./modules/accounts/accounts.ts";
import authRoute from './modules/authentication/authenticate.ts'
import walletRoute from "./modules/wallet/wallet.ts";
import transactionsRoute from "./modules/transactions/transactions.ts";
import profileRoute from "./modules/profiles/profile.ts";

// Create fastify instance
const fastify = Fastify({
	logger: false
})

fastify.register(cors, {
	credentials: true,
	origin: 'http://localhost:5173',
	methods: ['POST', 'PUT', 'DELETE', 'GET']
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
/**
 * Register Plugins through fastify
 */
fastify.register(bcryptPlugin)
fastify.register(prismaPlugin)
fastify.register(jwtPlugin)

// Routes
/**
 * Default application of routes w/ prefix
 */
fastify.register(accountsRoute, { prefix: '/account' })
fastify.register(profileRoute, { prefix: '/profile' })
fastify.register(authRoute, { prefix: '/auth' })
fastify.register(walletRoute, { prefix: '/wallet' })
fastify.register(transactionsRoute, { prefix: '/transaction' })

// Export mutated fastify instance for server listening
export {fastify}