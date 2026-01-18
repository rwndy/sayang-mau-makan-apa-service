import type { Request, Response } from "express"
import { AppError } from "../middlewares/error.middleware"
import { AIService } from "../services/ai.service"
import { HistoryService } from "../services/history.service"
import { OSMService } from "../services/osm.service"
import { successResponse } from "../utils/response.util"

export class FoodController {
  async recommend(req: Request, res: Response) {
    const { category, mode, lat, lon, radius } = req.body

    const ai = new AIService()
    const history = new HistoryService()

    let result: any

    // Near Me mode: use location-based recommendations
    if (mode === "nearMe") {
      if (!lat || !lon) {
        throw new AppError("Location required for nearMe mode")
      }

      const osm = new OSMService()
      const places = await osm.getNearby(lat, lon, radius)
      result = await ai.recommendNearMe(category, places)

      // Save to history with location
      await history.save({
        lat,
        lon,
        category,
        result,
      })
    } else {
      // General mode: generate food recommendations without location
      result = await ai.recommendGeneral(category)

      // Save to history without location
      await history.save({
        lat: null,
        lon: null,
        category,
        result,
      })
    }

    return successResponse(res, result)
  }

  async histories(req: Request, res: Response) {
    const history = new HistoryService()
    const data = await history.list()
    return successResponse(res, data)
  }
}
