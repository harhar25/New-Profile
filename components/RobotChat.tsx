'use client';

import { ArrowUpRight, Bot, RotateCcw, Send, Square } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { orbitActions, validActions, validFollowUps } from '@/lib/orbitActions';
import { boundedMessages, ORBIT_SESSION_KEY, requestHistory, restoreSession, serializeSession, type OrbitMessage } from '@/lib/orbitSession';
import styles from './RobotChat.module.css';

type Mode = 'ai' | 'knowledge';
const greeting: OrbitMessage = { role: 'assistant', content: "Hi, I’m Orbit. Tell me what you’re working on, ask about Harold, or explore an idea with me. I can help you find examples and turn a workflow question into a starting plan." };
const starters = ['Help me plan an automation', 'Show me Harold’s projects', 'What can you help me with?'];

export default function RobotChat({ onContact, onThinkingChange }: { onContact: () => void; onThinkingChange: (thinking: boolean) => void }) {
  const [messages, setMessages] = useState<OrbitMessage[]>([greeting]);
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<Mode>('knowledge');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [restored, setRestored] = useState(false);
  const request = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = restoreSession(sessionStorage.getItem(ORBIT_SESSION_KEY));
        if (saved.length) {
          setMessages([greeting, ...saved]);
          if (saved.at(-1)?.role === 'user') setError('Your last reply was interrupted. Retry it or ask something else.');
        }
      } catch {}
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      if (messages.length > 1) sessionStorage.setItem(ORBIT_SESSION_KEY, serializeSession(messages.slice(1)));
      else sessionStorage.removeItem(ORBIT_SESSION_KEY);
    } catch {}
  }, [messages, restored]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/assistant', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.mode === 'ai') setMode('ai'); })
      .catch(() => {});
    return () => { controller.abort(); request.current?.abort(); };
  }, []);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy, error]);

  async function send(content: string, retry = false) {
    const text = content.trim();
    if (!text || busy || request.current) return;
    const history = retry ? messages.slice(1) : [...messages.slice(1), { role: 'user' as const, content: text }];
    const recent = requestHistory(history);
    if (!retry) setMessages((previous) => [greeting, ...boundedMessages([...previous.slice(1), { role: 'user', content: text }])]);
    setDraft('');
    setError('');
    setNotice('');
    setBusy(true);
    onThinkingChange(true);
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recent }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || typeof data.reply !== 'string') throw new Error(data.error || 'I couldn’t finish that answer. Please try again.');
      setMode(data.mode === 'ai' ? 'ai' : 'knowledge');
      const sources = Array.isArray(data.sources) ? data.sources.filter((source: { id?: unknown; title?: unknown }) => typeof source?.id === 'string' && typeof source?.title === 'string').slice(0, 5) : [];
      setMessages((previous) => [greeting, ...boundedMessages([...previous.slice(1), { role: 'assistant', content: data.reply, sources, actions: validActions(data.actions), followUps: validFollowUps(data.followUps) }])]);
      setNotice(typeof data.notice === 'string' ? data.notice : '');
    } catch (cause) {
      if (controller.signal.aborted) setError('Response stopped. You can retry or ask something else.');
      else setError(cause instanceof Error ? cause.message : 'Something interrupted our conversation. Please try again.');
    } finally {
      request.current = null;
      setBusy(false);
      onThinkingChange(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(draft);
    }
  }

  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
  const suggestions = messages.length === 1 ? starters : lastAssistant?.followUps ?? [];

  return (
    <section className={styles.chat} aria-label="Conversation with Orbit">
      <div className={styles.header}>
        <span className={styles.botIcon}><Bot size={17} strokeWidth={1.5} /></span>
        <div><strong>Orbit</strong><span>{mode === 'ai' ? 'AI conversation · remembers this tab' : 'Portfolio guide · remembers this tab'}</span></div>
        <button type="button" className={styles.reset} disabled={busy || messages.length === 1} aria-label="Start a new conversation" title="Clear this conversation" onClick={() => { setMessages([greeting]); setError(''); setNotice(''); setDraft(''); try { sessionStorage.removeItem(ORBIT_SESSION_KEY); } catch {} input.current?.focus(); }}><RotateCcw size={14} /></button>
      </div>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      <div ref={log} className={styles.log} role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions" tabIndex={0}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
            <span className={styles.speaker}>{message.role === 'user' ? 'You' : 'Orbit'}</span>
            <p>{message.content}</p>
            {!!message.actions?.length && <div className={styles.actions} role="group" aria-label="Suggested next steps">{message.actions.map(id => {
              const action = orbitActions[id];
              if (action.kind === 'contact') return <button key={id} type="button" onClick={onContact}>{action.label}<ArrowUpRight size={12} aria-hidden="true" /></button>;
              if (action.kind === 'link') return <Link key={id} href={action.href}>{action.label}<ArrowUpRight size={12} aria-hidden="true" /></Link>;
              return <a key={id} href={action.href} target={action.kind === 'external' ? '_blank' : undefined} rel={action.kind === 'external' ? 'noopener noreferrer' : undefined} download={action.kind === 'download' || undefined}>{action.label}<ArrowUpRight size={12} aria-hidden="true" /></a>;
            })}</div>}
            {!!message.sources?.length && <details className={styles.sources}><summary>Portfolio references</summary><div>{message.sources.map((source) => <span key={source.id}>{source.title}</span>)}</div></details>}
          </div>
        ))}
        {busy && <p className={styles.thinking} role="status"><span /><span /><span /><span className="sr-only">Orbit is thinking</span></p>}
        {error && <div className={styles.error} role="alert"><p>{error}</p>{lastUserMessage && <button type="button" onClick={() => void send(lastUserMessage.content, true)}>Try again</button>}</div>}
      </div>
      {!!suggestions.length && !error && <div className={styles.starters} aria-label="Suggested questions">{suggestions.map((starter) => <button key={starter} type="button" disabled={busy || !restored} onClick={() => void send(starter)}>{starter}<ArrowUpRight size={11} aria-hidden="true" /></button>)}</div>}
      <form onSubmit={submit} className={styles.composer}>
        <label htmlFor="orbit-message" className="sr-only">Your message to Orbit</label>
        <textarea id="orbit-message" ref={input} rows={2} value={draft} maxLength={2000} disabled={!restored} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask a question, or tell me your idea…" autoComplete="off" />
        {busy ? <button type="button" className={styles.send} onClick={() => request.current?.abort()} aria-label="Stop response"><Square size={13} /></button> : <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Send message"><Send size={15} /></button>}
      </form>
      <div className={styles.footer}><span>{mode === 'ai' ? 'AI can make mistakes. ' : 'Guided replies. '}Chat stays in this tab; ↻ clears it.</span><button type="button" onClick={onContact}>Talk to Harold <ArrowUpRight size={12} /></button></div>
    </section>
  );
}
