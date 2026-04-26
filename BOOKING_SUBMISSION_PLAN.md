# Booking Submission Implementation Plan

## Purpose

This document defines the implementation plan for turning the existing booking UI in `app/(home)/components/BookingSection/BookingForm.tsx` into a real submission flow that:

1. sends an internal booking notification email
2. sends a customer acknowledgment email
3. creates a Google Calendar booking-request event
4. resists bot spam and duplicate submissions
5. keeps all secrets on the server

This plan is intended to be executed in the next development session.

---

## Current state

The existing `BookingForm`:

- is fully client-side
- calculates pricing in the browser
- advances to a success state without any network request
- does not yet persist or deliver the booking anywhere

Important current file:

- `app/(home)/components/BookingSection/BookingForm.tsx`

There is already an App Router API pattern in the repo:

- `app/api/health/route.ts`

That makes a route-handler based implementation the best fit.

---

## Recommended architecture

### Core approach

Use a single server-side endpoint:

- `POST /api/booking`

The browser submits the booking request to this route. The route then:

1. validates the payload
2. verifies anti-spam protections
3. recalculates pricing server-side
4. sends the internal email
5. sends the customer email
6. creates a Google Calendar event
7. returns a structured result to the UI

### Why this is the best fit

- avoids exposing secrets in the browser
- centralizes validation and pricing logic
- makes spam protection enforceable
- keeps email and calendar integrations consistent
- fits the existing Next.js App Router project structure

---

## Recommended provider choices

### Email

Use **Resend**.

Why:

- clean integration with Next.js and TypeScript
- easy transactional email setup
- simple API
- good developer experience

### Calendar

Use **Google Calendar API** via a **service account** writing to a **shared booking-request calendar**.

Why:

- no OAuth login flow needed
- stable server-to-server integration
- easier to manage than per-user calendar OAuth
- ideal for internal booking-request placeholders

### Anti-spam

Use a layered approach:

1. Cloudflare Turnstile
2. honeypot field
3. submission timing check
4. rate limiting by IP and email
5. submit-button locking to prevent duplicates

---

## Behavior to implement

### On successful booking request submission

1. Validate all input on the server.
2. Recalculate the estimated total server-side.
3. Send an internal booking email.
4. Send a customer acknowledgment email.
5. Create a Google Calendar **request** event.
6. Return success to the client.
7. Only then show the success state in `BookingForm`.

### Calendar strategy

Do **not** treat the booking as fully confirmed yet.

Because the current form only captures a **date** and not a start/end time, create:

- an **all-day request/tentative event**
- in a dedicated booking-request calendar
- with full details in the description

This keeps staff in control and prevents accidental “real booking” invites.

---

## Exact files to create or update

### Create

- `app/api/booking/route.ts`
- `app/_lib/booking/constants.ts`
- `app/_lib/booking/pricing.ts`
- `app/_lib/booking/schema.ts`
- `app/_lib/booking/env.ts`
- `app/_lib/booking/turnstile.ts`
- `app/_lib/booking/rate-limit.ts`
- `app/_lib/booking/email.ts`
- `app/_lib/booking/calendar.ts`
- `.env.example`

### Update

- `package.json`
- `app/(home)/components/BookingSection/BookingForm.tsx`
- `app/(home)/components/BookingSection/index.module.scss`
- `README.md` (optional but recommended for setup notes)

---

## Dependency list to add

Install these packages:

```bash
npm install zod resend googleapis @upstash/redis @upstash/ratelimit @marsidev/react-turnstile
```

### Package purpose

- `zod` — shared validation and env parsing
- `resend` — email delivery
- `googleapis` — Google Calendar integration
- `@upstash/redis` — rate-limit storage backend
- `@upstash/ratelimit` — route-level throttling
- `@marsidev/react-turnstile` — Turnstile widget in the client form

---

## Environment variables

Add these to `.env.example`:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

RESEND_API_KEY=
BOOKING_FROM_EMAIL=
BOOKING_NOTIFICATION_TO=
BOOKING_REPLY_TO=
BOOKING_NOTIFICATION_CC=

GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=

TURNSTILE_BYPASS_IN_DEV=
```

### Notes

- `BOOKING_FROM_EMAIL` must be from a verified domain in Resend.
- `GOOGLE_CALENDAR_ID` should point to a dedicated internal booking-request calendar.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` will need newline normalization in server code.
- `TURNSTILE_BYPASS_IN_DEV` is optional and should only be used locally.

