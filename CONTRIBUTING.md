# Contributing to NexusTimer

Welcome to the NexusTimer project! We appreciate your interest in contributing to our open-source project. Your contributions help us improve and enhance the project for all users. Here are some guidelines to get you started:

## Code of Conduct

Before you begin contributing, please read and adhere to our [Code of Conduct](https://www.contributor-covenant.org/version/1/4/code-of-conduct/). We expect all contributors to follow these guidelines to ensure a welcoming and inclusive environment.

## Getting Started

- If you want:
    - to **report a bug** or **suggest a change**, please open an issue.
    - to **develop new functions** or **fix a bug**, please request it in the issues section.
    - to **translate the app** into your language, please open an issue.

If you want to **contribute code**:

1. Fork the repository.
2. Rename the `.env.local.example` file to `.env.local` (secrets are optional in case you won't code on UI sections that don't need them, most part of the working areas are not related to them).
3. Install the dependencies with `pnpm install`.
4. Run the development server with `pnpm run dev`.
5. Before submitting a pull request, ensure that your code compiles by running `pnpm run build`.

### Environment and .env variables (for contributors)

Not all project features require environment variables to function. You can run the app without configuring these variables, but features that depend on them will be disabled.

| Variable                          | Description                | When do I need it?                                                                                            |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------|
| MONGODB_URI                       | MongoDB connection string  | Save and load backups, register users, all community section                                                  |
| NEXT_PUBLIC_API_KEY               | Firebase public API key    | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_AUTH_DOMAIN           | Firebase auth domain       | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_PROJECT_ID            | Firebase project ID        | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_STORAGE_BUCKET        | Firebase storage bucket    | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_MESSAGING_SENDER_ID   | Firebase sender ID         | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_APP_ID                | Firebase app ID            | Free Mode (Realtime multiplayer)                                                                              |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | Cloudinary cloud name      | Change user profile picture                                                                                   |
| NEXT_PUBLIC_CLOUDINARY_API_KEY    | Cloudinary public API key  | Change user profile picture                                                                                   |
| CLOUDINARY_API_SECRET             | Cloudinary API secret      | Change user profile picture                                                                                   |
| GOOGLE_CLIENT_ID                  | Google OAuth client ID     | Login/Register (normally other deeper functions require a signed-in user so you will have to add this anyway) |
| GOOGLE_CLIENT_SECRET              | Google OAuth client secret | Login/Register (normally other deeper functions require a signed-in user so you will have to add this anyway) |
| RESEND_API_KEY                    | Resend API key (emails)    | Test welcome email sending                                                                                    |
| NEXT_PUBLIC_DISCORD_CLIENT_ID     | Discord OAuth client ID    | Login/Register (normally other deeper functions require a signed-in user so you will have to add this anyway) |
| AUTH_DISCORD_ID                   | Discord OAuth client secret | Login/Register (normally other deeper functions require a signed-in user so you will have to add this anyway) |
| AUTH_DISCORD_SECRET               | Discord OAuth client secret | Login/Register (normally other deeper functions require a signed-in user so you will have to add this anyway) |

GOOGLE CALLBACK/AUTH IS: http://localhost:3000/api/auth/callback/google
DISCORD CALLBACK/AUTH IS: http://localhost:3000/api/auth/callback/discord

## Contribution Guidelines

- Ensure your code follows the project's coding standards and conventions.
- Keep your pull request concise and focused on a single issue or feature.
- Provide clear and informative commit messages.
- Be open to feedback and engage in discussions to improve your contribution.
- Respect the project maintainers and other contributors.

## Thank You!

Your contributions help make the project better for everyone. We appreciate your dedication and look forward to collaborating with you!
