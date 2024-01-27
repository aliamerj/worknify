import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { MiddlewareFactory } from "./middleware.type";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";

const configPath = [
  "/profile/create",
  "/profile/edit",
  "/project/create",
  "project/my",
];

export const authMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    if (configPath.some((path) => pathname.startsWith(path))) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        const url = new URL(ApiRouter.signin, request.url);
        url.searchParams.set("callback ", encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
    if (pathname.startsWith("/signin")) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token) {
        const url = new URL(AppRouter.home, request.url);
        url.searchParams.set("callback ", encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
    return next(request, _next);
  };
};
