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

A single local MongoDB instance. That's it.

### Environment variables

The only variable you need for standard development is the MongoDB connection, already set up to point at the Docker container. In your `.env.local`

```
MONGODB_URI=mongodb://localhost:27017/nxtimer-dev
```

Leave every other variable as-is unless your PR touches that specific feature, it's not required to configure everything.

## Contribution Guidelines

- Ensure your code follows the project's coding standards and conventions.
- Keep your pull request concise and focused on a single issue or feature.
- Provide clear and informative commit messages.
- Be open to feedback and engage in discussions to improve your contribution.
- Respect the project maintainers and other contributors.

## Thank You!

Your contributions help make the project better for everyone. We appreciate your dedication and look forward to collaborating with you!
