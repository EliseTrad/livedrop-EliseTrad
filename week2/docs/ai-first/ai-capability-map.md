# AI Capability Map

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback | Selected |
|---|---|---|---|---:|---|---|:---:|
| Typeahead / Search Suggestions | Help user find products quickly while typing | User query text, product catalog (embeddings + search-optimized DB) | 2 | 300 | $0.002 | Fallback to cached top results | Yes |
| Support Assistant (RAG + Order Status) | Answer FAQs & order queries instantly | Policies/FAQ markdown, order-status API, query embeddings | 3 | 1200 | $0.01 | Fallback to human support | Yes |
| Product Auto-Summary / Highlights | Generate short product description | Product specs + images, embeddings, fine-tuned LoRA | 3 | 800 | $0.005 | Show original specs | No |
| Personalized Recommendations | Suggest similar products | Session logs, item embeddings | 4 | 500 | $0.004 | Show generic recommendations | No |
| Image-based Visual Search | Find products via uploaded image | Product images, vision model embeddings | 4 | 1000 | $0.008 | Fallback to manual search | No |
| Content Moderation / Auto-flagging | Detect policy or compliance issues | User-generated content, specialized classifier | 2 | 600 | $0.003 | Escalate to human moderator | No |

## Why these two?
We selected **Typeahead / Search Suggestions** and **Support Assistant (RAG + Order Status)** because they directly impact core business KPIs: Typeahead improves conversion by helping users find products faster, while Support Assistant reduces support contact rate and increases satisfaction. Integration risk is low since ShopLite already has the `order-status` API and FAQ markdown. Both can leverage embeddings, caching, and partial denormalization (Week 1 concepts) to achieve p95 latency targets while keeping cost manageable.
