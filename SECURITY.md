# Security Policy

PostPilot interacts with third-party services and can publish content to a real LinkedIn account. Security reports should therefore be handled carefully.

## Supported versions

Security fixes are applied to the latest code on the `main` branch.

## Reporting a vulnerability

Please do **not** open a public GitHub issue for a vulnerability that could expose credentials, bypass authorization, publish content without permission, compromise OAuth flows, reveal encrypted tokens, or otherwise affect users or connected services.

Use GitHub's private vulnerability reporting feature from the repository's **Security** tab if it is available. If private vulnerability reporting is not enabled, contact the maintainer privately through GitHub rather than posting exploit details publicly.

When reporting, include:

- a concise description of the issue,
- affected files/endpoints,
- reproduction steps,
- expected vs. actual behavior,
- impact assessment,
- a suggested fix if you have one.

Do not include real access tokens, API keys, OAuth client secrets, production database credentials, or third-party private data. Redact all secrets from screenshots and logs.

## Security-sensitive areas

Extra scrutiny is appropriate for changes involving:

- LinkedIn OAuth and callback validation,
- access-token encryption/decryption,
- `DAILY_JOB_SECRET` authorization,
- manual generation/publishing endpoints,
- GitHub Actions secrets,
- Supabase privileged credentials,
- NVIDIA API credentials,
- duplicate-post protection,
- retry logic around external publishing,
- production environment configuration.

## Secret handling

Never commit or publish:

- `.env` files,
- NVIDIA API keys,
- Supabase secret/service credentials,
- LinkedIn client secrets,
- LinkedIn access or refresh tokens,
- token-encryption keys,
- `DAILY_JOB_SECRET`,
- GitHub Actions secret values.

If a secret is exposed, rotate it immediately with the corresponding provider and update every deployment or automation that depends on it.

## Responsible disclosure

Please allow reasonable time for investigation and remediation before publicly disclosing a vulnerability. Good-faith security research intended to improve PostPilot is welcome.