---

## API contract

### Route

- `POST /api/booking`

### Request payload

Use stable English API keys even though the UI labels are Dutch.

```ts
{
  experienceId: "italian" | "tex-mex" | "barbecue" | "sweet",
  includeApero: boolean,
  includeMain: boolean,
  guestCount: number,

  fullName: string,
  email: string,
  phone: string,
  eventType: string,
  eventDate: string, // YYYY-MM-DD
  location: string,
  notes?: string,

  turnstileToken: string,
  website: string,   // honeypot, must stay empty
  startedAt: number
}
```

### Success response

`201 Created`

```ts
{
  ok: true,
  bookingId: string,
  message: string,
  warnings?: Array<"customer_email_failed" | "calendar_failed">
}
```

### Validation failure

`422 Unprocessable Entity`

```ts
{
  ok: false,
  code: "validation_error",
  fieldErrors: Record<string, string>
}
```

### Spam or rate-limit failure

`429 Too Many Requests`

```ts
{
  ok: false,
  code: "spam_rejected" | "rate_limited",
  message: string
}
```

### Provider failure

`502` or `503`

```ts
{
  ok: false,
  code: "booking_delivery_failed",
  message: string
}
```

Do not expose provider internals to the client.

---

## Shared booking domain structure

### `app/_lib/booking/constants.ts`

Move these out of `BookingForm.tsx`:

- `STARTUP_COST`
- `MIN_GUESTS`
- `BOOKING_EXPERIENCES`
- `EVENT_TYPES`

Also introduce stable `experienceId` values:

- `italian`
- `tex-mex`
- `barbecue`
- `sweet`

This will become the single source of truth for both UI and server logic.

### `app/_lib/booking/pricing.ts`

Move and centralize:

- euro formatting helper
- total-price calculation logic

The API must calculate totals from trusted shared constants rather than client-submitted totals.

### `app/_lib/booking/schema.ts`

Create shared Zod schemas for:

- experience selection
- contact details
- anti-spam fields
- complete request payload
- optional response typing helpers

Validation rules should include:

- valid `experienceId`
- `guestCount >= MIN_GUESTS`
- valid email format
- allowed event type only
- non-empty required strings
- max length limits for notes and text fields
- empty honeypot field
- realistic submission timing

---

## Anti-spam strategy

### 1. Turnstile

Render Turnstile on the final confirmation step in `BookingForm.tsx`.

Client responsibilities:

- obtain a fresh token before submit
- include token in request body

Server responsibilities:

- verify token with Cloudflare
- reject missing or invalid tokens

### 2. Honeypot field

Add a hidden field, e.g. `website`.

Rules:

- field must remain empty
- if filled, treat request as spam

### 3. Submission timing

Capture `startedAt` when the form first mounts or becomes usable.

Rules:

- reject or silently absorb requests submitted unrealistically fast
- recommended minimum threshold: `4 seconds`

### 4. Rate limiting

Use Upstash for:

- per-IP limit: `5 requests / 15 minutes`
- per-email limit: `3 requests / 24 hours`

Recommended keys:

- `booking:ip:{ip}`
- `booking:email:{hash}`

Hash normalized email values before using them as keys.

### 5. Duplicate prevention

On the client:

- disable the submit button while a request is pending

On the server:

- optionally create a short-lived dedupe key using email + date + experience

---

## Email implementation plan

### Provider

Use **Resend**.

### Internal notification email

This is the critical success path.

Send to:

- `BOOKING_NOTIFICATION_TO`
- optional `BOOKING_NOTIFICATION_CC`

Include:

- booking ID
- customer name
- customer email
- phone number
- event type
- event date
- location
- selected experience
- apero/main options
- guest count
- estimated total
- notes

Suggested subject:

- `Nieuwe booking aanvraag — {fullName} — {eventDate}`

### Customer acknowledgment email

Send after the internal email succeeds.

Content should state:

- booking request received
- not yet confirmed
- team will follow up within 24 hours

Include:

- booking ID
- summary of the request

### Phase 1 email templates

Keep templates simple:

- plain text
- lightweight HTML strings

No extra email rendering library is needed yet.

---

## Google Calendar implementation plan

### Authentication

Use a Google service account with access to a shared calendar.

Do not use OAuth in phase 1.

### Event behavior

Create an internal booking-request event only after validation and internal email success.

Recommended event shape:

