# automation-test-spa

## Notes

- The `VirtualList` component includes a simulated network delay when the visible page/range changes. Each refresh triggers a random 2–5 second delay and displays a loader overlay to mimic heavy API calls. This is intended for testing and performance simulation.

## Local API server (dev)

For easier control over simulated delays, a small local API server is available. It serves `server/config.json` at `/api/config`.

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

The local API server listens by default on port 4001 and serves `server/config.json` at `/api/config`.

3. In another terminal start the Vite dev server:

```bash
pnpm dev
```

4. Open the app at the address printed by Vite (usually http://localhost:5173).

Notes about the Config page

- The Config page has a Back button (← Back) that will attempt to navigate back in history or return to `/` if history is empty. When you save overrides, the app will apply them immediately via sessionStorage.

Edit `server/config.json` to change `initialLoadDelaySec` and `scrollLoadDelaySec` and the app will pick those up on reload. The `Config` page also reads from the API and can save overrides into session/local storage at runtime.

## Deploying to Vercel

You have two options when deploying on Vercel:

1) Use the included serverless function

 - The `api/config.js` file will be deployed as a serverless function at `/api/config` by Vercel automatically. This mirrors the dev API and requires no additional environment variables.

2) Use an external config API

 - Set a Vite environment variable `VITE_CONFIG_API_URL` in your Vercel project settings to point to your config endpoint (for example, `https://example.com/config`).
 - The app will prefer this URL when fetching config.

Either approach ensures the app can fetch delay configuration in production. The `/config` page in the app reads and saves overrides to local/session storage for quick testing, but production values should come from the API or Vercel environment variables.