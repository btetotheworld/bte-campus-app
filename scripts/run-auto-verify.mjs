#!/usr/bin/env node
/**
 * Runs the P8 auto-verify job locally with the service role.
 * Uses SUPABASE_SERVICE_ROLE_KEY from .env.local. Local Docker only.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function readEnv(name) {
  if (!existsSync(envPath)) return null;
  const match = readFileSync(envPath, "utf8").match(
    new RegExp(`^${name}=(.+)$`, "m")
  );
  return match?.[1]?.trim() ?? null;
}

const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

if (!url.includes("127.0.0.1") && !url.includes("localhost")) {
  console.error(
    "Refusing to run auto-verify against a non-local Supabase URL."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.rpc("auto_verify_people");
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(JSON.stringify(data));
