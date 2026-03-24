# CosmicDays — Project Brief

## What this app does
User enters their birthday → sees a free preview → pays $1 via Stripe → downloads a personalized PDF report about what happened in space on their birthday.

## User flow
1. Enter date of birth on top page
2. Free preview page shows: APOD photo (blurred) + asteroid count + solar flare class
3. Click "Get Full Report" → Stripe checkout ($1)
4. After payment → PDF generated → download page

---

## Tech stack
- Framework: Next.js (App Router)
- Deploy: Cloudflare Workers (OpenNext adapter)
- Payment: Stripe
- PDF: pdf-lib
- AI narration: OpenRouter API (google/gemini-2.0-flash-lite)
- Language: TypeScript

## Environment variables needed
```
NASA_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
OPENROUTER_API_KEY=
STRIPE_PUBLISHABLE_KEY=
```

---

## API routes to build

### GET /api/apod?date=YYYY-MM-DD
- Calls NASA APOD API
- If response has `copyright` field → skip, use fallback image URL instead
- Returns: { title, url, explanation, hasImage: boolean }
- Fallback image: use a royalty-free NASA image URL from NASA Image Library

### GET /api/asteroids?date=YYYY-MM-DD
- Calls NASA NeoWs API
- Endpoint: https://api.nasa.gov/neo/rest/v1/feed?start_date=DATE&end_date=DATE&api_key=KEY
- Returns: array of { name, diameter_km_min, diameter_km_max, miss_distance_km, velocity_kmh, is_hazardous }
- Sort by miss_distance_km ascending (closest first)

### GET /api/space-weather?date=YYYY-MM-DD
- Calls NASA DONKI API for CME and FLR (solar flare) events
- Endpoint: https://api.nasa.gov/DONKI/FLR?startDate=DATE&endDate=DATE&api_key=KEY
- If no events → return { events: [], summary: "Solar activity was quiet on this day." }
- Returns: { events: [{ type, class, time }], summary: string }

### GET /api/history?month=MM&day=DD
- Calls Wikimedia On This Day API
- Endpoint: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/MM/DD
- Filter results: only keep events containing keywords: space, NASA, rocket, satellite, astronaut, moon, mars, shuttle, apollo, orbit, telescope, comet, asteroid, galaxy, cosmos, launch
- Returns: top 3 events as [{ year, text }]

### POST /api/create-checkout
- Creates Stripe checkout session
- Passes date as metadata: { date: "YYYY-MM-DD" }
- success_url: /success?session_id={CHECKOUT_SESSION_ID}
- cancel_url: /preview?date=YYYY-MM-DD
- Returns: { url: string }

### POST /api/webhook
- Handles Stripe webhook event: checkout.session.completed
- Verifies Stripe signature
- Stores session completion in KV or generates PDF immediately
- Must verify payment before allowing PDF download

### GET /api/generate-pdf?session_id=xxx
- Verifies Stripe session is paid
- Fetches all data (APOD, asteroids, space weather, history)
- Calls Claude API to generate narration text
- Generates PDF using pdf-lib
- Returns PDF binary with Content-Type: application/pdf

---

## Claude API narration prompt (use this exactly)

```
You are a poetic space narrator. Given the following data about what happened in space on {DATE}, write a personal, engaging narrative in English for someone born on that day. Keep it under 200 words. Be warm, specific, and use the actual data provided.

Data:
- APOD: {title} — {explanation_first_2_sentences}
- Asteroids: {asteroid_summary}
- Space weather: {space_weather_summary}
- Historical events: {history_events}

Write the narration now. No preamble, just the narrative.
```

---

## PDF structure (5 sections)
Build with pdf-lib. A4 size. Dark space theme (background #0a0a1a, text white).

1. **Cover** — Title "Your Birthday in Space", date, APOD image (if available)
2. **Space Weather** — Solar flare class, CME events from DONKI
3. **Asteroid Watch** — Closest asteroid: name, size, distance, speed
4. **On This Day in Space** — Up to 3 historical events from Wikipedia
5. **AI Narration** — Full paragraph from Claude API

---

## Pages to build

### / (app/page.tsx)
- Logo: "✦ CosmicDays"
- Headline: "What happened in space the day you were born?"
- Date input (type="date", max=today, min=1950-01-01)
- Submit button → navigates to /preview?date=YYYY-MM-DD
- Simple centered layout, dark background

### /preview (app/preview/page.tsx)
- Receives `date` from URL params
- Fetches /api/apod, /api/asteroids on load
- Shows: APOD image blurred + asteroid count + closest asteroid name only
- Lock banner: "Full report includes AI narration, space weather, history + PDF download"
- CTA button: "Get Full Report — $4.99" → POST to /api/create-checkout → redirect to Stripe

### /success (app/success/page.tsx)
- Receives `session_id` from URL params
- Calls /api/generate-pdf?session_id=xxx
- Shows loading spinner during PDF generation
- Download button when ready
- Share to X button with pre-filled text: "I just got my birthday space report from @CosmicDays 🚀"

---

## Key rules
- All API calls server-side only (never expose NASA_API_KEY to client)
- NASA API free tier: 1000 requests/day — add simple in-memory cache per date
- If any API returns empty/error → show graceful fallback, never crash
- PDF generation can take 10-20 seconds — show progress indicator on /success
- Stripe webhook must verify signature before processing
- No authentication needed — purchase tied to session_id only
