import { prisma } from "../config/prisma"

export class HistoryService {
  async save(payload: {
    lat: number
    lon: number
    category: string
    result: any
  }) {
    return prisma.recommendationHistory.create({
      data: payload,
    })
  }

  async list() {
    return prisma.recommendationHistory.findMany({
      orderBy: { createdAt: "desc" },
    })
  }
}
