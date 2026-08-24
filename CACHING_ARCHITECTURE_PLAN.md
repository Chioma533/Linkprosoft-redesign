# Redis Caching Architecture Plan

## Goal

Reduce repeated reads and external/expensive search calls that can contribute to `429` responses, while keeping user-specific and mutable data correct.

## Priority cache targets

| API/resource | Redis key shape | TTL | Invalidation |
|---|---|---:|---|
| Professional search (`GET/POST /api/search/professionals`) | `search:professionals:{sha256(normalized-query+filters)}` | 60–120s | TTL-only; normalize whitespace, case, defaults, and pagination |
| Skill autocomplete (`GET /api/search/skills`) | `search:skills:{normalized-q}:{limit}` | 10–30m | TTL-only |
| Public/professional profile reads | `profile:{userId}:summary`, `profile:{userId}:skills`, etc. | 1–5m | Delete affected keys after profile/skill/certification/portfolio writes |
| User dashboard summary | `dashboard:{userId}:{role}:{period}` | 15–60s | Delete after job/application/payment/notification changes |
| User job lists | `jobs:user:{userId}:{normalized-filters}` | 15–30s | Delete after job create/update/delete or application changes |
| Approved contacts / thread list | `chat:{userId}:contacts`, `chat:{userId}:threads` | 5–15s | Delete after thread/request changes |
| Chat participant info | `chat:user:{userId}` | 5–15m | Delete after account/profile changes |

Do not cache mutations, payment verification, auth responses, unread/read updates, or message-send responses. Avoid broad message caching unless pagination and invalidation are explicitly designed.

## Required safeguards

1. Add per-IP limits for public search/autocomplete and per-user limits for authenticated search.
2. Return `429` with `Retry-After`; clients should use exponential backoff with jitter and never retry mutations automatically.
3. Use a cache stampede lock (`SET lockKey value NX EX 5`) around expensive misses. Only one request should populate a missing key.
4. Set a short connection/read timeout and fail open to the database/search service when Redis is unavailable.
5. Namespace keys by environment, for example `prod:v1:`; set a schema/version suffix when response shapes change.
6. Never place access tokens, passwords, payment data, or unrestricted private records in shared cache entries.

## Implementation sequence

1. Instrument route counts, latency, cache hit/miss rate, Redis errors, and `429` counts by route.
2. Implement a shared `cache-aside` helper with JSON serialization, TTL, lock protection, and fail-open behavior.
3. Cache skill autocomplete and normalized professional search first.
4. Add dashboard/job/profile caching with explicit invalidation from write handlers.
5. Remove the messaging participant N+1 pattern by returning participant data with threads or adding a batch endpoint.
6. Load-test cold-cache, warm-cache, concurrent-miss, Redis-down, and rate-limit scenarios.

## Acceptance criteria

- Warm-cache search requests do not hit the database/search provider.
- Concurrent misses create one origin request, not one request per caller.
- Job/profile mutations do not leave stale data beyond the documented TTL.
- Redis downtime does not make the API unavailable.
- Search/autocomplete `429` rates and origin request volume decrease measurably.
