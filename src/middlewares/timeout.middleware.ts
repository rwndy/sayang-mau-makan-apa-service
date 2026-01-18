import type { NextFunction, Request, Response } from "express"
import { AppError } from "./error.middleware"

export function timeoutMiddleware(timeout: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        next(new AppError("Request timeout - please try again", 408))
      }
    }, timeout)

    res.on("finish", () => clearTimeout(timer))
    res.on("close", () => clearTimeout(timer))

    next()
  }
}
