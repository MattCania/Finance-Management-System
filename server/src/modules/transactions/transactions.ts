import { FastifyInstance } from "fastify";
// import { env } from "../lib/env";

export default async function transactionsRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/create",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            type: { type: "string" },
            ok: { type: "boolean" },
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
    handler: async function (request, reply) {
      const formData = request.body as {
        transaction_type: string;
        transaction_date: string;
        transaction_discount: boolean;
        discount_amount: number;
        transaction_tax: number;
        balance: number;
        transaction_amount: number;
      };

      const user = request.user;

      try {
        const remaining_balance =
          formData.balance - formData.transaction_amount;

        const transaction_response = await fastify.prisma.transactions.create({
          data: {
            transaction_type: formData.transaction_type,
            transaction_date: formData.transaction_date,
            transaction_discount: formData.transaction_discount,
            discount_amount: formData.discount_amount,
            transaction_tax: formData.transaction_tax,
            balance: formData.balance,
            transaction_amount: formData.transaction_amount,
            remaining_balance: remaining_balance,
            user_id: user.id,
          },
        });

        if (!transaction_response) {
          return reply
            .status(400)
            .send({ error: "Error Creating Transactions" });
        }

        return reply
          .status(200)
          .send({ success: "Transactions Created Successfully", ok: true });
      } catch (error) {
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });

  fastify.route({
    method: "GET",
    url: "/get_all",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            type: { type: "string" },
            ok: { type: "boolean" },
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
      try {
        const data = await fastify.prisma.transactions.findMany({
          where: {
            user_id: request.user.id,
          },
        });

        if (!data) {
          return reply
            .status(404)
            .send({ error: "No Data Found", type: "404 Not Found", ok: false });
        }

        return reply.status(200).send({
          success: "Fetched Transactions Successfully",
          ok: true,
          data: data,
        });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });

  fastify.route({
    method: "DELETE",
    url: "/delete_one",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            type: { type: "string" },
            ok: { type: "boolean" },
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
      const { transaction_id } = request.body as { transaction_id: string };
      try {
        const delete_response = await fastify.prisma.transactions.delete({
          where: { id: transaction_id },
        });

        if (!delete_response)
          return reply
            .status(400)
            .send({ error: "Failed Deleting Transactions" });

        return reply
          .status(200)
          .send({ success: "Succssfully Deleted Transaction", ok: true });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });
}
