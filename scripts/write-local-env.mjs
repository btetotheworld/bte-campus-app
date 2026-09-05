#!/usr/bin/env node
/**
 * Writes local Docker Supabase keys into .env.local.
 * Leaves Cloudinary and Brevo values alone. Never writes a remote URL.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

let raw;
try {
  raw = execSync("pnpm exec supabase --workdir db status --output json", {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch {
  console.error("Could not read local Supabase status.");
  process.exit(1);
}

const status = JSON.parse(raw);
const url = status.API_URL || status.api_url;
const anon = status.ANON_KEY || status.anon_key;
const service = status.SERVICE_ROLE_KEY || status.service_role_key;

if (!url || !anon || !service) {
  console.error("supabase status did not include URL and keys.");
  process.exit(1);
}

if (!url.includes("127.0.0.1") && !url.includes("localhost")) {
  console.error("Refusing to write a non-local Supabase URL into .env.local.");
  process.exit(1);
}

const replacements = {
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
  SUPABASE_SERVICE_ROLE_KEY: service,
};

let text = existsSync(envPath)
  ? readFileSync(envPath, "utf8")
  : readFileSync(resolve(root, ".env.example"), "utf8");

for (const [key, value] of Object.entries(replacements)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(text)) {
    text = text.replace(pattern, line);
  } else {
    text = `${text.trimEnd()}\n${line}\n`;
  }
}

writeFileSync(envPath, text.endsWith("\n") ? text : `${text}\n`);
console.log("Wrote local Supabase keys to .env.local.");
