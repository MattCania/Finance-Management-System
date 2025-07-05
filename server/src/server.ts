import { env } from "./lib/env.ts"
import { fastify } from "./app.ts"

fastify.get('/', async (request, reply) => {
	return ({message: "Hello"})
})

try {
	await fastify.listen({ port: env.SERVER_PORT })
	console.log("Server Up!")
} catch (err) {
	console.error("Server Failed!", err)
	process.exit(1)
}
