export type Permission = {
  module: string;
  operation: string;
};

export type SessionAccess = {
  isFounder: boolean;
  permissions: Permission[];
};

export type NavItem = {
  href: string;
  label: string;
  module?: string;
  operation?: string;
};

// Nouns match the current platform nav. Modules are from docs/RBAC.md
// section 5 and docs/ARCHITECTURE.md section 2. Home has no module: every
// signed-in person may open the shell.
export const PLATFORM_NAV: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/people", label: "People", module: "people", operation: "read" },
  {
    href: "/campus/chapters",
    label: "Chapters",
    module: "chapters",
    operation: "read",
  },
  {
    href: "/campus/applications",
    label: "Applications",
    module: "campus_applications",
    operation: "read",
  },
  {
    href: "/campus/meetings",
    label: "Meetings",
    module: "meetings",
    operation: "read",
  },
  {
    href: "/campus/members",
    label: "Members",
    module: "chapter_members",
    operation: "read",
  },
  {
    href: "/campus/submissions",
    label: "Submissions",
    module: "submissions",
    operation: "read",
  },
  {
    href: "/campus/health",
    label: "Health",
    module: "succession",
    operation: "read",
  },
];

export function canAccess(
  access: SessionAccess,
  module: string,
  operation: string
): boolean {
  if (access.isFounder) return true;
  return access.permissions.some((permission) => {
    return permission.module === module && permission.operation === operation;
  });
}

export function visibleNavItems(access: SessionAccess): NavItem[] {
  return PLATFORM_NAV.filter((item) => {
    if (!item.module || !item.operation) return true;
    return canAccess(access, item.module, item.operation);
  });
}

export function canOpenPath(pathname: string, access: SessionAccess): boolean {
  const item = PLATFORM_NAV.find((entry) => {
    if (entry.href === "/") return pathname === "/";
    return pathname === entry.href || pathname.startsWith(`${entry.href}/`);
  });
  if (!item) return true;
  if (!item.module || !item.operation) return true;
  return canAccess(access, item.module, item.operation);
}
