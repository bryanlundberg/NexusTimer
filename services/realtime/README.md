# Realtime gateway

Small Go service that keeps browser WebSockets open and forwards Redis Pub/Sub messages to them. It has almost no business logic: the Next.js API saves data, then publishes to `rt:user:{userId}`, and the gateway delivers it to that user's open tabs and devices.

It also owns presence, because holding the sockets is what makes it the only part of the system that knows who is actually reachable.

```
Browser ──POST──► Next.js ──► MongoDB
                        └──PUBLISH──► Redis ──► gateway ──WebSocket──► Browser
```

## Local development

From the repo root, no Go install needed:

```
docker compose -f docker-compose.dev.yml up -d --build realtime
```

With these in `.env.local`:

```
REALTIME_URL=ws://localhost:8080
REALTIME_SECRET=dev-realtime-secret
```