// Build reprodutível: src/ -> dist/index.html (arquivo único, roda offline) + dist/version.json.
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const version = process.env.VERSION || pkg.version;
const gitSha = () => { try { return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return 'local'; } };
const sha = (process.env.GITHUB_SHA || gitSha()).slice(0, 7);

const out = await build({
  entryPoints: ['src/main.js'], bundle: true, format: 'iife', minify: true, write: false,
  loader: { '.png': 'dataurl' }, define: { __VERSION__: JSON.stringify(version) }, legalComments: 'none',
});
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
writeFileSync('dist/index.html', readFileSync('src/index.template.html', 'utf8').replace('/*__BUNDLE__*/', () => js));
writeFileSync('dist/version.json', `${JSON.stringify({ version, sha, build: new Date().toISOString() }, null, 2)}\n`);
if (existsSync('src/LEIA-ME.txt')) copyFileSync('src/LEIA-ME.txt', 'dist/LEIA-ME.txt');
console.log(`build ok: v${version} (${sha})`);
