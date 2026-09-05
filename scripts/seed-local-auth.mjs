#!/usr/bin/env node
/**
 * Creates local auth.users for the synthetic seed people if they are
 * missing. Password is local-dev-password. Never points at a remote project.
 */
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  LOCAL_DEV_PASSWORD,
  LOCAL_TEST_USERS,
  formatLocalLogins,
} from "./local-test-users.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
const serviceKey = status.SERVICE_ROLE_KEY || status.service_role_key;
if (!url || !serviceKey) {
  console.error("supabase status did not include API_URL or SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!url.includes("127.0.0.1") && !url.includes("localhost")) {
  console.error("Refusing to seed auth users on a non-local API URL.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let created = 0;
let existing = 0;

for (const user of LOCAL_TEST_USERS) {
  const { data: found, error: lookupError } =
    await supabase.auth.admin.getUserById(user.id);
  if (
    lookupError &&
    !/not (found|available)|user not found/i.test(lookupError.message)
  ) {
    console.error(`Could not look up ${user.email}: ${lookupError.message}`);
    process.exit(1);
  }

  if (found?.user) {
    existing += 1;
    continue;
  }

  const { error } = await supabase.auth.admin.createUser({
    id: user.id,
    email: user.email,
    password: LOCAL_DEV_PASSWORD,
    email_confirm: true,
  });
  if (error && !/already been registered/i.test(error.message)) {
    console.error(`Could not create ${user.email}: ${error.message}`);
    process.exit(1);
  }
  if (error) {
    existing += 1;
  } else {
    created += 1;
  }
}

if (created > 0) {
  console.log(`Created ${created} local auth user${created === 1 ? "" : "s"}.`);
}
if (existing > 0) {
  console.log(
    `${existing} local auth user${existing === 1 ? "" : "s"} already existed.`
  );
}
console.log(formatLocalLogins());
