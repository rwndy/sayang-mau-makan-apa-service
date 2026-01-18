import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

import { z } from "zod"

export const recommendSchema = z.object({
  lat: z.number({ message: "Latitude must be a number" }).min(-90).max(90),
  lon: z.number({ message: "Longitude must be a number" }).min(-180).max(180),
  category: z.string().min(1, "Category is required"),
  radius: z.number().min(500).max(10000).optional().default(3000),
})

export type RecommendInput = z.infer<typeof recommendSchema>

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      })
      return
    }

    req.body = result.data
    next()
  }
