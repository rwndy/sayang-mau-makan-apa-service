import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

import { z } from "zod"

export const recommendSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    mode: z.enum(["nearMe"]).optional(),
    lat: z
      .number({ message: "Latitude must be a number" })
      .min(-90)
      .max(90)
      .optional(),
    lon: z
      .number({ message: "Longitude must be a number" })
      .min(-180)
      .max(180)
      .optional(),
    radius: z.number().min(500).max(10000).optional().default(3000),
  })
  .refine(
    (data) => {
      // If mode is nearMe, lat and lon must be provided
      if (data.mode === "nearMe") {
        return data.lat !== undefined && data.lon !== undefined
      }
      return true
    },
    {
      message: "lat and lon are required when mode is 'nearMe'",
      path: ["mode"],
    },
  )

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
