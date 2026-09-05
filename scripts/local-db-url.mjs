#!/usr/bin/env node
/**
 * Prints the local Supabase Postgres URL for the db/ workdir.
 * Used by db:seed, db:test, and db:test:rls. Never talks to a remote project.
 */
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let raw;
try {
  raw = execSync("pnpm exec supabase --workdir db status --output json", {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch {
  console.error(
    "Could not read local Supabase status. Start the stack with `pnpm setup` or `pnpm exec supabase --workdir db start`."
  );
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error("supabase status --output json did not return JSON.");
  process.exit(1);
}

const url = parsed.DB_URL || parsed.db_url;
if (!url) {
  console.error("supabase status did not include DB_URL.");
  process.exit(1);
}

process.stdout.write(url);
