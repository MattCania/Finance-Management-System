import { env } from "./lib/env.ts"
import { fastify } from "./app.ts"

fastify.get('/', async () => {
	return ({message: "Hello"})
})

fastify.route({
  method: "POST",
  url: "/logout",
  handler: async function (request, reply) {
    reply.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    });

    reply.send({
      success: "Logged out successfully",
      ok: true,
    });
  },
});


try {
	await fastify.listen({ port: env.SERVER_PORT })
	console.log("Server Up!", {port: env.SERVER_PORT})
} catch (err) {
	console.error("Server Failed!", err)
	process.exit(1)
}
