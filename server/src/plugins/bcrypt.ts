import fp from "fastify-plugin";
import bcrypt from 'bcryptjs'
import {FastifyInstance} from "fastify";

export default fp (async function bcryptPlugin(fastify: FastifyInstance) {

	fastify.decorate("bcrypt", bcrypt)	
  
},
{
	name: 'bcrypt-plugin'
})