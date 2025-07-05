import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { env } from "../lib/env.ts";

export default fp(async function jwtPlugin(fastify: FastifyInstance) {
  fastify.register(cookie);

  fastify.register(
    jwt as FastifyPluginAsync<{
      secret: string;
      cookie: { cookieName: string; signed: boolean };
    }>,
    {
      secret: env.JWT_SECRET as string,
      cookie: {
        cookieName: "token",
        signed: false,
      },
    }
  );

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error) {
        console.error(error);
        reply.status(401).send({
          server_failure: "Unauthorized or expired session.",
          ok: false,
        });
      }
    }
  );
});
