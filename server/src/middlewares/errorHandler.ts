import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[ERROR] " + err.message);

  if (env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(500).json({
    error: "Erro interno do servidor",
    ...(env.NODE_ENV === "development" && { details: err.message }),
  });
}
