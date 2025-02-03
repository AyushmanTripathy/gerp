import { Response } from "express";

export function RequestError(code: number, message: string) {
  return {
    code,
    message,
  };
}

export function handleError(res: Response, err: any) {
  if (Number.isInteger(err.code) && 400 <= err.code && err.code < 600)
    res.status(err.code);
  res.render("error", {
    code: err.code || 400,
    message: err.message || "Bad Request",
  });
}
