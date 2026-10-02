# The conversational portfolio robot

The robot has two clearly labelled modes:

- **Portfolio guide** works immediately without an API key. It searches published notes and quotes relevant passages. This is a local knowledge lookup, not a generative AI model.
- **AI assistant** uses the OpenAI Responses API to write conversational replies using those notes and recent messages. A valid server API key is required.

## Enable conversational AI

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to your own OpenAI API key. Keep it out of client code, Git, screenshots, and chat messages.
3. Keep `OPENAI_MODEL=gpt-5-mini`, or choose a Responses-compatible model available to your API project. The default uses minimal reasoning and a maximum of 1,800 output tokens.
4. Restart the development server. For deployment, set the same variables in the hosting dashboard and redeploy.

`GET /api/assistant` reports only `{ "mode": "ai" }` or `{ "mode": "knowledge" }`. It does not validate a key or expose it. Real API usage requires available API billing/credits. An invalid key, unavailable model, or upstream outage produces a visible retry message.

The integration follows the official OpenAI documentation for [conversation state](https://developers.openai.com/api/docs/guides/conversation-state), the [Responses API](https://developers.openai.com/api/reference/cli/resources/responses/methods/create), and [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini).

### If a valid key cannot generate replies

The model-list endpoint can accept a key even when there are no credits available for generation. An OpenAI HTTP 429 with `error.code: "credit_balance_exhausted"` and `error.type: "insufficient_quota"` means the organization's prepaid API credit balance is depleted. Add credits in the OpenAI billing settings, then retry the chat. Repeated retries alone cannot restore access. See the official [OpenAI error codes](https://developers.openai.com/api/docs/guides/error-codes).

The portfolio deliberately returns a visitor-safe error instead of exposing billing details or provider responses. Its AI badge indicates that a key is configured; it does not confirm billing status. Completed responses are required before an AI answer is displayed, so a partial, incomplete response is never presented as a finished answer.

## Give the robot more knowledge

Edit `content/robot-knowledge.json`. Each entry has a unique `id`, a descriptive `title`, and a `content` string:

```json
{
  "entries": [
    {
      "id": "your-topic",
      "title": "A clear topic or question",
      "content": "Write verified information here. Separate paragraphs with \n\n when helpful."
    }
  ]
}
```

Add entries to the existing array; keep the current entries you still want the robot to know. You can paste long explanations, FAQs, service descriptions, project notes, and approved case studies. JSON strings need escaped quotes (`\"`) and escaped newlines (`\n`). Do not add passwords, private customer data, API keys, or notes you would not share publicly: visitors can ask the assistant about any knowledge entry.

Good reference notes use descriptive titles, natural question wording, specific facts, and one main topic per entry. Include actual project constraints and verified outcomes when you have them. More words help only when they add relevant information. Delete outdated or conflicting facts.

Public profile details, skills, projects, experience, education, and contact links also come directly from `lib/profileData.ts`. The current admin editor stores changes in the browser, so those local edits do not automatically update the server robot. Update the source file for facts that should be published to all visitors.

Restart development or rebuild and redeploy after editing knowledge. The JSON is bundled into the server at build time. There is deliberately no unauthenticated web endpoint for changing its knowledge.

### What “training” means here

Adding notes gives an existing model reference material for each answer. It does not change the model's weights, create a fine-tuned model, or permanently learn from visitor conversations. This is a practical starting point for a portfolio assistant that you can expand with plenty of verified text.

Long entries are split into passages of roughly 900 characters. A local keyword search selects up to five passages per question, weighting titles and the latest message. Short follow-up questions can include the previous question as context. The model receives these passages as data plus up to 16 recent chat messages. The source labels show which notes were supplied; they are not model-verified citations for every sentence.

The current search suits a small or medium portfolio knowledge base. For a large document library or multilingual semantic search, add an embedding/vector search index and evaluate retrieval quality before increasing the content volume substantially.

## API contract

`POST /api/assistant` accepts JSON:

```json
{
  "messages": [
    { "role": "user", "content": "What GoHighLevel work does Harold do?" }
  ]
}
```

Success:

```json
{
  "reply": "The answer text",
  "mode": "ai",
  "sources": [{ "id": "services-overview", "title": "Services and areas of focus" }]
}
```

Only `user` and `assistant` roles are accepted. The last message must be from the user. Limits are 16 messages, 2,400 characters per message, 12,000 characters of total history, and a 32 KiB request body. Errors return `{ "error": "A visitor-safe explanation" }` with a non-200 status. Provider calls time out after 25 seconds.

## Hosting and data handling

- API keys stay on the server. Reference notes are treated as data, and visitor messages cannot modify the saved knowledge.
- Messages and relevant public notes are sent to OpenAI only in AI mode. Requests use `store: false`; this app does not store conversations in a database or write them to server logs. OpenAI's applicable API data policies still apply.
- The route has an in-memory limit of 60 requests per minute per server process and 20 per minute per client bucket. By default, all visitors share the anonymous client bucket.
- Enable `ASSISTANT_TRUST_PROXY=true` only behind a proxy that overwrites `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto`. This enables separate rate-limit buckets using the forwarded address and uses the forwarded public host/protocol for same-origin checks. Without this setting, origin checks use the actual `Host` header and the request URL's protocol, so local production previews also work when Next uses an internal hostname. Buckets expire after one minute and are never persisted.
- Memory limits reset on server restart and are not shared across serverless instances. For a public launch with significant traffic, use your host's rate limiting or a shared rate-limit store, and set an API project spending limit. Same-origin checks reduce browser cross-site use but are not authentication or bot protection.
- The assistant cannot confirm current prices or availability, book a meeting, or send an inquiry. It directs visitors to Get in touch for those actions.

## Verify changes

With no API key, check the mode endpoint and ask about skills, projects, pricing, and an unknown topic. Follow up with “Tell me more about that.” Confirm relevant reference passages appear and unknown facts are not invented. After adding a key, repeat those checks and verify that a bad key or network interruption produces a useful retry message. Test a new knowledge entry by asking a question whose answer exists only in that entry.
