import "dotenv/config"

export const env = {
  PORT: process.env.PORT || 3000,
  OPENAI_KEY: process.env.OPENAI_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
}
