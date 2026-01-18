import axios from "axios"
import { AppError } from "../middlewares/error.middleware"

export class OSMService {
  private readonly timeout = 15000 // 15 seconds

  async getNearby(lat: number, lon: number, radius = 2000) {
    // Validate input coordinates
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      throw new AppError("Invalid coordinates provided", 400)
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new AppError("Coordinates out of valid range", 400)
    }

    const query = `[out:json][timeout:10];(node["amenity"="restaurant"](around:${radius},${lat},${lon});way["amenity"="restaurant"](around:${radius},${lat},${lon}););out center;`

    console.log("OSM Query:", { lat, lon, radius, query })

    try {
      const res = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
          timeout: this.timeout,
          headers: {
            "Content-Type": "text/plain",
          },
        },
      )

      console.log("OSM Response:", {
        status: res.status,
        elementCount: res.data?.elements?.length || 0,
      })

      if (!res.data?.elements) {
        console.error("Invalid OSM response structure:", res.data)
        throw new AppError("Invalid response from location service", 502)
      }

      const places = res.data.elements.map((el: any) => ({
        name: el.tags?.name || el.tags?.["name:en"] || "Unnamed Restaurant",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        cuisine: el.tags?.cuisine,
      }))

      console.log(`Found ${places.length} restaurants`)

      if (places.length === 0) {
        throw new AppError(
          "No restaurants found in this area. Try increasing the radius.",
          404,
        )
      }

      return places
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      if (axios.isAxiosError(error)) {
        console.error("OSM API Error:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
        })

        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          throw new AppError("Location service timeout - please try again", 504)
        }

        if (error.response?.status === 429) {
          throw new AppError(
            "Location service rate limit exceeded - please try again later",
            429,
          )
        }

        if (error.response?.status === 400) {
          throw new AppError(
            "Invalid location query - please check coordinates",
            400,
          )
        }

        throw new AppError(
          `Failed to fetch nearby locations: ${error.message}`,
          502,
        )
      }

      console.error("Unexpected OSM error:", error)
      throw new AppError("Failed to fetch nearby locations", 502)
    }
  }
}
