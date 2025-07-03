import { FastifyInstance } from "fastify";
import { prisma } from "../lib/database.ts";
import bcrypt from "bcryptjs";
import { calculate_age } from "../utils/helpers.ts";

export default async function accountsRoute(fastify: FastifyInstance) {
  // Create an account
  fastify.route({
    method: "POST",
    url: "/create",
    schema: {
      body: {
        type: "object",
        required: ["email", "password", "firstname", "middlename", "lastname", "birthday"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
          firstname: { type: "string" },
          middlename: { type: "string" },
          lastname: { type: "string" },
          birthday: { type: 'string', format: 'date-time'},
          address: { type: 'string' },
          country: { type: 'string' },
          timezone: {type: 'string', format: 'time'},
          currency: { type: 'string' },
          initial_deposit: { type: 'number' },
          income_period: { type: 'string' },
          income_amount: { type: 'number' },
        },
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
        const formData = request.body as 
          { email: string,
            password: string,
            firstname: string,
            middlename: string,
            lastname: string,
            birthday: string,
            address: string,
            country: string,
            timezone: string,
            currency: string,
            initial_deposit: number,
            income_amount: number,
            income_period: string,
          };
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(formData.password, salt);

        if (!password) throw new Error("Error Account Creation");

        const account_response = await prisma.account.create({
          data: {
            email: formData.email,
            password: password,
          },
        });

        if (!account_response) throw new Error("Error Account Creation");

        const age = await calculate_age(formData.birthday)
        const profile_response = await prisma.profile.create({
          data: {
            firstname: formData.firstname,
            middlename: formData.middlename || '',
            lastname: formData.lastname,
            birthday: new Date(formData.birthday),
            age: age,
            address: formData.address,
            country: formData.country,
            timezone: formData.timezone,
            user_id: account_response.id
          }
        })

        if (!profile_response) {
            await prisma.account.delete({where: {id: account_response.id}})
            throw new Error ("Error Account Creation")  
        }

        const wallet_response = await prisma.wallet.create({
          data: {
            currency: formData.currency,
            initial_deposit: formData.initial_deposit,
            income_amount: formData.income_amount,
            income_period: formData.income_period,
            user_id: account_response.id  
          }
        })

        if (!wallet_response) {
            await prisma.profile.delete({where: {user_id: account_response.id}})
            await prisma.account.delete({where: {id: account_response.id}})
            throw new Error ("Error Account Creation")  
        }

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

        const response = await prisma.account.findUnique({
          where: {
            id: id,
          },
        });

        if (!response) throw new Error("Error Account Fetching");

        const accountData = {
          id: response.id,
          email: response.email,
          createdAt: response.created_at,
        };

        reply.status(200).send({
          success: "Account Fetched Successfuly",
          ok: true,
          data: accountData,
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
