import { FastifyInstance } from "fastify";
import { profileService } from "./profile.services";

export default async function profileRoute(fastify: FastifyInstance) {
	const service = profileService(fastify)
	fastify.route({
		method: "POST",
		url: "/fetch_one",
		preValidation: [fastify.authenticate],
		handler: async function (request, reply) {
      		const user = request.user as { id: string; email: string };

			try {
				const profile = await service.getProfile(user.id)

				if (!profile) {
					reply.status(404).send({error: "No Profile Found", type: "Not Found", ok: false})
				}
			} catch (error) {
				reply.status(500).send({server_failure: error, ok: false})
			}
		}
	})
}