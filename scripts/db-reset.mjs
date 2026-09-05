#!/usr/bin/env node
/**
 * Local-only reset: drop the local database, apply migrations, load synthetic
 * seed. Never dumps or loads remote rows. Some students in this system are
 * minors.
 *
 * `0001_init.sql` is named the way the docs name it, not as a 14-digit
 * timestamp. The CLI can skip it. If `public.people` is missing after reset,
 * this script applies that file with psql before seeding.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function run(cmd) {
  const result = spawnSync(cmd, { shell: true, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function capture(cmd) {
  const result = spawnSync(cmd, { shell: true, encoding: "utf8" });
  if (result.status !== 0) return null;
  return (result.stdout || "").trim();
}

if (!capture("psql --version")) {
  console.error(
    "psql is required for db:reset. Install the Postgres client and retry."
  );
  process.exit(1);
}

run("pnpm exec supabase --workdir db db reset --local --no-seed");

const url = capture("node scripts/local-db-url.mjs");
if (!url) {
  console.error("Could not read the local database URL.");
  process.exit(1);
}

function applyIfMissing(checkSql, file) {
  const present = capture(`psql "${url}" -tAc "${checkSql}"`);
  if (present && present !== "null" && present !== "f") return;
  if (!existsSync(file)) {
    console.error(`${file} is missing.`);
    process.exit(1);
  }
  console.log(
    `Applying ${file} (the CLI skipped the untimestamped migration).`
  );
  run(`psql "${url}" -v ON_ERROR_STOP=1 -f ${file}`);
}

applyIfMissing(
  "select to_regclass('public.people')",
  "db/migrations/0001_init.sql"
);
applyIfMissing(
  "select to_regclass('public.platform_roles')",
  "db/migrations/0002_rbac.sql"
);
applyIfMissing(
  "select relrowsecurity from pg_class where oid = 'public.meetings'::regclass",
  "db/migrations/0003_rls.sql"
);

const seed = "db/seed.sql";
if (!existsSync(seed)) {
  console.error(`${seed} is missing. Restore the synthetic seed from git.`);
  process.exit(1);
}

console.log("Loading synthetic seed. Not remote rows.");
run(`psql "${url}" -v ON_ERROR_STOP=1 -f ${seed}`);

if (existsSync("scripts/seed-local-auth.mjs")) {
  console.log("Creating local auth users. Password is local-dev-password.");
  run("node scripts/seed-local-auth.mjs");
}
