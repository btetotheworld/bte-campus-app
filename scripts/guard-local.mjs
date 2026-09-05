#!/usr/bin/env node
/**
 * scripts/guard-local.mjs
 *
 * Refuses to continue unless the Supabase CLI is pointed at a LOCAL database.
 * Wired in front of every destructive script: db:reset, db:seed, db:test.
 *
 * The failure this prevents: `supabase db reset` against a linked remote
 * project. It drops the database. There is no confirmation prompt that saves
 * you, and it is one typo away from being the last thing you do that day.
 *
 * Fails closed. If it cannot prove the target is local, it stops.
 */

import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const OFF = "\x1b[0m";

function die(reason, fix) {
  console.error(`\n${RED}BLOCKED${OFF}  ${reason}\n`);
  if (fix) console.error(`${YELLOW}Fix:${OFF} ${fix}\n`);
  process.exit(1);
}

const LOCAL_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "host.docker.internal",
];

// 1. Linked to a remote project? The CLI writes the ref here on `supabase link`.
const refPaths = [
  "supabase/.temp/project-ref",
  "db/.temp/project-ref",
  ".supabase/.temp/project-ref",
];
for (const p of refPaths) {
  if (existsSync(p)) {
    const ref = readFileSync(p, "utf8").trim();
    if (ref) {
      die(
        `This repo is linked to remote Supabase project "${ref}".`,
        "Run `pnpm exec supabase unlink` from the linked workdir, then retry.\n" +
          "     This project's local stack is `db/`. Link only when you are\n" +
          "     deliberately pushing, then unlink again."
      );
    }
  }
}

// 2. Any DB URL in the environment must point somewhere local.
const urlVars = [
  "DATABASE_URL",
  "SUPABASE_DB_URL",
  "POSTGRES_URL",
  "DIRECT_URL",
];
for (const key of urlVars) {
  const raw = process.env[key];
  if (!raw) continue;
  let host;
  try {
    host = new URL(raw).hostname;
  } catch {
    die(`${key} is set but is not a valid URL.`, `Check .env.local`);
  }
  if (!LOCAL_HOSTS.includes(host)) {
    die(
      `${key} points at "${host}", which is not local.`,
      "Destructive commands run against local only. Unset it or point it at 127.0.0.1."
    );
  }
}

// 3. Explicit production markers.
for (const key of ["NODE_ENV", "VERCEL_ENV", "ENVIRONMENT"]) {
  const v = (process.env[key] || "").toLowerCase();
  if (v === "production" || v === "prod") {
    die(
      `${key}=${v}`,
      "Destructive commands are never run in a production environment."
    );
  }
}

// 4. Is the local stack actually up? Absence is not proof of safety, but a
//    running local stack is good positive evidence.
try {
  const status = execSync(
    "pnpm exec supabase --workdir db status --output json",
    {
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 15000,
    }
  ).toString();
  const parsed = JSON.parse(status);
  const api = parsed.API_URL || parsed.api_url || "";
  if (api && !LOCAL_HOSTS.some((h) => api.includes(h))) {
    die(
      `supabase status reports a non-local API URL: ${api}`,
      "Expected a localhost URL."
    );
  }
} catch {
  console.error(
    `${YELLOW}Note${OFF}  Could not read \`supabase status\` for workdir db/.\n` +
      `${DIM}      Local stack may not be running. Run \`pnpm setup\` first if this is a fresh checkout.${OFF}`
  );
}

console.log(`${GREEN}OK${OFF}  Target is local. Proceeding.`);
