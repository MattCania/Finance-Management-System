import { PrismaClient } from '../../node_modules/@prisma/client/default'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())	