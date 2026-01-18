import "dotenv/config"

function validateEnv() {
  const required = ["OPENAI_KEY", "DATABASE_URL"]
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    )
  }

  // Validate OpenAI key format
  const openaiKey = process.env.OPENAI_KEY
  if (!openaiKey?.startsWith("sk-")) {
    throw new Error("Invalid OPENAI_KEY format. Must start with 'sk-'")
  }
}

validateEnv()

export const env = {
  PORT: process.env.PORT || 3000,
  OPENAI_KEY: process.env.OPENAI_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
}
