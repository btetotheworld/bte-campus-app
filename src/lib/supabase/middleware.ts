import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/db/types";
import { PATHNAME_HEADER } from "@/lib/auth/sign-in-path";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

function nextWithPathname(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers },
  });
}

const PUBLIC_PREFIXES = ["/sign-in", "/forgot-password", "/auth/callback"];

function isPublicPath(pathname: string): boolean {
  const isAuthRoute = PUBLIC_PREFIXES.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
  if (isAuthRoute) return true;
  return pathname === "/styleguide" || pathname.startsWith("/styleguide/");
}

export async function updateSession(request: NextRequest) {
  let response = nextWithPathname(request);

  const supabase = createServerClient<Database>(
    supabaseUrl(),
    supabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = nextWithPathname(request);
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: person } = await supabase
      .from("people")
      .select("status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!person || person.status === "inactive") {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.search = "";
      url.searchParams.set("reason", person ? "inactive" : "unlinked");
      return NextResponse.redirect(url);
    }

    if (pathname === "/sign-in" || pathname === "/forgot-password") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
