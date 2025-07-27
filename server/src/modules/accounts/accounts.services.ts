import { FastifyInstance } from "fastify";


export function accountsService (fastify: FastifyInstance) {
	
	return {
    findAccount: async function (id: string) {
      return fastify.prisma.account.findUnique({
          where: {
            id: id,
          },
          select: {
            id: true,
            email: true,
            created_at: true,
          },
        });
    },
    findProfile: async function (id: string) {
      return fastify.prisma.account.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          Profile: {
            select: {
              firstname: true,
              lastname: true,
              middlename: true,
              age: true,
              birthday: true,
              address: true,
              country: true,
            }
          },
          Wallet: {
            select: {
              balance: true,
              currency: true,
              income_amount: true,
              income_period: true,
            }
          }
        },
      });
    }
  }
}