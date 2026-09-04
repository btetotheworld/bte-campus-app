#!/usr/bin/env node
/**
 * Fails if a source file exists under lib/schemas, lib/actions,
 * src/lib/schemas or src/lib/actions without a matching .test.ts sibling.
 *
 * This is the gate. Coverage percentages are not.
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = [
  "lib/schemas",
  "lib/actions",
  "src/lib/schemas",
  "src/lib/actions",
];

const TEST_SUFFIX = /\.test\.(ts|tsx)$/;
const SOURCE_SUFFIX = /\.(ts|tsx)$/;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const missing = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (!SOURCE_SUFFIX.test(file) || TEST_SUFFIX.test(file)) continue;
    const testTs = file.replace(SOURCE_SUFFIX, ".test.ts");
    const testTsx = file.replace(SOURCE_SUFFIX, ".test.tsx");
    if (!fs.existsSync(testTs) && !fs.existsSync(testTsx)) {
      missing.push(file);
    }
  }
}

if (missing.length > 0) {
  console.error(
    "These files have no matching .test.ts. Every file under lib/schemas/ and lib/actions/ needs a sibling test. See docs/TESTING.md."
  );
  for (const file of missing) {
    console.error(`  ${file}`);
  }
  process.exit(1);
}

console.log(
  "Every schema and action file has a matching test (or those directories are empty)."
);
