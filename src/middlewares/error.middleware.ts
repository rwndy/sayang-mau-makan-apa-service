import { Prisma } from "@prisma/client"
import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
export class AppError extends Error {
  readonly status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = "AppError"
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>

export const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(`[${new Date().toISOString()}]`, err)

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = getPrismaErrorStatus(err.code)
    res.status(statusCode).json({
      success: false,
      message: getPrismaErrorMessage(err.code),
      code: err.code,
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    })
    return
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  })
}

function getPrismaErrorStatus(code: string): number {
  const statusMap: Record<string, number> = {
    P2002: 409, // Unique constraint
    P2025: 404, // Record not found
    P2003: 400, // Foreign key constraint
  }
  return statusMap[code] ?? 400
}

function getPrismaErrorMessage(code: string): string {
  const messageMap: Record<string, string> = {
    P2002: "Record already exists",
    P2025: "Record not found",
    P2003: "Related record not found",
  }
  return messageMap[code] ?? "Database Error"
}
