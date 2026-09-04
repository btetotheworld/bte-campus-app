#!/usr/bin/env node
/**
 * Generates src/lib/db/types.ts from the live schema of a running Postgres
 * instance, in the same `Database` shape the Supabase CLI's
 * `gen types typescript` produces.
 *
 * Why this exists instead of calling the Supabase CLI directly: `supabase
 * gen types typescript --local` (and even `--db-url`) shells out to a Docker
 * container to do the introspection, regardless of whether the target
 * database is Dockerized. On a machine with Docker (the normal case), prefer
 * the real command:
 *
 *   pnpm exec supabase --workdir db gen types typescript --local > src/lib/db/types.ts
 *
 * This script is the Docker-free fallback: it introspects an already-running
 * Postgres directly via `pg` and emits an equivalent Database type. Point it
 * at any reachable Postgres via DATABASE_URL; it defaults to the standard
 * local Supabase connection string.
 *
 * Usage: node scripts/generate-db-types.mjs [outFile]
 *   DATABASE_URL   postgres connection string (default: local supabase db)
 */
import pg from "pg";
import fs from "node:fs";
import path from "node:path";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const OUT_FILE = process.argv[2] ?? "src/lib/db/types.ts";

const PG_TO_TS = {
  uuid: "string",
  text: "string",
  varchar: "string",
  "character varying": "string",
  citext: "string",
  bpchar: "string",
  boolean: "boolean",
  bool: "boolean",
  int2: "number",
  int4: "number",
  int8: "string",
  smallint: "number",
  integer: "number",
  bigint: "string",
  numeric: "number",
  decimal: "number",
  real: "number",
  float4: "number",
  float8: "number",
  "double precision": "number",
  date: "string",
  timestamp: "string",
  timestamptz: "string",
  "timestamp without time zone": "string",
  "timestamp with time zone": "string",
  time: "string",
  timetz: "string",
  json: "Json",
  jsonb: "Json",
  inet: "string",
  cidr: "string",
  macaddr: "string",
};

function pgScalarToTs(udtName) {
  return PG_TO_TS[udtName] ?? "unknown";
}

function tsTypeForColumn(col, enumNames) {
  let base;
  if (col.udt_name.startsWith("_")) {
    const inner = col.udt_name.slice(1);
    const innerTs = enumNames.has(inner) ? inner : pgScalarToTs(inner);
    base = `${innerTs}[]`;
  } else if (enumNames.has(col.udt_name)) {
    base = col.udt_name;
  } else {
    base = pgScalarToTs(col.udt_name);
  }
  return base;
}

async function main() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const enumsRes = await client.query(`
      select t.typname as enum_name, e.enumlabel as value
      from pg_type t
      join pg_enum e on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
      order by t.typname, e.enumsortorder;
    `);
    const enums = new Map();
    for (const row of enumsRes.rows) {
      if (!enums.has(row.enum_name)) enums.set(row.enum_name, []);
      enums.get(row.enum_name).push(row.value);
    }
    const enumNames = new Set(enums.keys());

    const tablesRes = await client.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name;
    `);

    const columnsRes = await client.query(`
      select table_name, column_name, udt_name, is_nullable, column_default,
             ordinal_position
      from information_schema.columns
      where table_schema = 'public'
      order by table_name, ordinal_position;
    `);
    const columnsByTable = new Map();
    for (const row of columnsRes.rows) {
      if (!columnsByTable.has(row.table_name))
        columnsByTable.set(row.table_name, []);
      columnsByTable.get(row.table_name).push(row);
    }

    const pkRes = await client.query(`
      select tc.table_name, kcu.column_name
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on tc.constraint_name = kcu.constraint_name
       and tc.table_schema = kcu.table_schema
      where tc.constraint_type = 'PRIMARY KEY' and tc.table_schema = 'public';
    `);
    const pkByTable = new Map();
    for (const row of pkRes.rows) {
      if (!pkByTable.has(row.table_name))
        pkByTable.set(row.table_name, new Set());
      pkByTable.get(row.table_name).add(row.column_name);
    }

    const lines = [];
    lines.push("// AUTO-GENERATED. Do not hand-edit.");
    lines.push(
      `// Generated ${new Date().toISOString()} by scripts/generate-db-types.mjs`
    );
    lines.push("// Regenerate with: pnpm run db:types");
    lines.push("");
    lines.push(
      "export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]"
    );
    lines.push("");
    for (const [name, values] of enums) {
      lines.push(
        `export type ${name} = ${values.map((v) => JSON.stringify(v)).join(" | ")}`
      );
    }
    lines.push("");
    lines.push("export type Database = {");
    lines.push("  public: {");
    lines.push("    Tables: {");

    for (const { table_name: table } of tablesRes.rows) {
      const cols = columnsByTable.get(table) ?? [];

      lines.push(`      ${table}: {`);
      lines.push("        Row: {");
      for (const col of cols) {
        const tsType = tsTypeForColumn(col, enumNames);
        const nullable = col.is_nullable === "YES";
        lines.push(
          `          ${col.column_name}: ${tsType}${nullable ? " | null" : ""}`
        );
      }
      lines.push("        }");

      lines.push("        Insert: {");
      for (const col of cols) {
        const tsType = tsTypeForColumn(col, enumNames);
        const nullable = col.is_nullable === "YES";
        const hasDefault = col.column_default !== null;
        const optional = nullable || hasDefault;
        lines.push(
          `          ${col.column_name}${optional ? "?" : ""}: ${tsType}${nullable ? " | null" : ""}`
        );
      }
      lines.push("        }");

      lines.push("        Update: {");
      for (const col of cols) {
        const tsType = tsTypeForColumn(col, enumNames);
        const nullable = col.is_nullable === "YES";
        lines.push(
          `          ${col.column_name}?: ${tsType}${nullable ? " | null" : ""}`
        );
      }
      lines.push("        }");
      lines.push("        Relationships: []");
      lines.push("      }");
    }

    lines.push("    }");
    lines.push("    Views: Record<string, never>");
    lines.push("    Functions: Record<string, never>");
    lines.push("    Enums: {");
    for (const [name, values] of enums) {
      lines.push(
        `      ${name}: ${values.map((v) => JSON.stringify(v)).join(" | ")}`
      );
    }
    lines.push("    }");
    lines.push("    CompositeTypes: Record<string, never>");
    lines.push("  }");
    lines.push("}");
    lines.push("");

    const outPath = path.resolve(OUT_FILE);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, lines.join("\n"));
    console.log(
      `Wrote ${outPath} (${tablesRes.rows.length} tables, ${enums.size} enums)`
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Type generation failed:", err);
  process.exit(1);
});
