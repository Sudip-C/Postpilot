# Contributing to PostPilot

Thanks for your interest in contributing to PostPilot.

PostPilot is an open-source automation project that generates, validates, stores, and publishes LinkedIn posts using Node.js, NVIDIA Nemotron, Supabase, LinkedIn OAuth, Vercel, and GitHub Actions.

## Ways to contribute

You can help by:

- fixing bugs,
- improving documentation,
- adding or strengthening tests,
- improving validation and safety checks,
- improving reliability and observability,
- proposing new content strategies,
- improving deployment or self-hosting support,
- adding optional features such as approval workflows or analytics.

## Before you start

Please search existing issues and pull requests before opening a new one. For larger changes, open a feature request first so the implementation approach can be discussed before significant work is done.

Do not include real API keys, OAuth secrets, LinkedIn tokens, Supabase credentials, production URLs containing secrets, or private user data in issues, pull requests, screenshots, logs, or test fixtures.

## Development setup

1. Fork the repository.
2. Clone your fork.
3. Install dependencies.
4. Copy `.env.example` to `.env`.
5. Add your own provider credentials.
6. Run the relevant test scripts before submitting a change.

```bash
git clone https://github.com/<your-username>/Postpilot.git
cd Postpilot
npm install
cp .env.example .env
npm start
```

On Windows PowerShell, you can create the environment file with:

```powershell
Copy-Item .env.example .env
```

## Required external services

Contributors must use their own accounts and credentials for external services:

- NVIDIA NIM / Nemotron
- Supabase
- LinkedIn Developer Platform
- Vercel, if testing deployment
- GitHub Actions, if testing scheduled automation

The maintainers will not provide production credentials or access to the production LinkedIn account, Supabase project, Vercel project, or GitHub secrets.

## Branches

Create a focused branch from `main`:

```bash
git checkout -b feat/short-description
```

Examples:

```text
feat/token-expiry-alerts
fix/linkedin-retry-handling
docs/supabase-setup
test/post-validator-edge-cases
```

## Code style

- Use ES Modules.
- Keep functions focused and explicit.
- Prefer clear service boundaries over tightly coupled logic.
- Validate external input.
- Fail closed for publishing-related errors.
- Never log credentials or access tokens.
- Keep production secrets in environment variables.
- Add tests for behavioral changes where practical.

Match the existing code style in the surrounding file.

## Testing

Run the tests relevant to your change. Useful commands include:

```bash
npm run test:nvidia
npm run test:prompt
npm run test:generator
npm run test:pillars
npm run test:post-types
npm run test:selector
npm run test:supabase
npm run test:posts-table
npm run test:save-post
npm run test:recent-posts
npm run test:linkedin-token
npm run test:linkedin-api
npm run test:validator
npm run test:retry
npm run test:failure
npm run test:job-auth
```

Some integration tests require valid external-service credentials. Publishing-related commands can create real LinkedIn posts, so run them only against accounts you control and only when necessary.

## Commit messages

Use concise, descriptive commit messages. Conventional-style prefixes are encouraged:

```text
feat: add token expiry warning
fix: handle empty provider responses
docs: improve LinkedIn setup guide
test: cover validator URL detection
refactor: simplify daily job orchestration
```

## Pull requests

A good pull request should:

- explain the problem,
- describe the solution,
- stay focused on one concern,
- include testing notes,
- call out any database or environment-variable changes,
- include screenshots only when they materially help,
- contain no secrets or private data.

By submitting a pull request, you agree that your contribution will be licensed under the repository's MIT License.

## Database changes

If your contribution changes the Supabase schema, include the required SQL or migration instructions in the pull request description. Do not assume access to the maintainer's production database.

## Security-sensitive changes

Changes involving authentication, OAuth, encryption, secret handling, publishing permissions, or webhook/job authentication should receive extra scrutiny. Avoid weakening existing authorization checks for convenience.

For vulnerabilities, follow `SECURITY.md` instead of opening a public issue.

## Code of Conduct

Participation in this project is governed by `CODE_OF_CONDUCT.md`.

Thanks for helping improve PostPilot.
