import { AccountSchema, FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { calculate_age, validate_account } from "../../utils/helpers.ts";
import {
  AccountProperties,
} from "../../interface/objects.ts";
import { accountsService } from "./accounts.services.ts";

export default async function accountsRoute(fastify: FastifyInstance) {
  const service = accountsService(fastify)
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
                birthday: formData.birthday,
                age: age,
                address: formData.address,
                country: formData.country,
              },
            },
            Wallet: {
              create: {
                currency: formData.currency,
                balance: formData.balance,
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

        const data = await service.findAccount(id)

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

  // Fetch full account (Account, Profile, Wallet)
  fastify.route({
  method: "GET",
  url: "/fetch_profile",
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
            required: ["id", "email", "Profile", "Wallet"],
            properties: {
              id: { type: "string", format: "uuid" },
              email: { type: "string", format: "email" },
              Profile: {
                type: "object",
                required: ["firstname", "lastname", "middlename", "age", "birthday", "address", "country"],
                properties: {
                  firstname: { type: "string" },
                  lastname: { type: "string" },
                  middlename: { type: "string" },
                  age: { type: "integer" },
                  birthday: { type: "string", format: "date" },
                  address: { type: "string" },
                  country: { type: "string" },
                },
              },
              Wallet: {
                type: "object",
                required: ["balance", "currency", "income_amount", "income_period"],
                properties: {
                  balance: { type: "number" },
                  currency: { type: "string" },
                  income_amount: { type: "number" },
                  income_period: { type: "string" },
                },
              },
            },
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

      const data = await service.findProfile(id)

      if (!data) throw new Error("Error Account Fetching");

      reply.status(200).send({
        success: "Account Fetched Successfuly",
        ok: true,
        data: data,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ server_failure: error, ok: false });
    }
  },
});

  // Delete and Account (Development Only), TODO!!
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
