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
docker compose -f docker-compose.dev.yml up -d

pnpm install
pnpm dev
```

### What the Docker setup includes

A single local MongoDB instance, Firebase Emulator, Redis Server and a MinIO instance. That's it.

### Environment variables

`.env.local.example` already points every service at its Docker container, so you don't need to configure anything to start. The defaults cover:

- **MongoDB**: main database (`MONGODB_URI`).
- **Redis**: session cache (`REDIS_URL`). UI at `http://localhost:5540`.
- **Firebase Emulator**: multiplayer / clash mode, no real Firebase project needed. UI at `http://localhost:4000`.
- **MinIO**: S3-compatible file storage, no third-party account needed. Console at `http://localhost:9101` (`minioadmin` / `minioadmin`).

Leave every other variable as-is unless your PR touches that specific feature.

## Contribution Guidelines

- Ensure your code follows the project's coding standards and conventions.
- Keep your pull request concise and focused on a single issue or feature.
- Provide clear and informative commit messages.
- Be open to feedback and engage in discussions to improve your contribution.
- Respect the project maintainers and other contributors.

## Thank You!

Your contributions help make the project better for everyone. We appreciate your dedication and look forward to collaborating with you!
