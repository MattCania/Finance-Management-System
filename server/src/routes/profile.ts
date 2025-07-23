import { FastifyInstance } from "fastify";

export default async function profileRoute(fastify: FastifyInstance) {
	fastify.route({
		method: "POST",
		url: "/fetch_one",
		schema: {

		},
		preValidation: [fastify.authenticate],
		handler: async function (request, reply) {
      		const user = request.user as { id: string; email: string };

			try {
				const profile = await fastify.prisma.profile.findUnique({
					where: {
						id: user.id
					},
					select: {
						age: true,
						address: true,
						birthday: true,
						country: true,
						firstname: true,
						middlename: true,
						lastname: true,
					},
				})

				if (!profile) {
					reply.status(404).send({error: "No Profile Found", type: "Not Found", ok: false})
				}
			} catch (error) {
				reply.status(500).send({server_failure: error, ok: false})
			}
		}
	})
}