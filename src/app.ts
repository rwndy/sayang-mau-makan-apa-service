import express from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerDocument } from "./docs/swagger"
import { errorMiddleware } from "./middlewares/error.middleware"
import { timeoutMiddleware } from "./middlewares/timeout.middleware"
import foodRoute from "./routes/food.route"

const app = express()

app.use(express.json())
app.use(timeoutMiddleware(50000)) // 50 seconds global timeout

app.use("/food", foodRoute)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorMiddleware)

export default app
