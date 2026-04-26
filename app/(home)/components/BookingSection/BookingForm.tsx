"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  NativeSelect,
  Switch,
  Textarea,
} from "@lyttle-development/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import styles from "./index.module.scss";
import {
  BOOKING_EXPERIENCES,
  EVENT_TYPES,
  ExperienceDefinition,
  ExperienceId,
  MIN_GUESTS,
  STARTUP_COST,
} from "@/_lib/booking/constants";
import { calcPricing, formatEuro } from "@/_lib/booking/pricing";
import type { BookingApiResponse } from "@/_lib/booking/schema";

// ─── State types ──────────────────────────────────────────────────────────────

interface ExperienceState {
  experience: ExperienceDefinition | null;
  includeApero: boolean;
  includeMain: boolean;
  guestCount: number;
}

interface ContactState {
  naam: string;
  email: string;
  telefoon: string;
  typeEvent: string;
  datum: string;
  locatie: string;
  bijkomend: string;
}


// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Experience", "Uw gegevens", "Bevestiging"] as const;

function Stepper({ current }: { current: number }) {
  return (
    <div className={styles.stepper}>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div
            key={label}
            className={styles.stepItem}
            data-active={isActive || undefined}
            data-done={isDone || undefined}
          >
            <div className={styles.stepHeader}>
              <span className={styles.stepCircle}>{stepNum}</span>
              <span className={styles.stepLabel}>{label}</span>
            </div>
            <div className={styles.stepLine} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 – Experience ──────────────────────────────────────────────────────

function ExperienceStep({
  state,
  onChange,
  onNext,
}: {
  state: ExperienceState;
  onChange: (s: ExperienceState) => void;
  onNext: () => void;
}) {
  const [guestInput, setGuestInput] = useState(String(state.guestCount));
  const [showOptionError, setShowOptionError] = useState(false);
  const exp = state.experience;

  const pricing = exp
    ? calcPricing(exp.id as ExperienceId, state.includeApero, state.includeMain, state.guestCount)
    : null;
  const total = pricing?.total ?? STARTUP_COST;

  const hasOptions = exp ? exp.hasApero || exp.hasMain : false;
  const atLeastOneSelected = !hasOptions || state.includeApero || state.includeMain;

  useEffect(() => {
    setGuestInput(String(state.guestCount));
  }, [state.guestCount]);

  useEffect(() => {
    if (atLeastOneSelected) setShowOptionError(false);
  }, [atLeastOneSelected]);

  function handleNext() {
    if (!exp) return;
    if (!atLeastOneSelected) {
      setShowOptionError(true);
      return;
    }
    onNext();
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Kies uw experience</h3>
        <p className={styles.stepDescription}>Selecteer een formule en stel uw opties in</p>
      </div>

      <div className={styles.experienceGrid}>
        {BOOKING_EXPERIENCES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.experienceCard}
            data-selected={item.id === state.experience?.id || undefined}
            onClick={() => onChange({ ...state, experience: item })}
          >
            <span className={styles.experienceTitle}>{item.title}</span>
            <span className={styles.experienceSubtitle}>{item.cardSubtitle}</span>
          </button>
        ))}
      </div>

      {exp && (
        <>
          <div className={styles.optionsList}>
            {exp.hasApero && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>
                  <span>Apéro inbegrepen</span>
                  <span className={styles.optionPrice}>{exp.aperoDisplay}</span>
                </div>
                <Switch
                  checked={state.includeApero}
                  onCheckedChange={(checked) => onChange({ ...state, includeApero: checked })}
                />
              </div>
            )}
            {exp.hasMain && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>
                  <span>{exp.mainLabel}</span>
                  <span className={styles.optionPrice}>{exp.mainPriceLabel}</span>
                </div>
                <Switch
                  checked={state.includeMain}
                  onCheckedChange={(checked) => onChange({ ...state, includeMain: checked })}
                />
              </div>
            )}
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>
                <span>Aantal gasten</span>
                <span className={styles.optionPrice}>(min. {MIN_GUESTS})</span>
              </div>
              <Input
                type="number"
                min={MIN_GUESTS}
                value={guestInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setGuestInput(raw);
                  const num = Number(raw);
                  if (!isNaN(num) && num >= MIN_GUESTS) {
                    onChange({ ...state, guestCount: num });
                  }
                }}
                onBlur={() => {
                  const clamped = Math.max(MIN_GUESTS, Number(guestInput) || MIN_GUESTS);
                  setGuestInput(String(clamped));
                  onChange({ ...state, guestCount: clamped });
                }}
                className={styles.guestInput}
              />
            </div>
          </div>

          {showOptionError && (
            <p className={styles.optionError}>
              Selecteer minstens één optie (apéro of hoofdgerecht) om verder te gaan.
            </p>
          )}

          <div className={styles.priceBox}>
            <div className={styles.priceBoxContent}>
              <div>
                <span className={styles.priceBoxLabel}>Geschatte totaalprijs</span>
                <span className={styles.priceBoxNote}>
                  Incl. {formatEuro(STARTUP_COST)} opstartkost
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={styles.priceBoxAmount}>{formatEuro(total)}</span>
                {total > STARTUP_COST && (
                  <span className={styles.priceBoxNote}>
                    ± {formatEuro((total - STARTUP_COST) / state.guestCount)} p.p. (excl. opstart)
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className={styles.priceDisclaimer}>
            Dit is een schatting. De definitieve prijs wordt bevestigd na overleg.
          </p>

          <Button className={styles.nextButton} onClick={handleNext}>
            Verder naar uw gegevens <ArrowRight size={16} />
          </Button>
        </>
      )}
    </div>
  );
}

