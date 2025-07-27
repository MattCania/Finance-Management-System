import { FastifyInstance } from "fastify";

export function authService(fastify:FastifyInstance) {

	return {
		getSession: async function (id: string) {
			return fastify.prisma.account.findFirst({
      		  where: { id: id},
      		  select: {
      		    id: true,
      		    email: true,
      		  },
      		});
		},
		getEmail: async function (email: string) {
			return fastify.prisma.account.findFirst({
        	  where: { email: email },
        	  select: {
        	    id: true,
        	    email: true,
        	    password: true,
        	  },
        	});
		}
	}

} 