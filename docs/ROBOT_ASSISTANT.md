# Orbit conversations and portfolio interactions

Orbit has two clearly labelled modes:

- **AI conversation** uses the configured OpenAI model to write replies, reason through a visitor's own workflow, explain general concepts, adapt to the visitor's language, and ask relevant follow-up questions. Verified portfolio passages ground claims about Harold.
- **Portfolio guide** works without a key and when AI is unavailable. It provides limited local conversation rules, relevant portfolio passages, and the same page/contact actions. It is not a generative model.

## AI setup

1. Set the server-only `OPENAI_API_KEY` in `.env.local` or the hosting dashboard. Never use a `NEXT_PUBLIC_` prefix or put a real key in Git, screenshots, or chat messages.
2. `OPENAI_MODEL` defaults to `gpt-5-mini`. An alternative must support the Responses API and strict structured outputs. The existing default uses minimal reasoning and at most 1,800 output tokens.
3. Restart development after changing environment variables. For production, set hosting variables and redeploy.

`GET /api/assistant` reports `ai` when a key is configured and the provider is not in a temporary cooldown; otherwise it reports `knowledge`. This does not verify credits or model access. A successful AI request is required to validate the connection.

The integration follows OpenAI's [conversation-state guidance](https://developers.openai.com/api/docs/guides/conversation-state), [structured output format](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses), and [GPT-5 mini documentation](https://developers.openai.com/api/docs/models/gpt-5-mini).

If the provider rejects a request, times out, or returns an incomplete or unreadable result, Orbit returns a guide response with a visible AI-unavailable notice. It never labels that answer as AI-generated. Authentication and rate/quota failures pause provider attempts for 60 seconds per server process. Logs contain only an HTTP status and a constrained error code, never credentials, provider bodies, or conversation text.

A key can be accepted by a model-list request while generation is unavailable. A quota or credit-balance error requires the owner to check API billing; changing prompts cannot restore exhausted credits. See the [official error-code guidance](https://developers.openai.com/api/docs/guides/error-codes). Do not infer the current account balance from a configured key or an old error report.

## Conversation, memory, and learning

`components/RobotChat.tsx` keeps a bounded conversation in sessionStorage in the current browser tab. It restores across page reloads, expires after eight hours without a save, and is removed by **New conversation**. Up to 24 messages are kept, including the first three visitor messages when a longer chat is trimmed. Recent corrections remain in the recent history. The UI discloses this memory.

`lib/orbitSession.ts` builds a request with recent messages and bounded early visitor context, preserving introductions and initial goals within the API's limits. Session data is validated on restore, unsupported action IDs are discarded, and the composer waits until restoration finishes. An interrupted last turn can be retried. Stop aborts the response; a late reply cannot silently replace it.

Memory is conversation context, not automatic machine-learning training. Visitor statements do not update the model's weights, become facts about Harold, or modify the published knowledge. There is no shared visitor memory, training pipeline, vector database, or server conversation database in this implementation.

## Reasoning and knowledge

`lib/assistantKnowledge.ts` builds references from:

- `lib/profileData.ts`: published background, contact details, 70 skills, projects, and experience.
- `lib/portfolioHighlights.ts`: the editorial workflow and the accurately scoped English listening certificate.
- `lib/projectScreenshots.ts`: the current public gallery count and navigation.
- `lib/automationPlayground.ts`: available tools and node types.
- `content/robot-knowledge.json`: owner-maintained instructions, limits, navigation, and general workflow guidance.

Long entries are split into passages of roughly 900 characters. Retrieval weights the latest question, titles, explicit topics, and prior conversation. Short affirmatives can follow the assistant's last offered question, and ordinal project follow-ups can refer to the order of projects in its previous reply. Explicit topic changes take precedence.

AI instructions distinguish general knowledge from Harold-specific claims. Orbit may propose a trigger, validation, decision, action, and failure-handling design for a visitor's own tools. It must not present a proposed design as a delivered client project or invent prices, availability, outcomes, or credentials. The playground remains a browser simulation; the C1 certificate remains a listening self-assessment.

Edit the public source data or `content/robot-knowledge.json` to publish new facts, then rebuild/redeploy. Browser-only admin edits do not update server references. Do not add secrets or private client information. There is no unauthenticated endpoint for changing knowledge.

## Real interactions

`lib/orbitActions.ts` contains the trusted action catalog: projects, screenshot gallery, skills, automation playground, certificate section/PDF, n8n demo download, LinkedIn, GitHub, and the existing contact dialog.

The model returns action **IDs**, not URLs or executable code. The server and client validate them against the catalog. A visitor chooses a displayed action; Orbit never automatically navigates, sends a message, submits an inquiry, books a meeting, changes a live account, or runs an automation. The contact action opens the real contact dialog and the visitor decides whether to complete its form.

AI replies use a strict JSON schema in `lib/orbitConversation.ts`:

- `reply`: natural text.
- `action_ids`: up to three catalog IDs.
- `follow_ups`: up to three short next questions.
- `source_ids`: supplied portfolio references actually used.

The API maps these to `reply`, `actions`, `followUps`, and validated `sources`. Only trusted source IDs survive. General explanations can have no portfolio sources. UI references are expandable and are not a guarantee that every generated sentence is correct.

## API and data handling

`POST /api/assistant` accepts `{ "messages": [{ "role": "user", "content": "Help me plan a GHL workflow" }] }`.

Only user/assistant text roles are allowed; the last turn must be a user question. Limits remain 16 messages, 2,400 characters per message, 12,000 total history characters, and a 32 KiB body. Input errors use non-200 responses. Provider failures return a usable guide response with `mode: "knowledge"` and a notice. Provider calls time out after 25 seconds.

Requests use `store: false`. In AI mode, recent visitor messages and selected public references are sent to OpenAI; applicable OpenAI data policies still apply. The app does not write conversations to a server database or server logs. This browser tab stores the bounded transcript until cleared/expired.

The route keeps its existing same-origin checks and in-memory limit of 60 requests/minute per process and 20 per client bucket. Set `ASSISTANT_TRUST_PROXY=true` only behind a proxy that overwrites forwarded headers. Otherwise clients share the anonymous bucket. Limits are not shared between server instances; configure hosting rate limits and API project spending limits for a larger public deployment.

## Verification

Run `npm run test:orbit` for reference retrieval, follow-up continuity, visitor memory, safe session restoration, history limits, action/source filtering, structured provider payloads, and graceful quota-failure behavior. AI tests stub the provider and consume no API credit.

Browser checks should cover introduction/name recall, a workflow planning turn, suggested follow-ups, contact dialog actions, internal links, reload/restoration, new-chat clearing, stop/retry, keyboard use, and mobile sizing. Label simulated AI responses as tests rather than evidence of a live connection. A separate minimal live provider request is needed to verify the configured account; keep its prompt non-personal and avoid sending visitor data as a diagnostic.
