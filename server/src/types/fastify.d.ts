import "fastify";
import { PrismaClient } from "@prisma/client";
import type bcrypt from "bcryptjs";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    bcrypt: typeof bcrypt;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;

    // redis: Redis;
  }
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    };
  }

  interface FastifyReply {
    setCookie: (
      name: string,
      value: string,
      options?: import("@fastify/cookie").CookieSerializeOptions
    ) => FastifyReply;

    clearCookie: (
      name: string,
      options?: import("@fastify/cookie").CookieSerializeOptions
    ) => FastifyReply;
  }

  interface AccountSchema {
    email: string;
    password: string;
    firstname: string;
    middlename: string;
    lastname: string;
    birthday: string;
    address: string;
    country: string;
    timezone: string;
    currency: string;
    initial_deposit: number;
    income_amount: number;
    income_period: string;
  }
}