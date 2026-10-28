#!/usr/bin/env node
/**
 * Runs a SQL test file against the local Supabase Postgres URL.
 * Used instead of shell $(...) substitution, which fails on Windows PowerShell.
 */
import { spawnSync } from "node:child_process";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2).filter((arg) => arg !== "--strict");
const strict = process.argv.includes("--strict");
const file = args[0];

if (!file || !existsSync(resolve(file))) {
  console.error("Usage: node scripts/db-test.mjs <test.sql> [--strict]");
  process.exit(1);
}

const url = execSync("node scripts/local-db-url.mjs", {
  encoding: "utf8",
}).trim();
const psqlArgs = strict
  ? [url, "-v", "ON_ERROR_STOP=1", "-f", file]
  : [url, "-f", file];

const result = spawnSync("psql", psqlArgs, { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
