import { knowledgeReply, knowledgeSources, type AssistantMessage, type AssistantSource, type KnowledgeChunk } from './assistantKnowledge';
import { orbitActions, validActions, validFollowUps, type OrbitActionId } from './orbitActions';

export type OrbitAnswer = { reply: string; sources: AssistantSource[]; actions: OrbitActionId[]; followUps: string[] };

export const orbitResponseFormat = {
  type: 'json_schema', name: 'orbit_conversation', strict: true,
  schema: {
    type: 'object', additionalProperties: false,
    properties: {
      reply: { type: 'string' },
      action_ids: { type: 'array', items: { type: 'string', enum: Object.keys(orbitActions) }, maxItems: 3 },
      follow_ups: { type: 'array', items: { type: 'string' }, maxItems: 3 },
      source_ids: { type: 'array', items: { type: 'string' }, maxItems: 5 },
    },
    required: ['reply', 'action_ids', 'follow_ups', 'source_ids'],
  },
};

export function parseOrbitAnswer(text: string, chunks: KnowledgeChunk[]): OrbitAnswer | null {
  let value: unknown;
  try { value = JSON.parse(text); } catch { return null; }
  if (!value || typeof value !== 'object' || !('reply' in value) || typeof value.reply !== 'string' || !value.reply.trim() || value.reply.length > 6000) return null;
  const result = value as Record<string, unknown>;
  const ids = Array.isArray(result.source_ids) ? result.source_ids.filter(id => typeof id === 'string') : [];
  return { reply: value.reply.trim(), actions: validActions(result.action_ids), followUps: validFollowUps(result.follow_ups), sources: knowledgeSources(chunks.filter(chunk => ids.includes(chunk.id))) };
}

function nextSteps(chunks: KnowledgeChunk[]): Pick<OrbitAnswer, 'actions' | 'followUps'> {
  const id = chunks[0]?.id ?? '';
  if (id.includes('english') || id === 'profile-education') return { actions: ['certificate', 'certificate_pdf'], followUps: ['What does C1 listening mean?', 'Tell me about his background'] };
  if (id === 'project-screenshot-gallery') return { actions: ['gallery', 'automation'], followUps: ['Can I build a workflow myself?', 'Show me a project example'] };
  if (id.startsWith('playground') || id === 'automation-playground') return { actions: ['automation', 'gallery'], followUps: ['How do I connect the nodes?', 'Does it run real automations?'] };
  if (id === 'project-n8n-ai-editorial-pipeline') return { actions: ['editorial', 'projects'], followUps: ['How does the approval step work?', 'Can I try a sample workflow?'] };
  if (id.startsWith('skills-') || id === 'profile-skills') return { actions: ['skills', 'projects'], followUps: ['Which project uses those skills?', 'How could these tools help my business?'] };
  if (id === 'profile-contact' || /pricing|starting-a-project/.test(id)) return { actions: ['contact', 'projects'], followUps: ['What should I include in my project brief?', 'What services does Harold offer?'] };
  return { actions: ['projects', 'skills', 'contact'], followUps: ['What are his strongest skills?', 'Can I try the automation playground?'] };
}

