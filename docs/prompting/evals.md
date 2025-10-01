# RAG System Evaluation

## Retrieval Quality Tests (10 tests)

| Test ID | Question                                     | Expected Documents     | Pass Criteria                                |
| ------- | -------------------------------------------- | ---------------------- | -------------------------------------------- |
| R01     | How do I create a buyer account on Shoplite? | Document 1             | Retrieved docs contain Document 1            |
| R02     | How can I register as a seller?              | Document 1, Document 7 | Retrieved docs contain both Document 1 and 7 |
| R03     | How does Shoplite handle abandoned carts?    | Document 2             | Retrieved docs contain Document 2            |
| R04     | What payment methods are supported?          | Document 3             | Retrieved docs contain Document 3            |
| R05     | How do users track orders?                   | Document 4             | Retrieved docs contain Document 4            |
| R06     | What is the return policy?                   | Document 5             | Retrieved docs contain Document 5            |
| R07     | How are product reviews moderated?           | Document 6             | Retrieved docs contain Document 6            |
| R08     | How can sellers update inventory?            | Document 8             | Retrieved docs contain Document 8            |
| R09     | What fees are charged to sellers?            | Document 9             | Retrieved docs contain Document 9            |
| R10     | What channels exist for customer support?    | Document 10            | Retrieved docs contain Document 10           |

## Response Quality Tests (15 tests)

| Test ID | Question                         | Required Keywords                                                      | Forbidden Terms                                          | Expected Behavior                                      |
| ------- | -------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| Q01     | How do I create a buyer account? | ["buyer account","email verification","two-factor authentication"]     | ["business verification","tax ID"]                       | Accurate, concise answer with citation                 |
| Q02     | How to register as a seller?     | ["seller registration","business verification","2–3 business days"]    | ["instant approval","personal account"]                  | Accurate, step-by-step answer with document references |
| Q03     | Abandoned cart handling?         | ["abandoned cart","notifications","analytics"]                         | ["delete items automatically","ignore abandoned carts"]  | Correct retrieval explanation                          |
| Q04     | Supported payment methods?       | ["credit/debit cards","PayPal","mobile wallets","secure"]              | ["cash payment","unsupported wallets"]                   | Accurate answer citing Document 3                      |
| Q05     | Order tracking process?          | ["track order","dashboard","real-time updates"]                        | ["no tracking available","manual tracking only"]         | Step-by-step answer                                    |
| Q06     | Return policy?                   | ["30-day return","return authorization","original condition","refund"] | ["no returns","lifetime returns"]                        | Clear return instructions                              |
| Q07     | Review moderation?               | ["moderation","helpful votes","guidelines"]                            | ["fake reviews allowed","no moderation"]                 | Correct, concise explanation                           |
| Q08     | Inventory updates by sellers?    | ["add products","bulk upload","stock levels","alerts"]                 | ["manual spreadsheets only","no alerts"]                 | Accurate inventory workflow description                |
| Q09     | Seller fees and commissions?     | ["commission","fees","payout schedule"]                                | ["hidden fees","instant payout"]                         | Clear, stepwise answer                                 |
| Q10     | Customer support channels?       | ["email","live chat","phone","SLAs"]                                   | ["no escalation","limited support"]                      | Accurate, document-referenced answer                   |
| Q11     | Mobile app features?             | ["browse","checkout","push notifications","AI chat"]                   | ["desktop only","no notifications"]                      | Concise, accurate answer                               |
| Q12     | Developer API security?          | ["API keys","OAuth 2.0","rate limits"]                                 | ["no authentication","unrestricted access"]              | Clear API guidance                                     |
| Q13     | Data privacy compliance?         | ["GDPR","encryption","privacy settings"]                               | ["no compliance","data sharing without consent"]         | Accurate, KB-cited answer                              |
| Q14     | Promotional codes usage?         | ["promo code","real-time discount","stackable"]                        | ["unlimited discounts","manual calculation"]             | Correct usage instructions                             |
| Q15     | How are AI features integrated?  | ["AI suggestions","pricing optimization","human oversight"]            | ["fully automated without checks","ignore seller input"] | Multi-document synthesis, clear explanation            |

## Edge Case Tests (5 tests)

| Test ID | Scenario                                                | Expected Response Type                             |
| ------- | ------------------------------------------------------- | -------------------------------------------------- |
| E01     | User asks about a feature not in KB                     | Refusal with polite explanation                    |
| E02     | Ambiguous question: "How do I sell?"                    | Clarification request                              |
| E03     | Misleading question: "Can I return items after 1 year?" | Refusal citing 30-day return policy                |
| E04     | Multi-document question with partial info missing       | Answer based on available docs + note missing info |
| E05     | Question with spelling errors or abbreviations          | Correctly interpret and respond using KB context   |
