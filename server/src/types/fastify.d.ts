import 'fastify';
import { PrismaClient } from '@prisma/client';
import type bcrypt from 'bcryptjs'

declare module 'fastify' {
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
}
