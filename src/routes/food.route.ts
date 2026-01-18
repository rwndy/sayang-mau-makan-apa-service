import { Router } from "express"
import { FoodController } from "../controllers/food.controller"
import { asyncHandler } from "../middlewares/error.middleware"
import { recommendSchema, validate } from "../middlewares/validate.middleware"

const router = Router()
const controller = new FoodController()

router.post(
  "/recommend",
  validate(recommendSchema),
  asyncHandler(controller.recommend),
)

router.get("/histories", asyncHandler(controller.histories))

export default router
