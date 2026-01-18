import axios from "axios"

export class OSMService {
  async getNearby(lat: number, lon: number, radius = 2000) {
    const query = `
      [out:json];
      node["amenity"="restaurant"](around:${radius},${lat},${lon});
      out;
    `

    const res = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
    )

    return res.data.elements.map((el: any) => ({
      name: el.tags.name || "Unknown",
      lat: el.lat,
      lon: el.lon,
    }))
  }
}
