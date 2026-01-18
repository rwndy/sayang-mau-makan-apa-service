import express from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerDocument } from "./docs/swagger"
import { errorMiddleware } from "./middlewares/error.middleware"
import foodRoute from "./routes/food.route"

const app = express()

app.use(express.json())

app.use("/food", foodRoute)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorMiddleware)

export default app
