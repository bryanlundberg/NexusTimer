# Rate Limiting Implementation

## Overview
This project uses rate limiting to protect API endpoints from excessive requests and potential abuse. Rate limiting is implemented using **Upstash Redis** with the `@upstash/ratelimit` library.

## Why Upstash?
- **Serverless-first**: Perfect for Next.js and serverless deployments
- **Global low-latency**: Redis instances distributed globally
- **HTTP-based**: Works seamlessly with serverless functions
- **No connection management**: No need to handle Redis connections
- **Analytics**: Built-in rate limit analytics

## Setup

### 1. Create an Upstash Account
1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up or log in
3. Create a new Redis database (choose the region closest to your users)
4. Copy the **REST URL** and **REST TOKEN** from the database details

### 2. Configure Environment Variables
Add the following to your `.env` file:

```env
# Upstash Redis for Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Rate Limit Configuration (optional, defaults shown)
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=60
```

- **UPSTASH_REDIS_REST_URL**: Your Upstash Redis REST URL
- **UPSTASH_REDIS_REST_TOKEN**: Your Upstash Redis REST token
- **RATE_LIMIT_POINTS**: Number of requests allowed per duration (default: 10)
- **RATE_LIMIT_DURATION**: Time window in seconds (default: 60)

## Rate Limiter Types

The application uses different rate limiters with **sliding window** algorithm for different types of operations:

### 1. General Limiter (Default)
- **Points**: 10 requests
- **Duration**: 60 seconds
- **Algorithm**: Sliding Window
- **Usage**: Applied globally via middleware to all API routes

### 2. Auth Limiter
- **Points**: 5 requests
- **Duration**: 60 seconds
- **Algorithm**: Sliding Window
- **Usage**: Authentication endpoints

### 3. Upload Limiter
- **Points**: 3 requests
- **Duration**: 60 seconds
- **Algorithm**: Sliding Window
- **Usage**: File upload endpoints
- **Applied to**:
  - `/api/v1/upload-image`
  - `/api/uploadthing`

### 4. Read Limiter
- **Points**: 30 requests
- **Duration**: 60 seconds
- **Algorithm**: Sliding Window
- **Usage**: Read operations (GET requests)
- **Applied to**:
  - `/api/v1/users` (GET)
  - `/api/v1/users/[id]` (GET)
  - `/api/v1/users/[id]/backup` (GET)
  - `/api/v1/leaderboards` (GET)

### 5. Write Limiter
- **Points**: 10 requests
- **Duration**: 60 seconds
- **Algorithm**: Sliding Window
- **Usage**: Write operations (POST, PATCH, PUT, DELETE)
- **Applied to**:
  - `/api/v1/users` (POST)
  - `/api/v1/users/[id]` (PATCH)
  - `/api/v1/backups` (POST)

## Sliding Window Algorithm
Upstash uses a **sliding window** algorithm which provides more accurate rate limiting compared to fixed windows:
- More precise request counting
- No burst issues at window boundaries
- Better user experience

## Implementation Details

### Middleware
Rate limiting is applied globally to all API routes via middleware located at `src/app/middleware.ts`. This provides a baseline protection for all endpoints.

### Per-Route Rate Limiting
Individual routes have their own rate limiting based on the operation type:
- **Upload operations**: Stricter limits (3 requests/min)
- **Write operations**: Moderate limits (10 requests/min)
- **Read operations**: More generous limits (30 requests/min)

### IP Address Detection
The rate limiter identifies users by their IP address. It checks multiple headers to accurately determine the client IP:
1. `x-forwarded-for` (Most common proxy header)
2. `cf-connecting-ip` (Cloudflare)
3. `x-real-ip` (Nginx/other proxies)
4. Falls back to `'anonymous'` if no IP is found

## Response Format

When a rate limit is exceeded, the API returns:

```json
{
  "error": "Too many requests. Please try again later.",
  "limit": 10,
  "remaining": 0,
  "reset": "2025-10-22T12:34:56.789Z"
}
```

**HTTP Status Code**: `429 Too Many Requests`

**Response Headers**:
- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: ISO 8601 timestamp when the rate limit resets

## Testing

To test rate limiting:

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Use a tool like Postman or cURL to send multiple requests to an API endpoint:
   ```bash
   curl -X GET http://localhost:3000/api/v1/leaderboards
   ```

3. After exceeding the limit, you should receive a `429` response.

## Protected Endpoints

All API routes are protected with rate limiting:

- `/api/auth/[...nextauth]` - Authentication
- `/api/v1/users` - User management
- `/api/v1/users/[id]` - User operations
- `/api/v1/users/[id]/backup` - Backup retrieval
- `/api/v1/backups` - Backup creation
- `/api/v1/leaderboards` - Leaderboard data
- `/api/v1/upload-image` - Image uploads
- `/api/uploadthing` - File uploads

## Customization

To modify rate limits for specific routes:

1. Edit `src/lib/rate-limiter.ts` to adjust limiter configurations:
   ```typescript
   export const customLimiter = new Ratelimit({
     redis,
     limiter: Ratelimit.slidingWindow(20, '60 s'), // 20 requests per minute
     analytics: true,
     prefix: '@upstash/ratelimit:custom',
   });
   ```

2. Import the appropriate limiter in your route file:
   ```typescript
   import { applyRateLimit, customLimiter } from '@/lib/rate-limiter';

   export async function GET(request: Request) {
     const rateLimitResponse = await applyRateLimit(request, customLimiter);
     if (rateLimitResponse) return rateLimitResponse;
     
     // Your route logic here
   }
   ```

### Available Algorithms
Upstash supports multiple algorithms:
- `Ratelimit.slidingWindow(requests, window)` - Most accurate (recommended)
- `Ratelimit.fixedWindow(requests, window)` - Simple and fast
- `Ratelimit.tokenBucket(refillRate, bucketSize, refillInterval)` - Allows bursts

Example:
```typescript
// Sliding window: 10 requests per 60 seconds
Ratelimit.slidingWindow(10, '60 s')

// Token bucket: Refill 5 tokens every 10 seconds, max 20 tokens
Ratelimit.tokenBucket(5, 20, '10 s')
```

## Monitoring

Rate limit violations are logged to the console:
```
Rate limit exceeded for IP: 192.168.1.1
```

### Upstash Analytics
Upstash provides built-in analytics for rate limiting:
1. Go to your [Upstash Console](https://console.upstash.com/)
2. Select your Redis database
3. View rate limit analytics in the dashboard
4. Monitor request patterns, top IPs, and rate limit violations

## Production Considerations

1. ✅ **Already Serverless**: Upstash Redis is designed for serverless and works perfectly with Vercel, AWS Lambda, etc.
2. ✅ **Global Distribution**: Choose regions close to your users for low latency
3. **Adjust Limits**: Fine-tune rate limits based on your actual usage patterns
4. **Add Monitoring**: Implement proper logging and alerting for rate limit violations
5. **Whitelist IPs**: Consider whitelisting trusted IPs (e.g., internal services)
6. **Dynamic Limits**: Consider implementing dynamic limits based on user authentication level
7. **Fail-Safe**: The current implementation fails open (allows requests) if Upstash is down

### Cost Optimization
- Upstash offers a generous free tier (10,000 commands/day)
- For production, consider the Pro plan based on your traffic
- Use analytics to optimize your rate limits and reduce unnecessary checks
