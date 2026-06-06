# Open-source AI route concierge

Capital City Provisions can run the site without an AI server. When a self-hosted open-source model is available, set these Vercel environment variables and the `/api/ai/route-concierge` endpoint will use it.

## Recommended hosting path

1. Start with a small OpenAI-compatible server such as Ollama, vLLM, or LocalAI on a private VPS or GPU host.
2. Use a practical model for customer engagement, for example Llama 3.1 8B Instruct, Mistral 7B Instruct, or Qwen2.5 7B Instruct.
3. Put the model behind HTTPS with rate limiting and a bearer token.
4. Set `AI_CONCIERGE_URL` to the OpenAI-compatible chat completions URL.
5. Set `AI_CONCIERGE_MODEL` to the hosted model name.
6. Set `AI_CONCIERGE_API_KEY` if the server requires a bearer token.

## Guardrails

- Giveaway entry must stay no-purchase.
- Purchase must never improve giveaway odds.
- Cheesecake and coupon offers are separate order incentives.
- Route fill meters should reflect real operational capacity or conservative placeholders until connected to live route data.
- The model should recommend next steps, not make delivery promises the business cannot keep.

## Fallback

If no model endpoint is configured, the API returns a deterministic rules-based recommendation so the website keeps working.