export function guidedConversation(messages: AssistantMessage[], chunks: KnowledgeChunk[]): OrbitAnswer {
  const question = messages.at(-1)?.content.trim() ?? '';
  const recent = messages.slice(0, -1);
  const previousAssistant = [...recent].reverse().find(message => message.role === 'assistant')?.content ?? '';
  const greeting = /^(?:hi|hello|hey|hiya|good morning|good afternoon|good evening|kumusta|kamusta)\b[\s!,.:]*(?:orbit[!.\s]*)?$/i.test(question);
  if (greeting) return { reply: "Hi! I'm Orbit. Tell me what you're working on, or ask me about Harold. Are you exploring his work, looking for help with a workflow, or just curious about automation?", sources: [], actions: ['projects', 'automation'], followUps: ['I need help with a workflow', 'Show me Harold’s work'] };
  if (/^(?:thanks|thank you|thankyou|salamat|that helps|awesome|great)[!.\s]*$/i.test(question)) return { reply: "You're welcome. We can keep going with that idea, look at an example, or get Harold involved when you're ready.", sources: [], ...nextSteps(chunks) };
  const introduction = question.match(/\b(?:my name is|call me)\s+([\p{L}][\p{L}' -]{0,45})(?=[.!?,]|$)/iu)?.[1]?.split(/\b(?:and|but|using|i|we)\b/i)[0]?.trim();
  if (introduction && !/\b(?:what|remember|forget)\b/i.test(question)) return { reply: `Nice to meet you, ${introduction}. I’ll keep your introduction in this conversation. What are you hoping to improve or build?`, sources: [], actions: [], followUps: ['Help me plan my workflow', 'Show me Harold’s work'] };
  if (/\b(?:what(?:'s| is) my name|remember (?:my|me)|what (?:did i|have i)|what am i|do you remember)\b/i.test(question)) {
    const users = recent.filter(message => message.role === 'user');
    const detail = /\b(?:tools?|platforms?|using|use)\b/i.test(question) ? [...users].reverse().find(message => /\b(?:ghl|gohighlevel|n8n|make|zap+pier|wordpress|supabase)\b/i.test(message.content))
      : /\b(?:goal|project|business|build|need)\b/i.test(question) ? [...users].reverse().find(message => /\b(?:my|our|need|want|business|build)\b/i.test(message.content)) : undefined;
    if (detail) return { reply: `You told me: “${detail.content.slice(0, 400)}”\n\nWe can build on that context. What would you like to work out next?`, sources: [], actions: ['automation'], followUps: ['Help me plan the next step', 'Show me a relevant example'] };
    const named = [...users].reverse().map(message => message.content.match(/\b(?:my name is|call me|i am called|i'm called)\s+([\p{L}][\p{L}' -]{0,45})[.!?,\n]?/iu)?.[1]?.trim()).find(Boolean);
    const first = users.find(message => !/^(hi|hello|hey|thanks)[!.\s]*$/i.test(message.content.trim()))?.content;
    return { reply: named ? `You introduced yourself as ${named}. I can use the details in this conversation while we talk. ${first && !first.includes(named) ? `You also said: “${first.slice(0, 250)}”` : 'What would you like to work on next?'}` : first ? `Earlier you told me: “${first.slice(0, 350)}”\n\nI keep this conversation in this browser tab. Starting a new conversation clears it.` : "You haven't shared those details in this conversation yet. What would you like me to know about your project?", sources: [], actions: [], followUps: ['Help me plan my automation', 'Show me a relevant project'] };
  }
  if (/\b(?:what can you (?:do|help)|how can you help|can you interact|can you learn|machine learning|train yourself|are you learning)\b/i.test(question)) return { reply: "I can discuss ideas, explain automation, suggest relevant examples, and offer buttons to explore the portfolio or open Harold's contact form. With AI connected, I can reason through your own questions using our conversation. I remember this tab's conversation; visitor messages don't retrain a model or change Harold's published facts.", sources: [], actions: ['projects', 'automation', 'contact'], followUps: ['Help me plan a workflow', 'Explain a webhook simply'] };
  if (/\b(?:open|show|take|go|visit|view|download|contact|talk|reach)\b/i.test(question)) {
    const action: OrbitActionId | null = /\b(?:contact|talk|reach|hire)\b/i.test(question) ? 'contact'
      : /\blinkedin\b/i.test(question) ? 'linkedin' : /\bgithub\b/i.test(question) ? 'github'
      : /\b(?:screenshot|gallery|pictures|images)\b/i.test(question) ? 'gallery'
      : /\b(?:playground|builder|automation lab|(?:sample|try).*workflow)\b/i.test(question) ? 'automation'
      : /\b(?:certificate|english)\b/i.test(question) ? /\bpdf\b/i.test(question) ? 'certificate_pdf' : 'certificate'
      : /\b(?:download|n8n demo)\b/i.test(question) ? 'editorial'
      : /\bskills\b/i.test(question) ? 'skills' : /\bprojects?\b/i.test(question) ? 'projects' : null;
    if (action) {
      const base = chunks.length ? knowledgeReply(messages, chunks.slice(0, 1)) : { reply: '', sources: [] };
      return { reply: `${action === 'contact' ? 'You can open Harold’s contact form below. Nothing is sent until you complete and submit the form.' : `Use “${orbitActions[action].label}” below when you're ready.`}${base.reply ? `\n\n${base.reply.replace(/^From Harold's portfolio notes:\n\n/, '')}` : ''}`, sources: base.sources, actions: [action], followUps: nextSteps(chunks).followUps };
    }
  }
  if (/\b(?:help|plan|design|build|automate|automation|workflow|leads?|follow.?up)\b/i.test(question) && /\b(?:my|our|business|client|agency|salon|shop|team|need|want)\b/i.test(question)) {
    const context = [...recent.filter(message => message.role === 'user').slice(-3).map(message => message.content), question].join(' ');
    const tool = /\b(?:ghl|gohighlevel)\b/i.test(context) ? 'GoHighLevel' : /\bmake\b/i.test(context) ? 'Make' : /\bzap+pier\b/i.test(context) ? 'Zapier' : /\bn8n\b/i.test(context) ? 'n8n' : '';
    return { reply: `Let's break it into a trigger, a decision, and an action${tool ? ` in ${tool}` : ''}. For lead follow-up, a starting pattern is: receive the form → check required details → create or update the contact → route the lead → prepare the follow-up. Test with sample data before connecting live accounts.\n\n${tool ? 'Where do new leads arrive today, and what should happen immediately afterward?' : 'Which tools are you using, and what repetitive task would you like to remove first?'}`, sources: [], actions: ['automation', 'projects'], followUps: ['Show me a sample workflow', 'What should I include in a project brief?'] };
  }
  if (/\b(?:what is|explain|meaning|understand)\b/i.test(question) && /\bwebhooks?\b/i.test(question)) return { reply: "A webhook is a message one app sends when something happens. For example, a form submission can send a lead's details to a workflow, which checks the data and updates a CRM. The receiving workflow should validate the request and handle repeated deliveries safely.\n\nWould you like to try that idea in the sample playground?", sources: [], actions: ['automation'], followUps: ['Yes, show me the playground', 'How is that different from polling?'] };
  if (/^(?:yes|yep|sure|okay|ok|please|go ahead|tell me more)[!.\s]*$/i.test(question) && !chunks.length) {
    return { reply: previousAssistant ? 'Happy to. Do you mean an example workflow, Harold’s project work, or getting in touch?' : 'What would you like to explore first: a project, a skill, or a sample automation?', sources: [], actions: ['projects', 'automation', 'contact'], followUps: ['Show a sample automation', 'Tell me about Harold’s projects'] };
  }
  const base = knowledgeReply(messages, chunks.slice(0, 1));
  return { ...base, reply: base.reply.replace(/^From Harold's portfolio notes:\n\n/, ''), ...nextSteps(chunks) };
}
