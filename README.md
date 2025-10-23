# automation-test-spa

## Notes

- The `VirtualList` component includes a simulated network delay when the visible page/range changes. Each refresh triggers a random 2–5 second delay and displays a loader overlay to mimic heavy API calls. This is intended for testing and performance simulation.

## Local API server (dev)

For easier control over simulated delays, a small local API server is available. It reads `server/config.json` for local defaults, but the app no longer exposes a `/api/config` endpoint in production; configuration is read from environment variables with safe defaults.

To run it in development:

```bash
pnpm api
```

Then start the app as usual:

```bash
pnpm dev
```

Local dev quickstart

1. Install dependencies if you haven't already:

```bash
pnpm install
```

2. Start the local API server (optional but recommended for stable delays):

```bash
pnpm api
```

The local API server listens by default on port 4001. For local development it will read `server/config.json` to provide list defaults if environment variables are not set.

3. In another terminal start the Vite dev server:

```bash
pnpm dev
```

4. Open the app at the address printed by Vite (usually http://localhost:5173).

Configuration

- All configuration is handled via environment variables (set in Vercel or your host). The app uses the following env vars with sensible defaults:

```
VERTICAL_LIST_TOTAL=10000
VERTICAL_LIST_RANGE=50
HORIZONTAL_LIST_TOTAL=100
HORIZONTAL_LIST_RANGE=20
```

For local development you can edit `server/config.json` or set the environment variables locally; the local API server will fall back to `server/config.json` when env vars are not present.

## Deploying to Vercel

You have two options when deploying on Vercel:

1) Use the included serverless function

-- The app no longer relies on a serverless `/api/config` function for production. Use environment variables in Vercel instead.

2) Use an external config API

 - Set a Vite environment variable `VITE_CONFIG_API_URL` in your Vercel project settings to point to your config endpoint (for example, `https://example.com/config`).
 - The app will prefer this URL when fetching config.

Either approach ensures the app can fetch delay configuration in production. The configuration UI is now a modal within the SPA, not a separate page or route.