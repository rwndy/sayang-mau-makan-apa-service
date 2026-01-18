import request from "supertest"
import app from "../src/app"

describe("POST /api/v1/food/recommend", () => {
  it("should return recommendations in general mode", async () => {
    const res = await request(app)
      .post("/api/v1/food/recommend")
      .send({
        category: "pedas",
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.recommendations).toBeDefined()
    expect(Array.isArray(res.body.data.recommendations)).toBe(true)
    expect(res.body.data.recommendations.length).toBeGreaterThan(0)
  })

  it("should return recommendations in nearMe mode", async () => {
    const res = await request(app)
      .post("/api/v1/food/recommend")
      .send({
        category: "pedas",
        mode: "nearMe",
        lat: -6.2,
        lon: 106.8,
        radius: 2000,
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.recommendations).toBeDefined()
    expect(Array.isArray(res.body.data.recommendations)).toBe(true)
    expect(res.body.data.recommendations.length).toBeGreaterThan(0)
  })

  it("should fail when nearMe mode is used without lat/lon", async () => {
    const res = await request(app)
      .post("/api/v1/food/recommend")
      .send({
        category: "pedas",
        mode: "nearMe",
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})
