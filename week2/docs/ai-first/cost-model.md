# Cost Model

## Assumptions
- Model: GPT-4o-mini at $0.15/1K prompt tokens, $0.60/1K completion tokens
- Typeahead avg tokens: 10 in, 20 out
- Support Assistant avg tokens: 50 in, 100 out
- Requests/day: Typeahead 50,000; Support Assistant 1,000
- Cache hit rate: Typeahead 70%; Support Assistant 30%

## Calculation
Cost/action = (tokens_in/1000 * prompt_price) + (tokens_out/1000 * completion_price)

Daily cost = Cost/action * Requests/day * (1 - cache_hit_rate)

## Results
- Typeahead: Cost/action = $0.0135, Daily = $202.5
- Support Assistant: Cost/action = $0.0675, Daily = $47.25

## Cost lever if over budget
- Reduce context tokens (shorter query length)  
- Downgrade model for low-risk requests  
- Increase cache hit rate via caching popular queries/responses

