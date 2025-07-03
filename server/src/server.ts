import { env } from "./lib/env.ts"
import { fastify } from "./app.ts"
import {prisma} from "./lib/database.ts"



fastify.get('/', async (request, reply) => {
	try {
		reply.send({message: "Hello"})
	} catch (error) {
		reply.send({error})
	}
})

try {
	await fastify.listen({ port: env.SERVER_PORT })
	console.log("Server Up!")
} catch (err) {
	console.error("Server Failed!", err)
	process.exit(1)
}
