import { Response } from "express";

export function RequestError(code: number, message: string) {
  return {
    code,
    message,
  };
}

export function handleError(res: Response, err: any) {
  res.status(err.code || 400).render("error", err);
}
