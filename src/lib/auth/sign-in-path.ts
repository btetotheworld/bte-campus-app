export const PATHNAME_HEADER = "x-pathname";

export function signInHref(pathname: string): string {
  const next =
    pathname.startsWith("/") && !pathname.startsWith("//") ? pathname : "/";
  return `/sign-in?next=${encodeURIComponent(next)}`;
}
