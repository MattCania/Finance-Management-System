import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { env } from "../lib/env.ts";

export default fp(async function jwtPlugin(fastify: FastifyInstance){
	fastify.register(jwt as FastifyPluginAsync<{ secret: string }>, {
		secret: env.JWT_SECRET.toString()
	})

	fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
		try {
			await request.jwtVerify()
		} catch (error) {
			console.error(error)
			reply.status(401).send({
    		  server_failure: "Unauthorized or expired session.",
    		  ok: false,
    		});
		}
	})

})