// ─── Step 2 – Contact ─────────────────────────────────────────────────────────

function ContactStep({
  state,
  onChange,
  onNext,
  onBack,
}: {
  state: ContactState;
  onChange: (s: ContactState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const set =
    <K extends keyof ContactState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...state, [key]: e.target.value });

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Uw gegevens</h3>
        <p className={styles.stepDescription}>
          Vul het formulier in, wij nemen contact met u op voor beschikbaarheid en prijs
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Volledige naam *</label>
          <Input placeholder="John Doe" value={state.naam} onChange={set("naam")} required />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>E-mail *</label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={state.email}
            onChange={set("email")}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Telefoonnummer *</label>
          <Input
            type="tel"
            placeholder="+32 123 45 67 89"
            value={state.telefoon}
            onChange={set("telefoon")}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Type event *</label>
          <NativeSelect value={state.typeEvent} onChange={set("typeEvent")} required>
            <option value="">Kies type event</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Datum event *</label>
          <Input type="date" value={state.datum} onChange={set("datum")} required />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Locatie event *</label>
          <Input placeholder="Adres" value={state.locatie} onChange={set("locatie")} required />
        </div>
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>Bijkomende informatie</label>
        <Textarea
          rows={4}
          placeholder="Vertel ons meer over uw event, voedingsbeperkingen, menuvoorkeuren, opstellingsvereisten, enz."
          value={state.bijkomend}
          onChange={set("bijkomend")}
        />
      </div>

      <div className={styles.alertBox}>
        <p>
          <strong>Let op:</strong> Dit is een reservatie-aanvraag, geen bevestiging. Wij nemen
          contact met u op binnen 24 uur om de beschikbaarheid te bevestigen en verdere details te
          bespreken.
        </p>
      </div>

      <div className={styles.buttonRow}>
        <Button variant="outline" onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={16} /> Terug
        </Button>
        <Button onClick={onNext} className={styles.nextButton}>
          Controleer aanvraag <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 – Bevestiging ─────────────────────────────────────────────────────

function ConfirmationStep({
  experienceState,
  contactState,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
  turnstileToken,
  onTurnstileSuccess,
}: {
  experienceState: ExperienceState;
  contactState: ContactState;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  turnstileToken: string | null;
  onTurnstileSuccess: (token: string) => void;
}) {
  const exp = experienceState.experience;
  if (!exp) return null;

  const pricing = calcPricing(
    exp.id as ExperienceId,
    experienceState.includeApero,
    experienceState.includeMain,
    experienceState.guestCount,
  );

  const rows: { label: string; value: string }[] = [
    { label: "Experience", value: exp.title },
    { label: "Apéro", value: experienceState.includeApero ? "Ja" : "Nee" },
    ...(exp.hasMain
      ? [{ label: exp.mainLabel, value: experienceState.includeMain ? "Ja" : "Nee" }]
      : []),
    { label: "Aantal gasten", value: String(experienceState.guestCount) },
    { label: "Geschatte prijs", value: formatEuro(pricing.total) },
    { label: "Naam", value: contactState.naam || "—" },
    { label: "E-mail", value: contactState.email || "—" },
    { label: "Telefoon", value: contactState.telefoon || "—" },
    { label: "Type event", value: contactState.typeEvent || "—" },
    { label: "Datum", value: contactState.datum || "—" },
    { label: "Locatie", value: contactState.locatie || "—" },
  ];

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const canSubmit = !isSubmitting && (!!turnstileToken || !siteKey);

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Controleer uw aanvraag</h3>
        <p className={styles.stepDescription}>Alles correct? Dien dan uw reservatie-aanvraag in.</p>
      </div>

      <div className={styles.summaryBox}>
        {rows.map((row) => (
          <div key={row.label} className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{row.label}</span>
            <span className={styles.summaryValue}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.alertBox}>
        <p>
          <strong>Let op:</strong> Dit is een reservatie-aanvraag, geen bevestiging. Wij nemen
          contact met u op binnen 24 uur.
        </p>
      </div>

      {siteKey && (
        <div className={styles.turnstileWrapper}>
          <Turnstile siteKey={siteKey} onSuccess={onTurnstileSuccess} />
        </div>
      )}

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      <div className={styles.buttonColumn}>
        <Button
          variant="outline"
          onClick={onBack}
          className={styles.backButtonFull}
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} /> Terug
        </Button>
        <Button
          variant="secondary"
          onClick={onSubmit}
          className={styles.submitButton}
          disabled={!canSubmit}
        >
          {isSubmitting ? "Aanvraag verzenden…" : "Dien reservatie-aanvraag in"}
        </Button>
      </div>
    </div>
  );
}

// ─── Submitted state ──────────────────────────────────────────────────────────

function SubmittedState() {
  return (
    <div className={styles.submittedState}>
      <div className={styles.submittedIcon}>✓</div>
      <h3 className={styles.stepTitle}>Aanvraag verzonden!</h3>
      <p className={styles.stepDescription}>
        Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op om de beschikbaarheid te
        bevestigen en verdere details te bespreken.
      </p>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function BookingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const startedAtRef = useRef<number>(Date.now());

  const [experienceState, setExperienceState] = useState<ExperienceState>({
    experience: null,
    includeApero: false,
    includeMain: true,
    guestCount: MIN_GUESTS,
  });

  const [contactState, setContactState] = useState<ContactState>({
    naam: "",
    email: "",
    telefoon: "",
    typeEvent: "",
    datum: "",
    locatie: "",
    bijkomend: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit() {
    if (!experienceState.experience) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
    const token = turnstileToken ?? (siteKey ? "" : "dev-bypass");

    const payload = {
      experienceId: experienceState.experience.id,
      includeApero: experienceState.includeApero,
      includeMain: experienceState.includeMain,
      guestCount: experienceState.guestCount,
      fullName: contactState.naam,
      email: contactState.email,
      phone: contactState.telefoon,
      eventType: contactState.typeEvent,
      eventDate: contactState.datum,
      location: contactState.locatie,
      notes: contactState.bijkomend || undefined,
      turnstileToken: token,
      website: honeypot,
      startedAt: startedAtRef.current,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as BookingApiResponse;
      if (json.ok) {
        setStep(4);
      } else {
        setSubmitError(
          json.message ??
            "Er is een fout opgetreden. Probeer het opnieuw of neem rechtstreeks contact met ons op.",
        );
      }
    } catch {
      setSubmitError("Verbindingsfout. Controleer uw internetverbinding en probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 4) {
    return (
      <div className={styles.formCard}>
        <SubmittedState />
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      {/* Honeypot – visually hidden, must stay empty */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className={styles.honeypot}
      />

      <Stepper current={step} />

      {step === 1 && (
        <ExperienceStep
          state={experienceState}
          onChange={setExperienceState}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <ContactStep
          state={contactState}
          onChange={setContactState}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ConfirmationStep
          experienceState={experienceState}
          contactState={contactState}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          turnstileToken={turnstileToken}
          onTurnstileSuccess={setTurnstileToken}
        />
      )}
    </div>
  );
}
