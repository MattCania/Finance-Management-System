import { FastifyInstance } from "fastify";

async function authRoute (fastify: FastifyInstance){ 

	fastify.route({
		method: 'POST',
		url:'/login',
		schema: {
			body: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string" }
				}
			},
			response: {

			},
		},
		handler: async function (request, reply) {

		}
	})

}