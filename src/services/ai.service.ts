import { openai } from "../config/openai"

export class AIService {
  async recommend(category: string, places: any[]) {
    const prompt = `
Kamu AI rekomendasi makanan.

Kategori: ${category}

Data restoran:
${JSON.stringify(places)}

Pilih 5 terbaik berdasarkan:
- relevansi kategori
- jarak
- popularitas asumsi

FORMAT WAJIB JSON:

{
 "recommendations":[
   {
     "food": "",
     "place": "",
     "reason": ""
   }
 ]
}
`

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    return JSON.parse(res.choices[0].message.content ?? "")
  }
}
