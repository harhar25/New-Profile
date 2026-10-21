import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = new Map();
function loadModule(filename) {
  const file = path.isAbsolute(filename) ? filename : path.join(root, filename);
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021, esModuleInterop: true } });
  const exports = {};
  cache.set(file, exports);
  new Function('exports', 'require', compiled.outputText)(exports, specifier => {
    const target = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(file), specifier);
    return loadModule(path.extname(target) ? target : `${target}.ts`);
  });
  return exports;
}
const { retrieveKnowledge, knowledgeReply, assistantInstructions } = loadModule('lib/assistantKnowledge.ts');
const { projectScreenshots } = loadModule('lib/projectScreenshots.ts');
const { englishListeningCertificate: certificate } = loadModule('lib/portfolioHighlights.ts');
const ask = (question, previous) => {
  const messages = [...(previous ? [{ role: 'user', content: previous }] : []), { role: 'user', content: question }];
  const chunks = retrieveKnowledge(messages);
  return { chunks, ...knowledgeReply(messages, chunks) };
};

test('project overview includes the editorial pipeline and current gallery count', () => {
  const answer = ask('Show me his projects');
  assert.equal(answer.chunks[0].id, 'profile-projects');
  assert.match(answer.reply, /5 published projects/);
  assert.match(answer.reply, /AI Editorial Draft Pipeline/);
  assert.ok(answer.reply.includes(`${projectScreenshots.length} distinct screenshots`));
});

test('English questions retrieve the scoped certificate with its original PDF', () => {
  for (const question of ['What is his English proficiency?', 'Show me the C1 certificate', 'Does he have an IELTS score?']) {
    const answer = ask(question);
    assert.equal(answer.chunks[0].id, 'english-listening-certificate');
    assert.ok(answer.reply.includes(certificate.pdf));
    assert.ok(answer.reply.includes(certificate.displayDate));
    assert.match(answer.reply, /self-assessment/);
    assert.match(answer.reply, /not an official examination result/);
    assert.match(answer.reply, /does not provide speaking, reading, or writing scores/);
  }
});

test('public gallery answers explain counts, navigation, and full-size viewing', () => {
  const answer = ask('Where can I see screenshots of the automations?');
  assert.equal(answer.chunks[0].id, 'project-screenshot-gallery');
  assert.ok(answer.reply.includes(`${projectScreenshots.length} distinct public screenshots`));
  assert.match(answer.reply, /\/projects#project-gallery/);
  assert.match(answer.reply, /12 thumbnails/);
  assert.match(answer.reply, /View full size/);
});

test('playground questions retrieve instructions ahead of general services', () => {
  const answer = ask('How do I connect nodes in the automation playground?');
  assert.equal(answer.chunks[0].id, 'playground-how-to');
  assert.match(answer.reply, /output port and then an input port/);
  assert.match(answer.reply, /Drag an output port/);
  assert.match(answer.reply, /Press Escape/);
  assert.match(answer.reply, /\/automation/);
  assert.match(answer.reply, /Run workflow/);
});

test('playground limits stay explicit for live email, saving, and export', () => {
  for (const question of ['Can the playground send real email?', 'Can I save or export the playground?', 'Can I connect accounts in the builder?']) {
    const answer = ask(question);
    assert.equal(answer.chunks[0].id, 'playground-limits');
    assert.match(answer.reply, /does not send real email/);
    assert.match(answer.reply, /no workflow import, export, or persistent save/);
  }
});

test('a follow-up about live email stays on the playground topic', () => {
  const answer = ask('Does it send real email?', 'What is the automation playground?');
  assert.equal(answer.chunks[0].id, 'playground-limits');
});

test('explicit new topics override a previous playground question', () => {
  const answer = ask('What is his English certificate?', 'How do I connect nodes?');
  assert.equal(answer.chunks[0].id, 'english-listening-certificate');
});

test('importable n8n workflow is distinguished from the simulation', () => {
  const answer = ask('Where can I download the n8n editorial workflow?');
  assert.equal(answer.chunks[0].id, 'project-n8n-ai-editorial-pipeline');
  assert.match(answer.reply, /\/downloads\/n8n-ai-editorial-pipeline.json/);
  assert.match(answer.reply, /never publishes automatically/);
});

test('the common Zappier spelling finds the playground', () => {
  assert.equal(ask('Can I try Zappier?').chunks[0].id, 'automation-playground');
});

test('contact and pricing answers retain the established boundaries', () => {
  assert.equal(ask('How can I contact Harold?').chunks[0].id, 'profile-contact');
  const pricing = ask('What are his rates?');
  assert.equal(pricing.chunks[0].id, 'pricing-and-availability');
  assert.match(pricing.reply, /not published/);
});

test('AI instructions preserve certificate and simulation distinctions', () => {
  assert.match(assistantInstructions(), /C1 Advanced listening in a self-assessment/);
  assert.match(assistantInstructions(), /does not send real email/);
});

test('the knowledge-mode API returns the new certificate and gallery notes', async () => {
  const savedKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = '';
  try {
    const { POST } = loadModule('app/api/assistant/route.ts');
    for (const [question, expectedSource] of [['What is his English proficiency?', 'english-listening-certificate'], ['Show me the screenshot gallery', 'project-screenshot-gallery']]) {
      const response = await POST(new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: question }] }) }));
      assert.equal(response.status, 200);
      const answer = await response.json();
      assert.equal(answer.mode, 'knowledge');
      assert.ok(answer.sources.some(source => source.id === expectedSource));
      assert.ok(answer.reply.includes(expectedSource === 'english-listening-certificate' ? certificate.pdf : `${projectScreenshots.length} distinct public screenshots`));
    }
  } finally {
    if (savedKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = savedKey;
  }
});

test('AI-mode API receives current playground reference data without a live provider call', async () => {
  const savedKey = process.env.OPENAI_API_KEY;
  const savedFetch = globalThis.fetch;
  let submitted;
  process.env.OPENAI_API_KEY = 'test-only-key';
  globalThis.fetch = async (_url, options) => {
    submitted = JSON.parse(options.body);
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'The playground uses sample data and does not send real email.' }] }] });
  };
  try {
    const { POST } = loadModule('app/api/assistant/route.ts');
    const response = await POST(new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Does the automation playground send real email?' }] }) }));
    assert.equal(response.status, 200);
    const answer = await response.json();
    assert.equal(answer.mode, 'ai');
    assert.ok(answer.sources.some(source => source.id === 'playground-limits'));
    assert.match(submitted.input[0].content, /does not send real email/);
    assert.match(submitted.instructions, /self-assessment/);
    assert.equal(submitted.store, false);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = savedKey;
  }
});
