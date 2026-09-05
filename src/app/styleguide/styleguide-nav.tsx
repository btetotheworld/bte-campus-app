"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/styleguide", label: "Tokens" },
  { href: "/styleguide/list", label: "List" },
  { href: "/styleguide/record", label: "Record" },
  { href: "/styleguide/form", label: "Form" },
  { href: "/styleguide/dashboard", label: "Dashboard" },
] as const;

export function StyleguideNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Styleguide" className="mb-12">
      <ul className="flex flex-wrap gap-4">
        {ITEMS.map((item) => {
          const current = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "text-sm font-semibold text-navy"
                    : "text-sm text-ink-secondary underline"
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
