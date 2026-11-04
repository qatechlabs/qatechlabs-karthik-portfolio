#!/usr/bin/env node
/**
 * Lists every content placeholder (`pending("…")`) in src/content.
 *
 *   npm run content:audit            report placeholders, exit 0
 *   npm run content:audit -- --strict  exit 1 if any remain (use before launch)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const dir = join(root, "src", "content");
const strict = process.argv.includes("--strict");
const pattern = /pending\(\s*(["'`])([\s\S]*?)\1\s*,?\s*\)/g;

const findings = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "types.ts")) {
  const path = join(dir, file);
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(pattern)) {
    const line = source.slice(0, match.index).split("\n").length;
    findings.push({ where: `${relative(root, path)}:${line}`, note: match[2].replace(/\s+/g, " ") });
  }
}

if (findings.length === 0) {
  console.log("No content placeholders remain.");
  process.exit(0);
}

console.log(`${findings.length} content placeholder(s) to resolve before launch:\n`);
const width = Math.max(...findings.map((f) => f.where.length));
for (const f of findings) console.log(`  ${f.where.padEnd(width)}  ${f.note}`);
console.log("");
process.exit(strict ? 1 : 0);
