# Environments

This project will use four environments eventually:

- development
- test
- stage
- production

We will configure them gradually as the project grows.

## Current active environment

Branch: `develop`

Environment: `development`

Purpose:

- active development
- local testing
- CI validation
- Auth0 development tenant/application/API
- local backend and frontend

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Current rule

Do not configure an environment before the project actually needs it.

For now, we mainly work on `develop`.

## Future: test

The `test` environment will be configured when we add a deployed test environment.

It will need:

- test branch
- test GitHub Environment
- test Auth0 application/API
- test database
- test deployment workflow
- test environment secrets

## Future: stage

The `stage` environment will be configured when we add staging deployment.

It will need:

- stage branch
- stage GitHub Environment
- staging Auth0 application/API
- staging database
- deployment approval
- production-like configuration

## Future: production

The `production` environment will be configured when the app is ready for real users.

It will need:

- main branch
- production GitHub Environment
- production Auth0 application/API
- production database
- strict branch protection
- required CI checks
- manual deployment approval

## Secret strategy

Frontend variables are public because they are bundled into browser JavaScript.

Safe frontend variables:

- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `VITE_API_BASE_URL`

Never put secrets in frontend variables.

Backend variables can contain private values:

- `DATABASE_URL`
- `AUTH0_AUDIENCE`
- `AUTH0_DOMAIN`
- future API secrets
- future SMS provider secrets

## Required local env files

Backend:

- `.env`
- `.env.test`
- `.env.development.example`
- `.env.test.example`
- `.env.stage.example`
- `.env.production.example`

Frontend:

- `.env`
- `.env.development.example`
- `.env.test.example`
- `.env.stage.example`
- `.env.production.example`

## Testing rule

When backend config requires new environment variables, update:

- backend `.env.example` files
- backend `.env.test.example`
- local backend `.env.test`
- GitHub Actions `env` values if CI needs them
- Vitest setup if loading behavior changes

When frontend config requires new environment variables, update:

- frontend `.env.example` files
- GitHub Actions frontend `env` values
- frontend test setup if needed
