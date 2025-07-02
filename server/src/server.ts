import { env } from "./libs/env.ts"
import { fastify } from "./app.ts"

fastify.get('/', () => {
  return { hello: 'world' }
})

await fastify.listen({port: env.SERVER_PORT})
	.then(() => console.log("Server Up!"))
	.catch((error) => console.error("Server Failed!", error))
