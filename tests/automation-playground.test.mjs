import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/automationPlayground.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } });
const engine = {};
new Function('exports', compiled.outputText)(engine);
const { connectionError, simulateWorkflow, starterWorkflow, platforms } = engine;
const lead = { name: 'Alex', email: 'alex@example.com', score: 75, tags: [] };

for (const platform of platforms) {
  test(`${platform.name} starter executes every step and preserves input`, () => {
    const { nodes, edges } = starterWorkflow(platform.id);
    const results = simulateWorkflow(nodes, edges, lead);
    assert.equal(results.length, 4);
    assert.ok(results.every(result => result.status === 'success'));
    assert.ok(results.some(result => result.data.tags.includes('Qualified lead')));
    assert.deepEqual(lead.tags, []);
  });
}

test('score filter stops only its descendants while another branch runs', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  nodes.push({ id: 'branch', kind: 'sheet', label: 'Record all leads', value: 'All leads', x: 0, y: 0 });
  edges.push({ from: nodes[0].id, to: 'branch' });
  const results = simulateWorkflow(nodes, edges, { ...lead, score: 20 });
  assert.equal(results.filter(result => result.status === 'skipped').length, 3);
  assert.equal(results.find(result => result.id === 'branch').status, 'success');
});

test('connection validation rejects loops, duplicate inputs, and trigger inputs', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  assert.match(connectionError(nodes, [], nodes[0].id, nodes[0].id), /itself/);
  assert.match(connectionError(nodes, edges, nodes[3].id, nodes[0].id), /trigger/);
  assert.match(connectionError(nodes, edges, nodes[0].id, nodes[1].id), /already connected/);
  assert.match(connectionError(nodes, edges, nodes[0].id, nodes[2].id), /already has an input/);
  assert.match(connectionError(nodes, edges.slice(1), nodes[3].id, nodes[1].id), /loop/);
});

test('disconnected nodes and invalid sample inputs cannot run', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  assert.throws(() => simulateWorkflow(nodes, edges.slice(1), lead), /Connect every node/);
  assert.throws(() => simulateWorkflow(nodes, edges, { ...lead, email: 'invalid' }), /valid sample email/);
  assert.throws(() => simulateWorkflow(nodes, edges, { ...lead, score: NaN }), /between 0 and 100/);
  assert.throws(() => simulateWorkflow(nodes, edges, { ...lead, score: 101 }), /between 0 and 100/);
});

test('a filter accepts its exact threshold and rejects invalid settings', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  assert.ok(simulateWorkflow(nodes, edges, { ...lead, score: 50 }).every(result => result.status === 'success'));
  nodes[1].value = 'invalid';
  assert.throws(() => simulateWorkflow(nodes, edges, lead), /Filter minimum/);
});

test('email previews interpolate names and tags are not duplicated', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  const results = simulateWorkflow(nodes, edges, { ...lead, tags: ['Qualified lead'] });
  assert.match(results.at(-1).message, /Welcome, Alex!/);
  assert.deepEqual(results.at(-1).data.tags, ['Qualified lead']);
});

test('node order in the canvas does not determine execution order', () => {
  const { nodes, edges } = starterWorkflow('n8n');
  const results = simulateWorkflow([...nodes].reverse(), edges, lead);
  assert.deepEqual(results.map(result => result.id), nodes.map(node => node.id));
});