- summary: `Booking aanvraag — {fullName} — {eventType}`
- type: all-day event
- date: `eventDate`
- transparency: `transparent`
- description: full booking summary
- private metadata: `bookingId`

### Why all-day

The current form only captures a date, not a start time or end time.

That makes an all-day placeholder the safest and most honest representation until the booking is confirmed manually.

---

## Error-handling policy

### Hard failures

These should block success:

- schema validation failure
- Turnstile verification failure
- honeypot hit
- rate-limit rejection
- internal email failure

### Soft failures

These may still allow success:

- customer acknowledgment email failed
- Google Calendar event creation failed

If those fail:

- log the issue server-side
- return success with warning flags
- keep the UI user-safe

### Logging guidance

Log structured information with:

- `bookingId`
- stage (`validation`, `email`, `calendar`, `spam-check`)
- outcome

Do not log secrets.

---

## Planned refactor for `BookingForm.tsx`

### Add state for

- `isSubmitting`
- `submitError`
- `submitWarnings`
- `turnstileToken`
- `startedAt`

### Submit behavior changes

Current behavior:

- step 3 button directly calls `setStep(4)`

Target behavior:

1. click submit
2. validate any remaining client-side requirements
3. send request to `POST /api/booking`
4. if success, move to success state
5. if failure, show inline error and remain on confirmation step

### Keep the existing UX where possible

The multi-step layout can remain intact.
Only the final submission step needs to become async and server-backed.

---

## Implementation phases for the next session

### Phase 1 — shared booking logic

Create:

- `app/_lib/booking/constants.ts`
- `app/_lib/booking/pricing.ts`
- `app/_lib/booking/schema.ts`

Goal:

- centralize all booking rules and remove duplication risk

### Phase 2 — security helpers

Create:

- `app/_lib/booking/env.ts`
- `app/_lib/booking/turnstile.ts`
- `app/_lib/booking/rate-limit.ts`

Goal:

- make anti-spam and env validation ready before provider calls

### Phase 3 — provider helpers

Create:

- `app/_lib/booking/email.ts`
- `app/_lib/booking/calendar.ts`

Goal:

- isolate third-party integrations in server-only modules

### Phase 4 — API route

Create:

- `app/api/booking/route.ts`

Goal:

- orchestrate validation, anti-spam, email, and calendar behavior

### Phase 5 — form integration

Update:

- `app/(home)/components/BookingSection/BookingForm.tsx`
- `app/(home)/components/BookingSection/index.module.scss`

Goal:

- wire real submission into the existing UI

### Phase 6 — config and polish

Create/update:

- `.env.example`
- `README.md`

Goal:

- document setup so the integration is easy to run in future environments

---

## Testing checklist

### Form behavior

- [ ] Step 1 still calculates correct totals for all experience combinations
- [ ] Minimum guest logic still works
- [ ] Step 2 required fields behave correctly
- [ ] Submit button disables while request is in flight
- [ ] Double-submit is prevented
- [ ] Success state appears only after a successful API response

### Validation

- [ ] Invalid email returns `422`
- [ ] Invalid event type returns `422`
- [ ] Invalid experience ID returns `422`
- [ ] Guest count below minimum returns `422`
- [ ] Missing required fields return field-level validation errors

### Anti-spam

- [ ] Missing Turnstile token is rejected
- [ ] Invalid Turnstile token is rejected
- [ ] Filled honeypot is rejected or silently absorbed
- [ ] Too-fast submission is rejected or silently absorbed
- [ ] Per-IP rate limiting works
- [ ] Per-email rate limiting works

### Email

- [ ] Internal email sends correctly on happy path
- [ ] Customer acknowledgment sends correctly on happy path
- [ ] Internal email failure blocks success
- [ ] Customer email failure returns success with warning

### Calendar

- [ ] Calendar event is created on success
- [ ] Event is all-day
- [ ] Event includes booking ID in private metadata/description
- [ ] Calendar failure returns success with warning

### UX

- [ ] Dutch user-facing copy remains consistent
- [ ] No provider internals are exposed to users
- [ ] Retry/error states are understandable

---

## Final implementation recommendation

For the next session, implement a production-capable phase 1 without a database using:

- `POST /api/booking`
- shared `zod` validation
- Resend for email
- Google service account + shared calendar
- Turnstile + honeypot + timing checks + rate limiting

This gives the best balance of:

- speed to implement
- security
- maintainability
- bot resistance
- operational ease for the client

If persistence is needed later, add a small `bookings` store as phase 2 and make it the source of truth for retries and audit history.

