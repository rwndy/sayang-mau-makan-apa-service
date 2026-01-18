import { Router } from "express"
import { FoodController } from "../controllers/food.controller"

const router = Router()
const food = new FoodController()

router.post("/recommend", food.recommend.bind(food))

export default router
