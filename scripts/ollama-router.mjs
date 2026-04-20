import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] || 'restart';
const root = process.cwd();
const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const generalModel = process.env.OLLAMA_GENERAL_MODEL || 'qwen3:8b';
const codeModel = process.env.OLLAMA_CODE_MODEL || 'qwen2.5-coder:7b';
const projectCore = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/project-core.json'), 'utf-8'));
const projectStatus = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/project-status.json'), 'utf-8'));
const currentLot = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/current-lot.json'), 'utf-8'));
const proofLog = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/proof-log.json'), 'utf-8'));

const promptFile = mode === 'next'
  ? path.join(root, 'axend/prompts/user-template-next-action.md')
  : path.join(root, 'axend/prompts/user-template-restart-pack.md');

const instruction = fs.existsSync(promptFile)
  ? fs.readFileSync(promptFile, 'utf-8')
  : (mode === 'next'
      ? 'Propose une seule prochaine action nette.'
      : 'Propose un restart pack court.');

const context = {
  mode,
  projectCore,
  projectStatus,
  currentLot,
  latestProof: proofLog.entries?.[proofLog.entries.length - 1] ?? null
};

const model = mode === 'next' ? codeModel : generalModel;
const body = {
  model,
  stream: false,
  messages: [
    {
      role: 'system',
      content: 'Tu es le routeur local AXEND. Réponds court, concret, structuré, sans invention. Appuie-toi seulement sur le contexte fourni.'
    },
    {
      role: 'user',
      content: `${instruction}

## CONTEXTE JSON
${JSON.stringify(context, null, 2)}`
    }
  ]
};

const res = await fetch(`${baseUrl}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(`Ollama HTTP ${res.status}: ${text}`);
}

const data = await res.json();
const content = data.message?.content || JSON.stringify(data, null, 2);
const outputPath = mode === 'next'
  ? path.join(root, 'axend/handoffs/OLLAMA_NEXT_ACTION.md')
  : path.join(root, 'axend/handoffs/OLLAMA_RESTART_PACK.md');
fs.writeFileSync(outputPath, content, 'utf-8');
console.log(content);
console.error(`Saved to ${outputPath}`);
