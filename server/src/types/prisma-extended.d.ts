import { Prisma, File } from '@prisma/client'

declare module '../lib/extendedPrisma' {
	interface ExtendedPrismaClient {
		file: {
			create: (args: Prisma.FileCreateArgs) => Promise<File>
		}
	}
}