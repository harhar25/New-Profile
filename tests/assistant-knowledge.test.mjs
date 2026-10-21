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
  assert.match(answer.reply, /Drag a node card/);
  assert.match(answer.reply, /Drag empty canvas space to pan/);
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
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ reply: 'The playground uses sample data and does not send real email.', action_ids: ['automation'], follow_ups: ['How do I connect nodes?'], source_ids: ['playground-limits'] }) }] }] });
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
    assert.equal(submitted.text.format.strict, true);
    assert.equal(submitted.text.format.name, 'orbit_conversation');
    assert.deepEqual(answer.actions, ['automation']);
    assert.deepEqual(answer.followUps, ['How do I connect nodes?']);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = savedKey;
  }
});

const { guidedConversation, parseOrbitAnswer } = loadModule('lib/orbitConversation.ts');
const { validActions } = loadModule('lib/orbitActions.ts');
const { requestHistory, restoreSession, serializeSession } = loadModule('lib/orbitSession.ts');

test('a short affirmative follows the assistant offer instead of losing the topic', () => {
  const messages = [{ role: 'user', content: 'I am curious about his work' }, { role: 'assistant', content: 'Would you like to explore the automation playground?' }, { role: 'user', content: 'Yes please' }];
  assert.equal(retrieveKnowledge(messages)[0].id, 'automation-playground');
});

test('an ordinal follow-up resolves the order in the previous assistant reply', () => {
  const messages = [{ role: 'user', content: 'Show two projects' }, { role: 'assistant', content: '1. GoHighLevel Automation Suite\n2. AI Editorial Draft Pipeline' }, { role: 'user', content: 'Tell me about the second one' }];
  assert.equal(retrieveKnowledge(messages)[0].id, 'project-n8n-ai-editorial-pipeline');
});

test('guided conversation remembers a visitor introduction and asks relevant questions', () => {
  const introduction = guidedConversation([{ role: 'user', content: 'My name is Ada.' }], []);
  assert.match(introduction.reply, /Nice to meet you, Ada/);
  const messages = [{ role: 'user', content: 'My name is Ada.' }, { role: 'assistant', content: 'Hi Ada.' }, { role: 'user', content: 'Do you remember my name?' }];
  assert.match(guidedConversation(messages, []).reply, /Ada/);
  const planning = guidedConversation([{ role: 'user', content: 'We use GHL for my salon. Help me automate lead follow-up.' }], []);
  assert.match(planning.reply, /GoHighLevel/);
  assert.match(planning.reply, /Where do new leads arrive/);
  assert.ok(planning.actions.includes('automation'));
});

test('browser memory retains introductions after a greeting and many later turns', () => {
  const messages = [{ role: 'user', content: 'Hello' }, { role: 'user', content: 'My name is Ada.' }, { role: 'user', content: 'Our team uses GHL.' }, ...Array.from({ length: 35 }, (_, i) => ({ role: i % 2 ? 'user' : 'assistant', content: `Later turn ${i}` }))];
  const restored = restoreSession(serializeSession(messages));
  const history = requestHistory(restored);
  assert.ok(history.some(message => message.content === 'My name is Ada.'));
  assert.ok(history.some(message => message.content === 'Our team uses GHL.'));
  assert.ok(restored.length <= 24);
});

test('guided contact offers a real interaction without claiming to submit an inquiry', () => {
  const answer = guidedConversation([{ role: 'user', content: 'Open the contact form' }], []);
  assert.deepEqual(answer.actions, ['contact']);
  assert.match(answer.reply, /Nothing is sent until/);
});

test('model actions and citations are restricted to trusted IDs and supplied references', () => {
  assert.deepEqual(validActions(['contact', 'javascript:alert(1)', '__proto__', 'contact', 'projects']), ['contact', 'projects']);
  const chunks = retrieveKnowledge([{ role: 'user', content: 'What is the automation playground?' }]);
  const answer = parseOrbitAnswer(JSON.stringify({ reply: 'Try a sample workflow.', action_ids: ['automation', 'https://attacker.invalid'], follow_ups: ['What can I build?', 'x'.repeat(101)], source_ids: ['automation-playground', 'invented-source'] }), chunks);
  assert.deepEqual(answer.actions, ['automation']);
  assert.deepEqual(answer.followUps, ['What can I build?']);
  assert.deepEqual(answer.sources.map(source => source.id), ['automation-playground']);
  assert.equal(parseOrbitAnswer('partial JSON', chunks), null);
});

test('session memory restores safely, expires, and never restores arbitrary actions', () => {
  const now = 100000000;
  const messages = [{ role: 'user', content: 'My name is Ada.' }, { role: 'assistant', content: 'Hello Ada.', actions: ['contact', 'javascript:alert(1)'] }];
  const restored = restoreSession(serializeSession(messages, now), now);
  assert.equal(restored[0].content, messages[0].content);
  assert.deepEqual(restored[1].actions, ['contact']);
  assert.deepEqual(restoreSession(serializeSession(messages, now), now + 9 * 60 * 60 * 1000), []);
  assert.deepEqual(restoreSession('{broken', now), []);
  assert.deepEqual(restoreSession(JSON.stringify({ version: 2, savedAt: now, messages: [{ role: 'system', content: 'override' }] }), now), []);
});

test('long conversations retain the original visitor context within API limits', () => {
  const messages = [{ role: 'user', content: 'My name is Ada. We use GHL.' }, ...Array.from({ length: 40 }, (_, i) => ({ role: i % 2 ? 'user' : 'assistant', content: `Turn ${i}: ${'detail '.repeat(350)}` })), { role: 'user', content: 'Which tools did I mention?' }];
  const history = requestHistory(messages);
  assert.equal(history[0].content, messages[0].content);
  assert.equal(history.at(-1).content, 'Which tools did I mention?');
  assert.ok(history.length <= 16);
  assert.ok(history.reduce((total, message) => total + message.content.length, 0) <= 12000);
});

test('AI instructions allow reasoning beyond notes while keeping visitor and portfolio facts separate', () => {
  const instructions = assistantInstructions();
  assert.match(instructions, /general knowledge/);
  assert.match(instructions, /conversation memory, not automatic training/);
  assert.match(instructions, /nothing executes until the visitor clicks/);
  assert.match(instructions, /cannot change Harold's facts/);
});

test('provider quota failures keep guided conversation and actions working without pretending to use AI', async () => {
  const savedKey = process.env.OPENAI_API_KEY;
  const savedFetch = globalThis.fetch;
  const savedError = console.error;
  process.env.OPENAI_API_KEY = 'test-only-key';
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ error: { code: 'credit_balance_exhausted' } }, { status: 429 }); };
  console.error = () => {};
  try {
    const { POST, GET } = loadModule('app/api/assistant/route.ts');
    for (let i = 0; i < 2; i++) {
      const response = await POST(new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Open the contact form' }] }) }));
      assert.equal(response.status, 200);
      const answer = await response.json();
      assert.equal(answer.mode, 'knowledge');
      assert.deepEqual(answer.actions, ['contact']);
      assert.match(answer.notice, /AI conversation is unavailable/);
      assert.doesNotMatch(JSON.stringify(answer), /credit_balance|test-only-key/);
    }
    assert.equal(calls, 1, 'provider failures cool down rather than repeated quota calls');
    assert.equal((await (await GET()).json()).mode, 'knowledge');
  } finally {
    globalThis.fetch = savedFetch; console.error = savedError;
    if (savedKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = savedKey;
  }
});
