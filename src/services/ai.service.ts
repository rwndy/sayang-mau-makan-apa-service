import { openai } from "../config/openai"
import { AppError } from "../middlewares/error.middleware"

export class AIService {
  async recommend(category: string, places: any[]) {
    if (!places || places.length === 0) {
      throw new AppError("No restaurants found in this area", 404)
    }

    const prompt = `You are a food recommendation AI. Analyze the restaurants and return ONLY a JSON object.

Category preference: ${category}
Restaurants data: ${JSON.stringify(places.slice(0, 50))}

Select the top 5 best restaurants based on:
- Category relevance
- Distance from user
- Assumed popularity

Return ONLY this JSON structure (no markdown, no explanation):
{
  "recommendations": [
    {
      "food": "recommended dish name",
      "place": "restaurant name",
      "reason": "brief reason for recommendation"
    }
  ]
}`

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      })

      const content = res.choices[0]?.message?.content
      if (!content) {
        throw new AppError("AI service returned empty response", 502)
      }

      // Extract JSON from markdown code blocks if present
      let jsonContent = content.trim()

      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      const codeBlockMatch = jsonContent.match(
        /```(?:json)?\s*\n?([\s\S]*?)\n?```/,
      )
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1].trim()
      }

      try {
        const parsed = JSON.parse(jsonContent)
        if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
          throw new AppError("Invalid recommendation format from AI", 502)
        }
        return parsed
      } catch (parseError) {
        console.error("Failed to parse AI response:", {
          raw: content,
          cleaned: jsonContent,
          error:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
        })
        throw new AppError("AI service returned invalid format", 502)
      }
    } catch (error: any) {
      // Handle OpenAI-specific errors
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new AppError("AI service timeout - please try again", 504)
      }

      if (error.status === 429) {
        throw new AppError("AI service rate limit exceeded", 429)
      }

      if (error.status === 401 || error.code === "invalid_api_key") {
        console.error("OpenAI Authentication Error:", {
          message: error.message,
          type: error.type,
          code: error.code,
        })
        throw new AppError(
          "Invalid or expired OpenAI API key. Please check your OPENAI_KEY in .env file",
          502,
        )
      }

      // Re-throw AppError instances
      if (error instanceof AppError) {
        throw error
      }

      // Generic AI service error with detailed logging
      console.error("AI service error:", {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
      })
      throw new AppError("AI service temporarily unavailable", 502)
    }
  }
}
