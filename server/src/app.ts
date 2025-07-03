import Fastify from "fastify";
import cors from '@fastify/cors' 
import accountsRoute from "./routes/accounts.ts";

const fastify = Fastify({
	logger: false
})

fastify.register(cors, {
	methods: ['POST', 'GET', 'DELETE', 'PUT']
})

fastify.register(accountsRoute, {prefix: '/account'})

export {fastify}