import { AccountSchema, FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { calculate_age, validate_account } from "../utils/helpers.ts";
import {
  AccountProperties,
} from "../data/objects.ts";

export default async function accountsRoute(fastify: FastifyInstance) {
  // Create an account
  fastify.route({
    method: "POST",
    url: "/create",
    schema: {
      body: {
        type: "object",
        required: [
          "email",
          "password",
          "firstname",
          "middlename",
          "lastname",
          "birthday",
        ],
        properties: AccountProperties,
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
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
      console.log("Creating Account");
      const formData = request.body as AccountSchema;

      try {
        const isValid = await validate_account(formData);

        if (!isValid.parsed)
          return reply
            .status(409)
            .send({
              error: "Invalid Input Types",
              type: "Conflicting Field Types",
              ok: false,
            });
        if (isValid.errors.length > 0)
          return reply
            .status(401)
            .send({
              error: isValid.errors,
              type: "Unauthorized Request due to Input Field Mismatch",
              ok: false,
            });

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(formData.password, salt);

        if (!password) throw new Error("Error Account Creation");

        const age = await calculate_age(formData.birthday);

        const account_response = await fastify.prisma.account.create({
          data: {
            email: formData.email,
            password: password,
            Profile: {
              create: {
                firstname: formData.firstname,
                middlename: formData.middlename || "",
                lastname: formData.lastname,
                birthday: new Date(formData.birthday),
                age: age,
                address: formData.address,
                country: formData.country,
                timezone: formData.timezone,
              },
            },
            Wallet: {
              create: {
                currency: formData.currency,
                balance: formData.initial_deposit,
                income_amount: formData.income_amount,
                income_period: formData.income_period,
              },
            },
          },
        });

        if (!account_response) throw new Error("Error Account Creation");

        reply
          .status(200)
          .send({ success: "Account Created Successfuly", ok: true });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });

  // Fetch an Account
  fastify.route({
    method: "GET",
    url: "/fetch_one",
    schema: {
      querystring: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", format: "uuid" },
        },
      },
      response: {
        200: {
          type: "object",
          required: ["success", "ok", "data"],
          properties: {
            success: { type: "string" },
            ok: { type: "boolean" },
            data: {
              type: "object",
              required: ["id", "email", "createdAt"],
              properties: {
                id: { type: "string", format: "uuid" },
                email: { type: "string", format: "email" },
                createdAt: { type: "string", format: "date-time" },
              }
            },
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
      try {
        const { id } = request.query as { id: string };

        const data = await fastify.prisma.account.findUnique({
          where: {
            id: id,
          },
          select: {
            id: true,
            email: true,
            created_at: true,
          },
        });

        if (!data) throw new Error("Error Account Fetching");

        reply.status(200).send({
          success: "Account Fetched Successfuly",
          ok: true,
          // data: data,
        });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });

  // Delete and Account (Development Only)
  fastify.route({
    method: "DELETE",
    url: "/delete_one",
    schema: {
      body: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", format: "uuid" } },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "string" },
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
      try {
        reply
          .status(200)
          .send({ success: "Account Fetched Successfuly", ok: true });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ server_failure: error, ok: false });
      }
    },
  });
}
