import {
  ACCESS_TOKEN_MAX_AGE,
  authCookieOptions,
  refreshAccessToken,
} from "@/lib/auth-cookies";
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

function callBackend(
  request: NextRequest,
  path: string[],
  body: ArrayBuffer | undefined,
  token?: string,
) {
  const headers = new Headers({ accept: "application/json" });
  const contentType = request.headers.get("content-type");

  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const target = `${API_BASE_URL}/${path
    .map(encodeURIComponent)
    .join("/")}${request.nextUrl.search}`;

  return fetch(target, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });
}

async function handler(request: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const rawBody =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  const body = rawBody && rawBody.byteLength > 0 ? rawBody : undefined;

  try {
    let upstream = await callBackend(request, path, body, token);

    if (upstream.status === 401 && token) {
      const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
      const freshToken = refreshToken
        ? await refreshAccessToken(refreshToken)
        : null;

      if (freshToken) {
        cookieStore.set(
          ACCESS_TOKEN_COOKIE,
          freshToken,
          authCookieOptions(ACCESS_TOKEN_MAX_AGE),
        );
        upstream = await callBackend(request, path, body, freshToken);
      } else {
        cookieStore.delete(ACCESS_TOKEN_COOKIE);
        cookieStore.delete(REFRESH_TOKEN_COOKIE);
      }
    }

    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Could not reach the GearUp API. Make sure the backend server is running.",
      },
      { status: 502 },
    );
  }
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
