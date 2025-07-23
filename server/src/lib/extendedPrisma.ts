import { PrismaClient } from '@prisma/client'
import fs from 'fs'

export class ExtendedPrismaClient extends PrismaClient {
  async uploadFileFromPath(filePath: string, name?: string) {
    const buffer = await fs.promises.readFile(filePath)
    return this.file.create({
      data: {
        name: name ?? filePath,
        data: buffer,
      },
    })
  }
}