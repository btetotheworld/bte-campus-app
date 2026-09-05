import type { ReactNode } from "react";
import Link from "next/link";

export type PageHeaderCrumb = {
  href: string;
  label: string;
};

export function PageHeader({
  title,
  description,
  action,
  crumbs,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  crumbs?: PageHeaderCrumb[];
}) {
  return (
    <header className="mb-8">
      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link href={crumb.href} className="text-navy underline">
                  {crumb.label}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            <li className="text-ink" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-prose">
          <h1 className="text-h1">{title}</h1>
          {description ? (
            <p className="mt-2 text-body text-ink-secondary">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
