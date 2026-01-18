import type { Response } from "express"

export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T | null
}

export function successResponse<T>(
  res: Response,
  data: T,
  message = "success",
  statusCode = 200,
) {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  })
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
) {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data: null,
  })
}
