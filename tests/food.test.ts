import request from "supertest"
import app from "../src/app"

describe("POST /food/recommend", () => {
  it("should return recommendations", async () => {
    const res = await request(app)
      .post("/food/recommend")
      .send({
        lat: -6.2,
        lon: 106.8,
        category: "pedas"
      })

    expect(res.status).toBe(200)
    expect(res.body.recommendations).toBeDefined()
  })
})
