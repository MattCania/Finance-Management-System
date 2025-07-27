import { FastifyInstance } from "fastify";

export function profileService (fastify: FastifyInstance) {

	return {
		getProfile: async function (id: string) {
			return fastify.prisma.profile.findUnique({
					where: {
						id: id
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
		}
	}

}