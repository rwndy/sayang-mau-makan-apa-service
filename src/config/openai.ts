import OpenAI from "openai"
import { env } from "./env"

export const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 2, // Retry twice on failure
})
