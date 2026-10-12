# UrbanShield

AI-assisted emergency coordination for Metropolics — detect incidents from live city signals, score severity, and coordinate citizens, responders, hospitals, and city authorities.

## What you get

| Desk | Route | Job |
|------|-------|-----|
| Citizen | `/citizen` | Report emergencies, preview AI severity, track coordination |
| Responder | `/responder` | Dispatch board, unit status, mark on-scene / resolve |
| Hospital | `/hospital` | Trauma pre-alerts and bed capacity |
| Authority | `/authority` | City command map + live feeds |

**AI engine** (`src/lib/ai-severity.ts`): rule + city-signal fusion. Swap this module for an LLM/API later without changing the UI.

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `npm` fails on Windows, run via Node:

```bash
node "C:\path\to\nodejs\node_modules\npm\bin\npm-cli.js" install
node "C:\path\to\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

## Deploy to Vercel (recommended)

1. Push this folder to GitHub (or GitLab / Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo.
3. Framework preset: **Next.js** (auto-detected). No env vars required for the demo.
4. Click **Deploy**. You get a public URL like `https://urbanshield.vercel.app`.

Or from the CLI:

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

`vercel.json` pins the region to `bom1` (Mumbai) for lower latency in India — change if needed.

## Deploy alternatives

- **Netlify**: connect repo → build `npm run build` → publish `.next` with Next runtime, or use `@netlify/plugin-nextjs`.
- **Docker** (any cloud VM):

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Then: `docker build -t urbanshield . && docker run -p 3000:3000 urbanshield`

## API surface

- `GET /api/incidents` — incidents + signals + hospitals + units
- `POST /api/incidents` — create report → AI assess → auto-dispatch
- `PATCH /api/incidents/:id` — update status
- `POST /api/assess` — severity preview only
- `GET /api/city-feeds` — live signal snapshot

## Next upgrades

1. Persist incidents in Postgres / Supabase (replace in-memory `store.ts`).
2. Plug OpenAI / Gemini into `assessIncident` for richer triage.
3. Auth (Clerk / NextAuth) per role.
4. Real map (Mapbox / Leaflet) and WebSocket push instead of polling.
5. Connect 911 / traffic / weather APIs into `city-feeds`.
