'use client';

import { ArrowUpRight, Bot, RotateCcw, Send, Square } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import styles from './RobotChat.module.css';

type Message = { role: 'user' | 'assistant'; content: string; sources?: { id: string; title: string }[] };
type Mode = 'ai' | 'knowledge';
const greeting: Message = { role: 'assistant', content: "Hi, I’m Orbit. Ask me about Harold’s work, his services, or an idea you’d like to explore." };
const starters = ['What can Harold help with?', 'Show me his projects', 'How do we get started?'];

export default function RobotChat({ onContact, onThinkingChange }: { onContact: () => void; onThinkingChange: (thinking: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<Mode>('knowledge');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

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
    const recent = history.slice(-10).map(({ role, content }) => ({ role, content: content.slice(0, 2400) }));
    while (recent.length > 1 && recent.reduce((length, message) => length + message.content.length, 0) > 11000) recent.shift();
    if (!retry) setMessages((previous) => [...previous, { role: 'user', content: text }]);
    setDraft('');
    setError('');
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
      setMessages((previous) => [...previous, { role: 'assistant', content: data.reply, sources: Array.isArray(data.sources) ? data.sources : [] }]);
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

  return (
    <section className={styles.chat} aria-label="Conversation with Orbit">
      <div className={styles.header}>
        <span className={styles.botIcon}><Bot size={17} strokeWidth={1.5} /></span>
        <div><strong>Orbit</strong><span>{mode === 'ai' ? 'AI portfolio assistant' : 'Portfolio guide · answers from saved notes'}</span></div>
        <button type="button" className={styles.reset} disabled={busy || messages.length === 1} aria-label="Start a new conversation" title="New conversation" onClick={() => { setMessages([greeting]); setError(''); setDraft(''); input.current?.focus(); }}><RotateCcw size={14} /></button>
      </div>
      <div ref={log} className={styles.log} role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions" tabIndex={0}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
            <span className={styles.speaker}>{message.role === 'user' ? 'You' : 'Orbit'}</span>
            <p>{message.content}</p>
            {!!message.sources?.length && <div className={styles.sources} aria-label="Answer sources">{message.sources.map((source) => <span key={source.id}>{source.title}</span>)}</div>}
          </div>
        ))}
        {busy && <p className={styles.thinking} role="status"><span /><span /><span /><span className="sr-only">Orbit is thinking</span></p>}
        {error && <div className={styles.error} role="alert"><p>{error}</p>{lastUserMessage && <button type="button" onClick={() => void send(lastUserMessage.content, true)}>Try again</button>}</div>}
      </div>
      {messages.length === 1 && <div className={styles.starters} aria-label="Suggested questions">{starters.map((starter) => <button key={starter} type="button" disabled={busy} onClick={() => void send(starter)}>{starter}<ArrowUpRight size={11} /></button>)}</div>}
      <form onSubmit={submit} className={styles.composer}>
        <label htmlFor="orbit-message" className="sr-only">Your message to Orbit</label>
        <textarea id="orbit-message" ref={input} rows={2} value={draft} maxLength={2000} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask Orbit a question…" autoComplete="off" />
        {busy ? <button type="button" className={styles.send} onClick={() => request.current?.abort()} aria-label="Stop response"><Square size={13} /></button> : <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Send message"><Send size={15} /></button>}
      </form>
      <div className={styles.footer}><span>{mode === 'ai' ? 'AI answers can make mistakes.' : 'Answers are excerpts from Harold’s portfolio.'}</span><button type="button" onClick={onContact}>Talk to Harold <ArrowUpRight size={12} /></button></div>
    </section>
  );
}
