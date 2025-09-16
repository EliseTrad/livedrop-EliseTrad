# LiveDrops – Flash-Sale & Follow Platform
## Graph: https://excalidraw.com/#json=aWcDF9hTTYCZnCiKugbBm,5ty_pG5-I4RJ0QobCmzk9A
## Overview
- LiveDrops is a flash-sale platform where creators can run limited-stock product drops.
- Users can follow creators, browse products, receive near real-time notifications, and place orders.
- System must handle:
  - Sudden spikes in traffic (celebrity creators)
  - No overselling
  - Low-latency responses (read: ≤200ms for reads, ≤500ms for orders)
  - Scalable performance
- Design leverages concepts from:
  - Distributed systems (CAP theorem, sharding, horizontal/vertical scaling)
  - Database design (relational vs NoSQL, normalized vs denormalized, indexing)
  - Microservices and stateful/stateless services
  - Caching (with invalidation)
  - Asynchronous processing (queues, background workers)
  - API protocols (GraphQL, RPC)
  - Event-driven architecture (CDC, producers/consumers)
  - High-performance API patterns and metrics

---

## High-Level Architecture
- System consists of **stateless microservices**, distributed databases, caching layers, message queues, and monitoring services.
- Components communicate via **RPC for internal APIs** and **GraphQL for public APIs**.
- Correlation IDs track requests across services.
- Supports **horizontal scaling** for stateless services and sharded databases for heavy-read services.

### Components
- **API Gateway**
  - Entry point for mobile/web clients
  - Handles authentication, authorization, rate limiting, throttling, and routing
  - Correlation IDs for tracing requests

- **User & Follow Service**
  - Manages users, follow/unfollow actions, followers/following lists
  - Sharded database using **hash(user_id)** to avoid celebrity hotspots
  - Denormalized follower counts and caching for fast reads
  - Supports paginated retrieval of followers/following
  - Uses CDC (Change Data Capture) for real-time updates to cache and downstream systems

- **Product & Drop Service**
  - Handles products, drops (start/end time, stock, metadata)
  - Provides search-optimized endpoints for product browsing
  - Supports **full-text search, fuzzy search, and chunked results** for large catalogs
  - Works with TDN/blob storage for media (images/videos) and chunks large files for efficient retrieval

- **Inventory & Order Service**
  - Ensures no overselling using **atomic counters, distributed locks, or transactional DB**
  - Idempotent order placement to prevent duplicates
  - Updates stock and triggers Notification Service events
  - Implements synchronous writes for inventory, asynchronous notifications for downstream tasks
  - State management: **stateful for inventory, stateless for order API endpoints**

- **Notification Service**
  - Near-real-time notifications (<2s) for:
    - Drop start
    - Low stock
    - Sold out
    - Order confirmation
  - Asynchronous using **queues (RabbitMQ/Kafka/Amazon SQS, Google Pub/Sub)**
  - Background workers consume events and fan out messages efficiently

- **Search & Browsing Service**
  - Handles queries with pagination for products, drops, followers
  - Uses **search-optimized DBs** and indexes to minimize latency
  - Supports **full-text search, fuzzy search, and ranking**
  
- **Cache Layer**
  - Frequently accessed data (stock counts, creator profiles, follower counts)
  - Invalidation strategies:
    - Follower changes → update cache
    - Stock changes → immediate cache refresh
    - Drop sold out → invalidate cached drop info
  - TTL for less critical data
  - Helps maintain **availability under high read loads**

- **Metrics & Monitoring**
  - Tracks:
    - Request volume
    - Latency (p95 for reads ≤200ms, orders ≤500ms)
    - Cache hit ratios
    - Lock contention
    - Follower-list performance
  - Health dashboards
  - Alerts for anomalies or failures

- **Queues & Event Processing**
  - Producer/Consumer pattern for asynchronous processing
  - Orders, notifications, and analytics use queues
  - Supports retrying failed tasks without duplication (idempotency)

---

## Data Models
- **User**: `user_id`, `name`, `email`
- **Follower**: `user_id`, `creator_id`
- **Product**: `product_id`, `creator_id`, `name`, `description`
- **Drop**: `drop_id`, `product_id`, `start_time`, `end_time`, `stock`
- **Order**: `order_id`, `user_id`, `drop_id`, `status`, `timestamp`

- **Normalization vs Denormalization**
  - Users and products normalized to avoid redundancy
  - Denormalize follower counts and stock counts for **high-read scenarios**
  
- **Sharding / Hashing**
  - Followers, products, orders sharded using `hash(user_id)` or `hash(drop_id)`
  - Prevents hotspots for celebrity creators and ensures horizontal scalability

---

## API Design

### Public API Endpoints
- `GET /products?page=&limit=` – paginated product listing
- `GET /drops?status=&creator_id=` – browse upcoming/live/ended drops
- `POST /follow` – follow a creator
- `POST /unfollow` – unfollow a creator
- `GET /user/:id/followers` – list all followers
- `GET /user/:id/following` – list all creators a user follows
- `GET /follows?user_id=&creator_id=` – check if a user follows a creator
- `POST /order` – place order with **idempotency token**
- `GET /order/:id` – retrieve order status

### Internal APIs
- `Inventory → Notification` – event triggers for stock updates
- `Product → Order` – provide drop info to Order Service
- `Search → Product` – fetch product info for full-text queries

### GraphQL vs REST
- Public API uses GraphQL for flexible queries and minimal network calls
- Internal service-to-service communication uses RPC for efficiency

---

## Order Placement Flow
- User submits order with idempotency token
- Inventory Service checks stock atomically (distributed lock / atomic counter)
- If stock available → decrement → create order → trigger Notification
- If stock depleted → reject order immediately
- Idempotency ensures retries do not create duplicates
- Logs for auditing and metrics

---

## Notifications
- Near-real-time delivery (<2s)
- Fanout using queues + background workers
- High availability under traffic spikes
- Asynchronous design prevents blocking browsing or ordering

---

## Caching Strategy
- Cache frequently accessed data (creator profile, stock, follower counts)
- Invalidation rules:
  - Follower change → update cache
  - Stock change → immediate refresh
  - Drop sold out → invalidate cached data
- TTL for non-critical data

---

## Trade-offs & Reasoning
- **SQL vs NoSQL**: SQL for transactional inventory/orders; NoSQL for high-read followers
- **Availability vs Consistency**: Reads favor availability; writes (orders) favor strong consistency
- **Sharding & Hashing**: Avoids hotspots, distributes load evenly
- **Microservices**: Isolate failures, scale horizontally
- **GraphQL (public) vs RPC (internal)**: Flexible client queries vs efficient service communication
- **Caching**: Reduces latency, carefully invalidated
- **Queue & Async Processing**: Decouples heavy tasks from user-facing operations
- **Stateful vs Stateless Services**: Inventory = stateful, API endpoints = stateless

---

## Metrics & Monitoring
- Latency, cache hits, lock contention, request volume, follower-list performance
- Dashboards for system health under load
- Alerts for anomalies or failures

---

## Edge Cases Considered
- Celebrity creators → sharded follower DB + caching
- Sudden drop traffic → queue-based notifications, horizontal scaling
- Duplicate orders → idempotency tokens
- Overselling → atomic stock counters / distributed locks
- Network latency / retries → async notifications + consistent read models
- Search across large catalogs → search-optimized DB with pagination and full-text support
- Chunked blob storage for media
- Full-text search & fuzzy search
- CAP theorem considerations (availability vs consistency per service)
