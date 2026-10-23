// As 4 métricas DORA a partir da API do GitHub (INT-08). Uso: node scripts/dora.mjs > status/dora.json
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const api = async (path) => {
  const r = await fetch(`https://api.github.com/repos/${repo}/${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
};
const media = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const dias = (a, b) => (new Date(a) - new Date(b)) / 864e5;
const arred = (n, c) => (n === null ? null : +n.toFixed(c));

const { workflow_runs: runs } = await api('actions/workflows/esteira.yml/runs?branch=main&event=push&status=success&per_page=100');
const periodo = runs.length ? Math.max(1, dias(runs[0].updated_at, runs[runs.length - 1].created_at)) : 1;
const lead = runs.filter((r) => r.head_commit).map((r) => dias(r.updated_at, r.head_commit.timestamp)); // commit -> produção
const commits = await api('commits?sha=gh-pages&per_page=100').catch(() => []);
const rollbacks = commits.filter((c) => /rollout: rollback/.test(c.commit.message)).length;
const fechados = (await api('issues?labels=alerta&state=closed&per_page=100').catch(() => [])).filter((i) => !i.pull_request);
const mttr = fechados.map((i) => (new Date(i.closed_at) - new Date(i.created_at)) / 36e5);

console.log(JSON.stringify({
  geradoEm: new Date().toISOString(),
  baseline: { carparts_leadTimeDias: 11 },
  deploys: runs.length,
  frequenciaDeploysPorDia: arred(runs.length / periodo, 2),
  leadTimeDias: arred(media(lead), 3),
  taxaFalhaMudanca: runs.length ? arred(rollbacks / runs.length, 3) : null,
  rollbacks,
  mttrHoras: arred(media(mttr), 2),
}, null, 2));
