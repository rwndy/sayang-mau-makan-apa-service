import type { Request, Response } from "express"
import { AppError } from "../middlewares/error.middleware"
import { AIService } from "../services/ai.service"
import { HistoryService } from "../services/history.service"
import { OSMService } from "../services/osm.service"
import { successResponse } from "../utils/response.util"

export class FoodController {
  async recommend(req: Request, res: Response) {
    const { lat, lon, category, radius } = req.body

    if (!lat || !lon) {
      throw new AppError("Location required")
    }

    const osm = new OSMService()
    const ai = new AIService()
    const history = new HistoryService()

    const places = await osm.getNearby(lat, lon, radius)

    const result = await ai.recommend(category, places)

    await history.save({
      lat,
      lon,
      category,
      result,
    })

    return successResponse(res, result)
  }

  async histories(req: Request, res: Response) {
    const history = new HistoryService()
    const data = await history.list()
    return successResponse(res, data)
  }
}
