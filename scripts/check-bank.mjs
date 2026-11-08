// Verifies the built-in question banks: sizes, validity, distinct options and shuffled papers.
import { build } from 'esbuild'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const dir = mkdtempSync(join(tmpdir(), 'bank-check-'))
const outfile = join(dir, 'check.mjs')
await build({ entryPoints: ['scripts/check-bank.entry.ts'], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'error' })
process.exit(spawnSync('node', [outfile], { stdio: 'inherit' }).status ?? 1)
