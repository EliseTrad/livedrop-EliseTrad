
# Touchpoints

## 1. Typeahead / Search Suggestions

**Problem Statement:**  
Users need fast product search suggestions as they type. Without predictive suggestions, users may struggle to find relevant items, reducing conversion.

**Happy Path:**  
1. User types a query in search bar.  
2. Frontend sends partial query to API Gateway.  
3. API checks cache for previous suggestions.  
4. If cache miss, API calls Search Service.  
5. Search Service uses embeddings + search-optimized DB to generate suggestions.  
6. Suggestions returned to frontend within p95 latency ≤300ms.  
7. User selects a product → redirected to product page.  
8. System logs request for analytics.  

**Grounding & Guardrails:**  
- Use search-optimized DB for all suggestions.  
- Maximum context length: 100 tokens.  
- Do not suggest discontinued products.  

**Human-in-the-Loop:**  
- N/A (automated suggestions; monitor logs for anomalies).  

**Latency Budget:**  
- Cache check: 50ms  
- DB/embedding retrieval: 200ms  
- Response formatting + API latency: 50ms  

**Error & Fallback Behavior:**  
- Cache miss + DB failure → fallback to top N popular products.  

**PII Handling:**  
- Only query text (no personal info) leaves client.  
- Logs anonymized, no storage of user identifiers.  

**Success Metrics:**  
- Product CTR = Clicks on suggestion / Total suggestions shown  
- Conversion = Orders from typeahead clicks / Total suggestions  
- Business metric: Avg. session duration increased by successful search  

**Feasibility Note:**  
- Product catalog embeddings available.  
- Use search-optimized DB + cached embeddings.  
- Next step: prototype API + cache layer.

---

## 2. Support Assistant (RAG + Order Status)

**Problem Statement:**  
Users often ask repetitive questions about orders or policies. Manually answering increases support load and latency. AI assistant reduces response time and improves user experience.

**Happy Path:**  
1. User opens support chat or clicks FAQ.  
2. Frontend sends user query to API Gateway.  
3. API calls Support Assistant Service.  
4. Service performs retrieval-augmented generation (RAG) using Policies/FAQ markdown + order-status API.  
5. Embeddings are generated for query and matched against existing content.  
6. Model generates response grounded in retrieved data.  
7. Response returned to user within p95 ≤1200ms.  
8. If model confidence < threshold, escalate to human reviewer.  
9. Interaction logged for metrics and model retraining.  

**Grounding & Guardrails:**  
- Refuse answers outside policy/FAQ scope.  
- Only return verified order info.  
- Max context length: 200 tokens.  

**Human-in-the-Loop:**  
- Trigger if model confidence < 80% or query includes high-risk topics.  
- SLA: human must respond within 2h.  
- UI: “Escalated to human support” notification.  

**Latency Budget:**  
- Cache retrieval: 200ms  
- Embedding search: 400ms  
- Model generation: 500ms  
- Formatting/API overhead: 100ms  

**Error & Fallback Behavior:**  
- If model fails → fallback to human support.  
- Log error and provide generic safe response.  

**PII Handling:**  
- Queries include only order ID + minimal context.  
- Redact sensitive info before logging.  

**Success Metrics:**  
- FAQ coverage = Auto-resolved queries / Total queries  
- Avg response time ≤ 1200ms  
- Business: Reduction in human support tickets per day  

**Feasibility Note:**  
- Policies/FAQ markdown + order-status API available.  
- Use GPT-4o-mini or Llama 3.1.  
- Prototype: integrate RAG pipeline, test latency, evaluate success metrics.
