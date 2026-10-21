import type { AssistantMessage, AssistantSource } from './assistantKnowledge';
import { validActions, validFollowUps, type OrbitActionId } from './orbitActions';

export type OrbitMessage = AssistantMessage & { sources?: AssistantSource[]; actions?: OrbitActionId[]; followUps?: string[] };
export const ORBIT_SESSION_KEY = 'orbit-conversation-v2';
const MAX_AGE = 8 * 60 * 60 * 1000;

export function boundedMessages(messages: OrbitMessage[]): OrbitMessage[] {
  const early = messages.filter(message => message.role === 'user').slice(0, 3);
  const recent = messages.length <= 24 ? [...messages] : messages.slice(-21);
  while (recent.length > 1 && recent.reduce((length, message) => length + message.content.length, 0) > 44000) recent.shift();
  // Keep early introductions and goals as well as recent corrections and replies.
  return [...early.filter(message => !recent.includes(message)), ...recent].slice(0, 24);
}

export function requestHistory(messages: OrbitMessage[]): AssistantMessage[] {
  const history = messages.map(({ role, content }) => ({ role, content: content.slice(0, role === 'user' ? 2000 : 1800) }));
  const early = history.filter(message => message.role === 'user').slice(0, 3);
  const recent = history.slice(-12);
  while (recent.length > 1 && recent.reduce((length, message) => length + message.content.length, 0) > 9000) recent.shift();
  return [...early.filter(message => !recent.includes(message)).map(message => ({ ...message, content: message.content.slice(0, 700) })), ...recent];
}

export function restoreSession(raw: string | null, now = Date.now()): OrbitMessage[] {
  if (!raw || raw.length > 100000) return [];
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 2 || !Number.isFinite(value.savedAt) || now - value.savedAt > MAX_AGE || value.savedAt > now + 60000 || !Array.isArray(value.messages)) return [];
    const messages: OrbitMessage[] = [];
    for (const item of value.messages.slice(0, 25)) {
      if ((item?.role !== 'user' && item?.role !== 'assistant') || typeof item.content !== 'string' || !item.content.trim() || item.content.length > 6000) return [];
      messages.push({ role: item.role, content: item.content, actions: validActions(item.actions), followUps: validFollowUps(item.followUps), sources: [] });
    }
    return boundedMessages(messages);
  } catch { return []; }
}

export function serializeSession(messages: OrbitMessage[], now = Date.now()) {
  return JSON.stringify({ version: 2, savedAt: now, messages: boundedMessages(messages) });
}
