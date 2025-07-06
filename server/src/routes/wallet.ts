import { FastifyInstance } from "fastify";

export default async function walletRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/fetch",
    schema: {
      response: {
        200: {
          type: "object",
          required: ["success", "ok", "data"],
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              required: [
                "currency",
                "income_amount",
                "income_period",
                "balance",
              ],
              properties: {
                currency: { type: "string" },
                income_amount: { type: "string" },
                income_period: { type: "string" },
                balance: { type: "string" },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            type: { type: "string" },
            ok: false,
          },
        },
        500: {
          type: "object",
          properties: {
            server_failure: { type: "string" },
            ok: { type: "boolean" },
          },
        },
      },
    },
    preValidation: [fastify.authenticate],
    handler: async function (request, reply) {
      console.log("Fetching Wallet");
      const { id } = request.user;

      if (!id)
        return reply
          .status(403)
          .send({
            error: "Session Failed",
            type: "Forbidden Access! Please Login",
            ok: false,
          });

      try {
        const wallet_response = await fastify.prisma.wallet.findFirst({
          where: { user_id: id },
          select: {
            currency: true,
            balance: true,
            income_period: true,
            income_amount: true,
          },
        });

        if (!wallet_response)
          return reply
            .status(404)
            .send({
              error: "Error Fetching User Wallet",
              type: "Wallet Not Found",
              ok: false,
            });
            
        return reply
          .status(200)
          .send({
            success: "Wallet Fetched Successfully",
            ok: true,
            data: wallet_response,
          });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });
}
