import winston from 'winston'
import { env } from './env.ts'

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.File({filename: 'error.log', level: 'error'}),
		new winston.transports.File({filename: 'info.logs', level: 'info'})
	]
})

if (env.NODE_ENV !== 'production') {
	winston.add(new winston.transports.Console({
		format: winston.format.simple()
	}))
}