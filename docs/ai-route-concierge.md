# Open-source AI route concierge

Capital City Provisions now has a browser-local AI layer built into the website. The primary path needs no OpenAI key, no paid AI API, and no custom AI server. When the customer clicks **Start Local AI**, the browser loads WebLLM and runs a supported open-source instruct model with WebGPU when the device allows it.

## Primary path: built into the website

- `components/LocalAIConcierge.tsx` provides the customer-facing local AI chat.
- `@mlc-ai/web-llm` provides in-browser LLM inference.
- The component dynamically imports WebLLM only after the customer starts local AI.
- If WebGPU or model loading is unavailable, it falls back to deterministic route, box, promo, wholesale, and giveaway rules.
- The AI receives site context for route status, route fill, recommended box, cheesecake offer, wholesale intake, and giveaway rules.

## Customer-facing uses

- Pick a freezer box by household size, budget, and protein preference.
- Explain delivery route status and route fill.
- Explain the cheesecake order bonus without tying it to giveaway odds.
- Answer giveaway questions with no-purchase language.
- Guide wholesale users toward restaurant, food truck, caterer, lodge, church, and event intake.
- Keep lead capture structured so owner follow-up remains clean.

## Guardrails

- Giveaway entry must stay no-purchase.
- Purchase must never improve giveaway odds.
- Cheesecake and coupon offers are separate order incentives.
- Route fill meters should reflect real operational capacity or conservative placeholders until connected to live route data.
- The model should recommend next steps, not make delivery promises the business cannot keep.
- Rules mode must always work even when local AI cannot load.

## Optional future path: self-hosted model

The existing `/api/ai/route-concierge` endpoint can still call a private OpenAI-compatible server later. Use this only if the business wants a stronger model for admin tools or devices that cannot run WebGPU.

1. Start with Ollama, vLLM, or LocalAI on a private VPS or GPU host.
2. Use a practical model for customer engagement, for example Llama 3.1 8B Instruct, Mistral 7B Instruct, or Qwen2.5 7B Instruct.
3. Put the model behind HTTPS with rate limiting and a bearer token.
4. Set `AI_CONCIERGE_URL` to the OpenAI-compatible chat completions URL.
5. Set `AI_CONCIERGE_MODEL` to the hosted model name.
6. Set `AI_CONCIERGE_API_KEY` if the server requires a bearer token.

## Fallback

If no local model is loaded and no model endpoint is configured, the website still returns deterministic rules-based recommendations so the customer experience does not break.
