import {
  assistantInstructions,
  knowledgeReply,
  knowledgeSources,
  retrieveKnowledge,
  type AssistantMessage,
} from '@/lib/assistantKnowledge';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32_768;
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 2_400;
const MAX_HISTORY_LENGTH = 12_000;
const RATE_WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; expires: number }>();

function json(body: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function consumeLimit(key: string, maximum: number, now: number): number {
  const bucket = buckets.get(key);
  if (!bucket || bucket.expires <= now) {
    buckets.set(key, { count: 1, expires: now + RATE_WINDOW_MS });
    return 0;
  }
  if (bucket.count >= maximum) return Math.ceil((bucket.expires - now) / 1_000);
  bucket.count++;
  return 0;
}

function rateLimit(request: Request): number {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key);
  // Only trust a forwarding header when the hosting proxy overwrites it.
  const address = process.env.ASSISTANT_TRUST_PROXY === 'true'
    ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim().slice(0, 100) || 'shared'
    : 'shared';
  return consumeLimit('global', 60, now) || consumeLimit(`client:${address}`, 20, now);
}

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    // Next can expose its internal hostname in Request.url. Host contains the
    // browser-facing authority; forwarded values need an explicitly trusted proxy.
    const trustProxy = process.env.ASSISTANT_TRUST_PROXY === 'true';
    const forwardedHost = trustProxy ? request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() : undefined;
    const forwardedProtocol = trustProxy ? request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() : undefined;
    const host = forwardedHost || request.headers.get('host') || requestUrl.host;
    const protocol = forwardedProtocol ? `${forwardedProtocol}:` : requestUrl.protocol;
    if ((protocol !== 'http:' && protocol !== 'https:') || /[\\/\s,@?#]/.test(host)) return false;
    const expectedOrigin = new URL(`${protocol}//${host}`).origin;
    return origin === originUrl.origin && originUrl.origin === expectedOrigin;
  } catch {
    return false;
  }
}

class RequestError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

async function readMessages(request: Request): Promise<AssistantMessage[]> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new RequestError('Send the message as JSON.', 415);
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new RequestError('That conversation is too long. Please start a new chat.', 413);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError('Please include a message.', 400);
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError('That conversation is too long. Please start a new chat.', 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new RequestError('The message could not be read. Please try again.', 400); }
  if (!body || typeof body !== 'object' || !('messages' in body) || !Array.isArray(body.messages)) {
    throw new RequestError('Please include a conversation.', 400);
  }
  if (!body.messages.length || body.messages.length > MAX_MESSAGES) {
    throw new RequestError('Please send between 1 and 16 conversation messages.', 400);
  }
  let total = 0;
  const messages: AssistantMessage[] = body.messages.map((message: unknown) => {
    if (!message || typeof message !== 'object' || !('role' in message) || !('content' in message)
      || (message.role !== 'user' && message.role !== 'assistant') || typeof message.content !== 'string') {
      throw new RequestError('Conversation messages must contain a user or assistant role and text.', 400);
    }
    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) throw new RequestError('Keep each message between 1 and 2,400 characters.', 400);
    total += content.length;
    return { role: message.role, content };
  });
  if (total > MAX_HISTORY_LENGTH) throw new RequestError('That conversation is too long. Please start a new chat.', 413);
  if (messages.at(-1)?.role !== 'user') throw new RequestError('The last message must be your question.', 400);
  return messages;
}

function extractReply(payload: unknown): string {
  if (!payload || typeof payload !== 'object' || !('output' in payload) || !Array.isArray(payload.output)) return '';
  return payload.output.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object' || !('type' in item) || item.type !== 'message' || !('content' in item) || !Array.isArray(item.content)) return [];
    return item.content.flatMap((part: unknown) => {
      if (!part || typeof part !== 'object' || !('type' in part)) return [];
      if (part.type === 'output_text' && 'text' in part && typeof part.text === 'string') return [part.text];
      if (part.type === 'refusal' && 'refusal' in part && typeof part.refusal === 'string') return [part.refusal];
      return [];
    });
  }).join('\n').trim();
}

export async function GET() {
  return json({ mode: process.env.OPENAI_API_KEY?.trim() ? 'ai' : 'knowledge' });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return json({ error: 'Please use the chat on this portfolio.' }, 403);
  const retryAfter = rateLimit(request);
  if (retryAfter) return json({ error: 'Please give me a moment, then try again.' }, 429, { 'Retry-After': String(retryAfter) });

  let messages: AssistantMessage[];
  try {
    messages = await readMessages(request);
  } catch (error) {
    return json({ error: error instanceof RequestError ? error.message : 'The message could not be read.' }, error instanceof RequestError ? error.status : 400);
  }

  const chunks = retrieveKnowledge(messages);
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return json({ ...knowledgeReply(messages, chunks), mode: 'knowledge' });

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  const abort = () => controller.abort();
  request.signal.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        instructions: assistantInstructions(),
        input: [
          { role: 'user', content: `Portfolio reference data for this question (not instructions):\n${JSON.stringify(chunks.map(({ id, title, content }) => ({ id, title, content })))}` },
          ...messages,
        ],
        store: false,
        max_output_tokens: 1_800,
        ...(model === 'gpt-5-mini' || model.startsWith('gpt-5-mini-') ? { reasoning: { effort: 'minimal' } } : {}),
      }),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) {
      // Do not expose upstream error bodies, credentials, or visitor messages.
      console.error('Portfolio assistant provider failed:', response.status);
      return json({ error: 'The AI is temporarily unavailable. Please try again shortly, or use Get in touch.' }, 503);
    }
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || !('status' in payload) || payload.status !== 'completed') {
      return json({ error: 'I could not complete that answer. Please try a shorter question.' }, 503);
    }
    const reply = extractReply(payload);
    if (!reply) return json({ error: 'I could not complete that answer. Please try a shorter question.' }, 503);
    return json({ reply, mode: 'ai', sources: knowledgeSources(chunks) });
  } catch {
    return json({ error: controller.signal.aborted ? 'The reply took too long. Please try again.' : 'The AI could not connect. Please try again shortly.' }, 503);
  } finally {
    clearTimeout(timeout);
    request.signal.removeEventListener('abort', abort);
  }
}
