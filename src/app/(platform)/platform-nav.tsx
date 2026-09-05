"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/people", label: "People" },
  { href: "/campus/chapters", label: "Chapters" },
  { href: "/campus/applications", label: "Applications" },
  { href: "/campus/meetings", label: "Meetings" },
  { href: "/campus/members", label: "Members" },
  { href: "/campus/submissions", label: "Submissions" },
  { href: "/campus/health", label: "Health" },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PlatformNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Platform">
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "block border-l-2 border-navy px-3 py-2 text-sm font-semibold text-navy"
                    : "block border-l-2 border-transparent px-3 py-2 text-sm text-ink-secondary hover:bg-surface-2 hover:text-ink"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
