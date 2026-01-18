import type { Prisma } from "@prisma/client"
import { prisma } from "../config/prisma"

export class HistoryService {
  async save(payload: {
    lat: number | null
    lon: number | null
    category: string
    result: any
  }) {
    const data = {
      category: payload.category,
      result: payload.result as Prisma.InputJsonValue,
      ...(payload.lat !== null && { lat: payload.lat }),
      ...(payload.lon !== null && { lon: payload.lon }),
    }

    return prisma.recommendationHistory.create({ data })
  }

  async list() {
    return prisma.recommendationHistory.findMany({
      orderBy: { createdAt: "desc" },
    })
  }
}
