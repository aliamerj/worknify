import { NextMiddleware, NextResponse } from "next/server";
import { MiddlewareFactory } from "./middleware.type";

export function middlewares(
  functions: MiddlewareFactory[] = [],
  index = 0,
): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = middlewares(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}
