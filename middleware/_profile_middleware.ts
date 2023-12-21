import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./middleware.type";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import { getToken } from "next-auth/jwt";
import { databaseDrizzle } from "@/db/database";
import { profile } from "@/db/schemes/profileSchema";
import { eq } from "drizzle-orm";
// this not working
export const profileMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith(AppRouter.createProfile)) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        const url = new URL(ApiRouter.signin, request.url);
        url.searchParams.set("callback ", encodeURI(request.url));
        return NextResponse.redirect(url);
      }
      const profileData = await databaseDrizzle
        .select()
        .from(profile)
        .where(eq(profile.userId, token?.sub!))
        .execute();
      if (!profileData[0]) {
        const url = new URL(AppRouter.editProfile, request.url);
        return NextResponse.redirect(url);
      }
    }
    return next(request, _next);
  };
};
