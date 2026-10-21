'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CircleHelp, Database, Filter, GripVertical, Mail, Play, Plus, RotateCcw, Square, Table2, Tag, Trash2, Webhook, X } from 'lucide-react';
import { connectionError, nodeTypes, platforms, simulateWorkflow, starterWorkflow, type NodeKind, type Platform, type SampleLead, type StepResult, type WorkflowNode } from '@/lib/automationPlayground';
import styles from './AutomationPlayground.module.css';

const icons = { trigger: Webhook, filter: Filter, tag: Tag, email: Mail, crm: Database, sheet: Table2 };
const WIDTH = 1100, HEIGHT = 660, NODE_WIDTH = 190, NODE_HEIGHT = 88;
const initial = starterWorkflow('n8n');

export default function AutomationPlayground() {
  const [platform, setPlatform] = useState<Platform>('n8n');
  const [nodes, setNodes] = useState(initial.nodes);
  const [edges, setEdges] = useState(initial.edges);
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [input, setInput] = useState<SampleLead>({ name: 'Alex Rivera', email: 'alex@example.com', score: 75, tags: [] });
  const [results, setResults] = useState<StepResult[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState('Starter workflow loaded. Try running it, or make it your own.');
  const [zoom, setZoom] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const canvas = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const runToken = useRef(0);
  const sequence = useRef(10);
  const drag = useRef<{ id: string; pointer: number; x: number; y: number; startX: number; startY: number } | null>(null);
  const current = nodes.find(node => node.id === selected);
  const vertical = platform === 'ghl' || platform === 'zapier';

  useEffect(() => () => { runToken.current++; }, []);
  useEffect(() => {
    const element = viewport.current;
    if (element) element.scrollTo({ left: vertical ? Math.max(0, 505 * zoom - element.clientWidth / 2) : 0, top: 0, behavior: 'instant' });
  }, [platform, vertical, zoom]);

  function invalidate() { setResults([]); setActive(null); }

  function reset(next: Platform = platform, empty = false) {
    runToken.current++;
    const starter = starterWorkflow(next);
    setPlatform(next); setNodes(empty ? starter.nodes.slice(0, 1) : starter.nodes); setEdges(empty ? [] : starter.edges);
    setSelected(null); setConnecting(null); setFrom(''); setTo(''); setRunning(false); invalidate();
    setNotice(empty ? 'Canvas cleared. Add a step and connect it to the trigger.' : `${platforms.find(item => item.id === next)?.name} starter loaded.`);
  }

  function connect(source: string, target: string) {
    if (running) return;
    const error = connectionError(nodes, edges, source, target);
    if (error) { setNotice(error); return; }
    setEdges(items => [...items, { from: source, to: target }]); setConnecting(null); invalidate();
    setNotice(`Connected ${nodes.find(node => node.id === source)?.label} to ${nodes.find(node => node.id === target)?.label}.`);
  }

  function add(kind: NodeKind) {
    if (running) return;
    if (nodes.length >= 16) { setNotice('This playground supports up to 16 nodes. Remove a step to add another.'); return; }
    const id = `custom-${sequence.current++}`;
    const node: WorkflowNode = { id, kind, label: nodeTypes[kind].title, value: nodeTypes[kind].defaultValue, x: 90 + (nodes.length % 4) * 245, y: 80 + Math.floor(nodes.length / 4) * 140 };
    setNodes(items => [...items, node]); setSelected(id); invalidate(); setNotice(`Added ${node.label}. Connect an output port to its input port.`);
    const element = viewport.current;
    if (element) element.scrollTo({ left: Math.max(0, (node.x + NODE_WIDTH / 2) * zoom - element.clientWidth / 2), top: Math.max(0, node.y * zoom - 100), behavior: 'instant' });
  }

  function removeNode(id: string) {
    if (running || nodes.find(node => node.id === id)?.kind === 'trigger') return;
    setNodes(items => items.filter(node => node.id !== id)); setEdges(items => items.filter(edge => edge.from !== id && edge.to !== id));
    setSelected(null); if (connecting === id) setConnecting(null); invalidate(); setNotice('Node and its connections removed.');
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, node: WorkflowNode) {
    if (running) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: node.id, pointer: event.pointerId, x: node.x, y: node.y, startX: event.clientX, startY: event.clientY };
  }
  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const movement = drag.current;
    if (!movement || movement.pointer !== event.pointerId) return;
    const x = Math.min(WIDTH - NODE_WIDTH - 12, Math.max(12, movement.x + (event.clientX - movement.startX) / zoom));
    const y = Math.min(HEIGHT - NODE_HEIGHT - 12, Math.max(12, movement.y + (event.clientY - movement.startY) / zoom));
    setNodes(items => items.map(node => node.id === movement.id ? { ...node, x, y } : node));
  }

  async function run() {
    if (running) return;
    let steps: StepResult[];
    try { steps = simulateWorkflow(nodes, edges, input); } catch (error) { setNotice(error instanceof Error ? error.message : 'Check your connections.'); return; }
    const token = ++runToken.current;
    setRunning(true); setResults([]); setSelected(null); setConnecting(null); setNotice('Running with sample data…');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const step of steps) {
      if (token !== runToken.current) return;
      setActive(step.id);
      await new Promise(resolve => window.setTimeout(resolve, reduced ? 50 : 550));
      if (token !== runToken.current) return;
      setResults(items => [...items, step]);
    }
    setActive(null); setRunning(false);
    setNotice(`Run complete: ${steps.filter(step => step.status === 'success').length} completed, ${steps.filter(step => step.status === 'skipped').length} skipped. Previews only; no messages were sent.`);
  }

  function stop() { runToken.current++; setRunning(false); setActive(null); setNotice('Run stopped. You can edit the workflow or run it again.'); }

  function portPosition(node: WorkflowNode, output: boolean) {
    return vertical ? { x: node.x + NODE_WIDTH / 2, y: node.y + (output ? NODE_HEIGHT : 0) } : { x: node.x + (output ? NODE_WIDTH : 0), y: node.y + NODE_HEIGHT / 2 };
  }

  return (
    <div className={styles.page} data-platform={platform}>
      <header className={styles.heading}>
        <Link href="/projects" className={styles.back}><ArrowLeft size={14} /> Back to projects</Link>
        <p className={styles.eyebrow}>The automation playground</p>
        <h1>Less repetition.<br /><em>More possibility.</em></h1>
        <p className={styles.intro}>Build a little workflow. Connect the dots. See what happens.</p>
        <p className={styles.disclaimer}>An interactive portfolio simulation inspired by four automation tools. Runs use sample data in your browser.</p>
      </header>
      <div className={styles.platforms} role="group" aria-label="Automation builder style">
        {platforms.map(item => <button key={item.id} type="button" aria-pressed={platform === item.id} onClick={() => reset(item.id)}><span className={styles.platformDot} data-brand={item.id} />{item.name}<small>{platform === item.id ? 'Selected' : 'Try this view'}</small></button>)}
      </div>
      <div className={styles.workspace}>
        <div className={styles.topbar}><div><strong>{platforms.find(item => item.id === platform)?.name} inspired builder</strong><span>{platforms.find(item => item.id === platform)?.description}</span></div><div className={styles.topActions}><button type="button" onClick={() => reset()}><RotateCcw size={14} /> Reset</button><button type="button" className={styles.run} onClick={running ? stop : run}>{running ? <Square size={14} /> : <Play size={14} />}{running ? 'Stop run' : 'Run workflow'}</button></div></div>
        <div className={styles.builder}>
          <aside className={styles.sidebar}>
            <p className={styles.eyebrow}>Add a step</p>
            <div className={styles.palette}>{(Object.keys(nodeTypes) as NodeKind[]).filter(kind => kind !== 'trigger').map(kind => { const Icon = icons[kind]; return <button key={kind} type="button" disabled={running} onClick={() => add(kind)}><Icon size={17} /><span>{nodeTypes[kind].title}<small>{nodeTypes[kind].subtitle}</small></span><Plus size={13} /></button>; })}</div>
            <fieldset disabled={running} className={styles.sample}><legend>Sample lead</legend><label>Name<input value={input.name} maxLength={80} onChange={event => { setInput(data => ({ ...data, name: event.target.value })); invalidate(); }} /></label><label>Email<input type="email" value={input.email} maxLength={120} onChange={event => { setInput(data => ({ ...data, email: event.target.value })); invalidate(); }} /></label><label>Lead score<input type="number" min="0" max="100" value={Number.isNaN(input.score) ? '' : input.score} onChange={event => { setInput(data => ({ ...data, score: event.target.valueAsNumber })); invalidate(); }} /></label></fieldset>
          </aside>
          <div className={styles.canvasArea}>
            <div className={styles.canvasHelp}><span><CircleHelp size={14} /> Drag a grip to move. Click an output, then an input, to connect.</span><label>Zoom<select aria-label="Canvas zoom" value={zoom} onChange={event => setZoom(Number(event.target.value))}><option value="0.65">65%</option><option value="0.8">80%</option><option value="1">100%</option><option value="1.2">120%</option></select></label></div>
            <div ref={viewport} className={styles.viewport} tabIndex={0} role="region" aria-label="Workflow canvas. Scroll to see all nodes.">
              <div style={{ width: WIDTH * zoom, height: HEIGHT * zoom }}>
                <div ref={canvas} className={styles.canvas} style={{ width: WIDTH, height: HEIGHT, transform: `scale(${zoom})` }}>
                  <svg className={styles.wires} width={WIDTH} height={HEIGHT} aria-hidden="true">{edges.map(edge => {
                    const source = nodes.find(node => node.id === edge.from), target = nodes.find(node => node.id === edge.to);
                    if (!source || !target) return null;
                    const a = portPosition(source, true), b = portPosition(target, false);
                    const path = vertical ? `M${a.x},${a.y} C${a.x},${a.y + 65} ${b.x},${b.y - 65} ${b.x},${b.y}` : `M${a.x},${a.y} C${a.x + 65},${a.y} ${b.x - 65},${b.y} ${b.x},${b.y}`;
                    return <path key={`${edge.from}-${edge.to}`} d={path} data-complete={results.some(result => result.id === edge.from && result.status === 'success')} data-active={active === edge.to} />;
                  })}</svg>
                  {nodes.map((node, index) => {
                    const Icon = icons[node.kind]; const result = results.find(item => item.id === node.id);
                    return <div key={node.id} className={styles.node} data-kind={node.kind} data-selected={selected === node.id} data-status={active === node.id ? 'running' : result?.status ?? 'idle'} style={{ left: node.x, top: node.y, '--step': index + 1 } as CSSProperties}>
                      <button type="button" className={styles.grip} disabled={running} aria-label={`Move ${node.label}. Use arrow keys when focused.`} onPointerDown={event => startDrag(event, node)} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={event => {
                        const direction = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[event.key];
                        if (!direction) return; event.preventDefault(); setNodes(items => items.map(item => item.id === node.id ? { ...item, x: Math.max(12, Math.min(WIDTH - NODE_WIDTH - 12, item.x + direction[0])), y: Math.max(12, Math.min(HEIGHT - NODE_HEIGHT - 12, item.y + direction[1])) } : item));
                      }}><GripVertical size={12} /></button>
                      <button type="button" className={styles.nodeBody} onClick={() => setSelected(node.id)} aria-label={`Configure ${node.label}`}><span className={styles.nodeIcon}><Icon size={21} /></span><span><strong>{node.label}</strong><small>{active === node.id ? 'Running…' : result?.status === 'success' ? 'Completed' : result?.status === 'skipped' ? 'Skipped' : nodeTypes[node.kind].subtitle}</small></span>{result?.status === 'success' && <Check size={13} />}</button>
                      {node.kind !== 'trigger' && <button type="button" className={`${styles.port} ${styles.inputPort}`} disabled={running} aria-label={`Input: ${node.label}`} data-ready={!!connecting} onClick={() => connecting ? connect(connecting, node.id) : setNotice('Choose an output port first, then click this input.')} />}
                      <button type="button" className={`${styles.port} ${styles.outputPort}`} disabled={running} aria-label={`Output: ${node.label}`} aria-pressed={connecting === node.id} onClick={() => { setConnecting(connecting === node.id ? null : node.id); setNotice(connecting === node.id ? 'Connection cancelled.' : `Output selected: ${node.label}. Now choose an input port.`); }} />
                    </div>;
                  })}
                </div>
              </div>
            </div>
            <div className={styles.canvasFooter}><span>{nodes.length} nodes · {edges.length} connections</span>{connecting && <button type="button" onClick={() => { setConnecting(null); setNotice('Connection cancelled.'); }}>Cancel connection <X size={12} /></button>}<button type="button" disabled={running} onClick={() => reset(platform, true)}><Trash2 size={12} /> Clear canvas</button></div>
          </div>
        </div>
        <p className={styles.notice} role="status">{notice}</p>
        <div className={styles.bottomGrid}>
          <section className={styles.configuration} aria-labelledby="configure-title">
            <h2 id="configure-title">{current ? 'Step settings' : 'Connect your steps'}</h2>
            {current ? <fieldset disabled={running}><label>Step name<input value={current.label} maxLength={40} onChange={event => { setNodes(items => items.map(node => node.id === current.id ? { ...node, label: event.target.value } : node)); invalidate(); }} /></label>{current.kind !== 'trigger' ? <label>{nodeTypes[current.kind].field}<input value={current.value} maxLength={160} type={current.kind === 'filter' ? 'number' : 'text'} min={current.kind === 'filter' ? 0 : undefined} max={current.kind === 'filter' ? 100 : undefined} onChange={event => { setNodes(items => items.map(node => node.id === current.id ? { ...node, value: event.target.value } : node)); invalidate(); }} /></label> : <p>The trigger receives the sample lead entered above.</p>}<div className={styles.inlineActions}><button type="button" onClick={() => setSelected(null)}>Done</button>{current.kind !== 'trigger' && <button type="button" onClick={() => removeNode(current.id)}><Trash2 size={13} /> Remove step</button>}</div></fieldset> : <><p>Use the ports on the canvas, or choose two steps below. Click any node to edit its settings.</p><form onSubmit={event => { event.preventDefault(); connect(from, to); }}><label>From<select value={from} disabled={running} onChange={event => setFrom(event.target.value)}><option value="">Choose an output</option>{nodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label><label>To<select value={to} disabled={running} onChange={event => setTo(event.target.value)}><option value="">Choose an input</option>{nodes.filter(node => node.kind !== 'trigger').map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label><button type="submit" disabled={running || !from || !to}><Plus size={13} /> Connect steps</button></form></>}
            <h3>Connections</h3><ul className={styles.edgeList}>{edges.map(edge => <li key={`${edge.from}-${edge.to}`}><span>{nodes.find(node => node.id === edge.from)?.label} → {nodes.find(node => node.id === edge.to)?.label}</span><button type="button" disabled={running} aria-label={`Remove connection ${edge.from} to ${edge.to}`} onClick={() => { setEdges(items => items.filter(item => item !== edge)); invalidate(); setNotice('Connection removed.'); }}><X size={13} /></button></li>)}</ul>{edges.length === 0 && <p>No connections yet.</p>}
          </section>
          <section className={styles.execution} aria-labelledby="execution-title"><h2 id="execution-title">Run log <span>Simulation</span></h2>{results.length === 0 && <div className={styles.empty}><Play size={24} /><p>Ready when you are.</p><small>Run the workflow to see each step&apos;s output here.</small></div>}<ol aria-live="polite">{results.map(result => <li key={result.id} data-status={result.status}><span>{result.status === 'success' ? <Check size={13} /> : '—'}</span><div><strong>{nodes.find(node => node.id === result.id)?.label}</strong><p>{result.message}</p></div></li>)}</ol>{results.length > 0 && !running && <details><summary>Inspect final sample data</summary><pre>{JSON.stringify(results.filter(result => result.data).at(-1)?.data ?? input, null, 2)}</pre></details>}</section>
        </div>
      </div>
      <p className={styles.footnote}>Inspired interfaces for learning and exploration. No accounts, credentials, or live integrations are connected. Switching tools loads that tool&apos;s starter workflow.</p>
    </div>
  );
}
