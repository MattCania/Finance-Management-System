import 'dotenv/config'
import {string, z} from 'zod'

const envSchema = z.object({
	NODE_ENV: string(),
	SERVER_PORT: string().transform(Number).refine(val => !isNaN(val), {
		message: "DB_PORT must be a number"
	}),
	PRISMA_URL: string(),
	DATABASE_URL: string()
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
	console.error("Environmental Variables Parsing Failure", parsed.error.flatten().fieldErrors)
	process.exit(1)
}

export const env = parsed.data