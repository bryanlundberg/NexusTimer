## Local Development Setup

This guide gets you running NexusTimer locally. For most contributions (UI, statistics, translations, bug fixes) you don't need to configure any environment variables at all.

### Requirements

- Node.js
- pnpm
- Docker

### Quick start

```
git clone https://github.com/bryanlundberg/NexusTimer
cd NexusTimer

cp .env.local.example .env.local
cp services/api/.env.example services/api/.env
docker compose -f docker-compose.dev.yml up -d

pnpm install
pnpm --filter @nexustimer/api dev
pnpm dev
```

Run the API and the web in separate terminals. The web sends every `/api` request to the API at `DEV_API_ORIGIN` (`http://localhost:4100`).

### Environment variables

`.env.local.example` (web) and `services/api/.env.example` (API) already point every service at its Docker container, so you don't need to configure anything to start. The web only reads `DEV_API_ORIGIN` and the Firebase values; everything else belongs to the API. The defaults cover:

- **MongoDB**: main database (`MONGODB_URI`).
- **Redis**: cache and realtime events (`REDIS_URL`). UI at `http://localhost:5540`.
- **Realtime gateway**: chat and presence (`REALTIME_URL`, `REALTIME_SECRET`).
- **Firebase Emulator**: multiplayer / clash mode, no real Firebase project needed. UI at `http://localhost:4000`.
- **MinIO**: S3-compatible file storage, no third-party account needed. Console at `http://localhost:9101` (`minioadmin` / `minioadmin`).
- **Meilisearch**: search index (`MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`).

Leave every other variable as-is unless your PR touches that specific feature.

## Contribution Guidelines

- Ensure your code follows the project's coding standards and conventions.
- Keep your pull request concise and focused on a single issue or feature.
- Provide clear and informative commit messages.
- Be open to feedback and engage in discussions to improve your contribution.
- Respect the project maintainers and other contributors.

## Thank You!

Your contributions help make the project better for everyone. We appreciate your dedication and look forward to collaborating with you!
