#!/usr/bin/env node
/**
 * scripts/setup.mjs   ->   pnpm setup
 *
 * Takes a fresh clone to a working local environment, and verifies it rather
 * than assuming. Everything here is local. It never touches a remote project.
 *
 * Deliberately NOT a postinstall hook: it starts Docker containers and resets a
 * database, which is not something `pnpm install` should ever do silently, and
 * would break CI.
 *
 * This project's Supabase config lives in db/, not supabase/. Every CLI call
 * passes --workdir db. supabase/ is leftover from a remote schema pull and
 * is not the local stack.
 */

import { existsSync, copyFileSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { formatLocalLogins } from "./local-test-users.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

const G = "\x1b[32m";
const R = "\x1b[31m";
const Y = "\x1b[33m";
const D = "\x1b[2m";
const B = "\x1b[1m";
const O = "\x1b[0m";

let step = 0;
const head = (t) => console.log(`\n${B}${++step}. ${t}${O}`);
const ok = (t) => console.log(`   ${G}ok${O}   ${t}`);
const warn = (t) => console.log(`   ${Y}warn${O} ${t}`);
const fail = (t, fix) => {
  console.error(`\n   ${R}fail${O} ${t}`);
  if (fix) console.error(`   ${Y}fix${O}  ${fix}\n`);
  process.exit(1);
};

const run = (cmd, opts = {}) =>
  spawnSync(cmd, {
    shell: true,
    stdio: opts.quiet ? "pipe" : "inherit",
    ...opts,
  });

const capture = (cmd) => {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
};

const supabase = (args) => `pnpm exec supabase --workdir db ${args}`;

console.log(`\n${B}BTE Campus, local setup${O}`);

// ---------------------------------------------------------------- 1
head("Prerequisites");

const node = process.versions.node.split(".").map(Number);
if (node[0] < 20)
  fail(`Node ${process.versions.node}`, "Node 20 or later required.");
ok(`Node ${process.versions.node}`);

if (!capture("docker --version")) {
  fail(
    "Docker not found.",
    "Install Docker Desktop and start it. Supabase runs locally in Docker."
  );
}
if (!capture("docker info")) {
  fail(
    "Docker is installed but not running.",
    "Start Docker Desktop, then run pnpm setup again."
  );
}
ok("Docker running");

if (
  !capture("pnpm exec supabase --version") &&
  !capture("supabase --version")
) {
  fail(
    "Supabase CLI not found.",
    "It is a project devDependency. Run pnpm install, or brew install supabase/tap/supabase."
  );
}
ok(
  `Supabase CLI ${capture("pnpm exec supabase --version") || capture("supabase --version")}`
);

if (!capture("psql --version")) {
  fail(
    "psql not found.",
    "Install the Postgres client (for example: brew install libpq && brew link --force libpq)."
  );
}
ok(`psql ${capture("psql --version")}`);

// ---------------------------------------------------------------- 2
head("Safety check");

for (const p of [
  "supabase/.temp/project-ref",
  "db/.temp/project-ref",
  ".supabase/.temp/project-ref",
]) {
  if (existsSync(p)) {
    fail(
      "This repo is linked to a remote Supabase project.",
      "Run `pnpm exec supabase unlink` first. Setup resets the database and must never touch remote."
    );
  }
}
ok("Not linked to any remote project");

// ---------------------------------------------------------------- 3
head("Environment file");

if (!existsSync(".env.local")) {
  if (existsSync(".env.example")) {
    copyFileSync(".env.example", ".env.local");
    ok("Created .env.local from .env.example");
    warn("Fill in Cloudinary and Brevo keys before those features will work.");
  } else {
    fail(".env.example is missing.", "Restore it from git.");
  }
} else {
  ok(".env.local exists");
}

// ---------------------------------------------------------------- 4
head("Dependencies");
if (run("pnpm install --frozen-lockfile").status !== 0) {
  fail("pnpm install failed.");
}
ok("Installed");

// ---------------------------------------------------------------- 5
head("Local Supabase stack");
if (run(supabase("start")).status !== 0) {
  fail(
    "supabase start failed.",
    "Check Docker has enough memory allocated, 4GB or more."
  );
}
ok("Running");

head("Local keys");
if (run("node scripts/write-local-env.mjs").status !== 0) {
  fail(
    "Could not write local Supabase keys to .env.local.",
    "Run `pnpm exec supabase --workdir db status` and copy the URL and anon key yourself."
  );
}
ok("Wrote local URL and keys into .env.local");

// ---------------------------------------------------------------- 6
head("Database: migrations and synthetic seed");
console.log(
  `   ${D}Seed data is synthetic. Never clone real rows to a local machine.${O}`
);
console.log(
  `   ${D}this system holds student data and some students are minors.${O}`
);
if (run("pnpm run db:reset").status !== 0) {
  fail(
    "Database reset failed.",
    "Read the SQL error above. A migration is likely invalid."
  );
}
ok("Migrations applied, synthetic seed loaded");

head("Local test logins");
if (run("node scripts/seed-local-auth.mjs").status !== 0) {
  fail(
    "Could not create local auth users.",
    "The local stack must be running. Then run `pnpm db:seed-auth`."
  );
}
ok("Seed people can sign in. Credentials are printed above and in the README.");

// ---------------------------------------------------------------- 7
head("Generated types");
if (run("pnpm run db:types").status !== 0) {
  warn(
    "Type generation failed. Continuing. Run `pnpm db:types` once resolved."
  );
} else {
  ok("src/lib/db/types.ts regenerated");
}

// ---------------------------------------------------------------- 8
head("Verifying the database actually enforces its rules");

const invariants = run("pnpm run db:test", { quiet: true });
const inv =
  (invariants.stdout || "").toString() + (invariants.stderr || "").toString();
if (/ERROR/.test(inv)) {
  ok("Invariant tests fired as expected");
} else {
  warn(
    "Invariant tests produced no rejections. That is suspicious. Check db/tests/."
  );
}

if (existsSync("db/tests/0002_rbac.test.sql")) {
  const rbac = run("pnpm run db:test:rbac", { quiet: true });
  if (rbac.status === 0) ok("RBAC guard tests passed");
  else warn("RBAC guard tests failed. Do not push until they pass.");
}

if (existsSync("db/tests/0003_rls.test.sql")) {
  const rls = run("pnpm run db:test:rls", { quiet: true });
  if (rls.status === 0) ok("RLS policy tests passed");
  else warn("RLS policy tests failed. Do not push until they pass.");
} else {
  warn("No RLS tests found. RLS is not yet in place.");
}

if (existsSync("db/tests/0005_join_applications.test.sql")) {
  const join = run("pnpm run db:test:join-applications", { quiet: true });
  if (join.status === 0) ok("Join application RLS tests passed");
  else warn("Join application RLS tests failed. Do not push until they pass.");
}

// ---------------------------------------------------------------- 9
head("Toolchain");
for (const [label, cmd] of [
  ["typecheck", "pnpm run typecheck"],
  ["lint", "pnpm run lint"],
  ["tests", "pnpm run test"],
]) {
  const r = run(cmd, { quiet: true });
  if (r.status === 0) {
    ok(label);
  } else {
    warn(`${label} failed. Run \`${cmd}\` to see why`);
  }
}

// ---------------------------------------------------------------- done
const studio = capture(supabase("status --output json"));
let studioUrl = "http://127.0.0.1:54323";
try {
  const p = JSON.parse(studio);
  studioUrl = p.STUDIO_URL || p.studio_url || studioUrl;
} catch {
  /* keep default */
}

console.log(`
${G}${B}Ready.${O}

  ${B}pnpm dev${O}         the app
  ${B}${studioUrl}${O}   local Supabase Studio
  ${B}pnpm db:reset${O}    wipe and reseed local
  ${B}/styleguide${O}      design tokens and components

${B}Local sign-in${O}
${formatLocalLogins()}

${D}Read AGENTS.md before touching the database.
Never run supabase link on a machine you develop on. Link, push, unlink.${O}
`);
