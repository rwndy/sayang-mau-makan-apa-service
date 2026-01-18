import type { Request, Response } from "express"
import { AppError } from "../middlewares/error.middleware"
import { AIService } from "../services/ai.service"
import { HistoryService } from "../services/history.service"
import { OSMService } from "../services/osm.service"

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

    res.json(result)
  }

  async histories(req: Request, res: Response) {
    const history = new HistoryService()
    res.json(await history.list())
  }
}
