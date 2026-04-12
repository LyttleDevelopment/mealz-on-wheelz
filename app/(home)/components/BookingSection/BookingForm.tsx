"use client";

import { useState } from "react";
import {
  Button,
  Input,
  NativeSelect,
  Switch,
  Textarea,
} from "@lyttle-development/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./index.module.scss";

// ─── Booking-specific experience data ───────────────────────────────────────

const STARTUP_COST = 150;
const MIN_GUESTS = 20;

const BOOKING_EXPERIENCES = [
  {
    title: "Italian Experience",
    cardSubtitle: "Apéro €15,95 · Hoofd v.a. €8",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 15.95,
    aperoDisplay: "€15,95 p.p.",
    hasMain: true,
    mainLabel: "Hoofdgerecht inbegrepen",
    mainPrice: 8,
    mainPriceLabel: "v.a. €8 p.p.",
  },
  {
    title: "Tex-Mex Experience",
    cardSubtitle: "Apéro €11,95 · Burgers v.a. €10",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Burgers inbegrepen",
    mainPrice: 10,
    mainPriceLabel: "v.a. €10 p.p.",
  },
  {
    title: "Barbecue Experience",
    cardSubtitle: "Apéro €11,95 · Formules v.a. €22,95",
    basePrice: 0,
    hasApero: true,
    aperoPrice: 11.95,
    aperoDisplay: "€11,95 p.p.",
    hasMain: true,
    mainLabel: "Formules inbegrepen",
    mainPrice: 22.95,
    mainPriceLabel: "v.a. €22,95 p.p.",
  },
  {
    title: "Sweet Experience",
    cardSubtitle: "€10,95 p.p.",
    basePrice: 10.95,
    hasApero: false,
    aperoPrice: 0,
    aperoDisplay: "",
    hasMain: false,
    mainLabel: "",
    mainPrice: 0,
    mainPriceLabel: "",
  },
] as const;

type BookingExperience = (typeof BOOKING_EXPERIENCES)[number];

// ─── State types ─────────────────────────────────────────────────────────────

interface ExperienceState {
  experience: BookingExperience;
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEuro(amount: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function calcTotal(exp: ExperienceState) {
  const perPerson =
    exp.experience.basePrice +
    (exp.includeApero && exp.experience.hasApero
      ? exp.experience.aperoPrice
      : 0) +
    (exp.includeMain && exp.experience.hasMain ? exp.experience.mainPrice : 0);
  return STARTUP_COST + exp.guestCount * perPerson;
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

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
  const total = calcTotal(state);
  const exp = state.experience;

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Kies uw experience</h3>
        <p className={styles.stepDescription}>
          Selecteer een formule en stel uw opties in
        </p>
      </div>

      {/* Experience grid */}
      <div className={styles.experienceGrid}>
        {BOOKING_EXPERIENCES.map((item) => (
          <button
            key={item.title}
            type="button"
            className={styles.experienceCard}
            data-selected={item.title === state.experience.title || undefined}
            onClick={() =>
              onChange({
                ...state,
                experience: item,
                includeApero: false,
                includeMain: false,
              })
            }
          >
            <span className={styles.experienceTitle}>{item.title}</span>
            <span className={styles.experienceSubtitle}>
              {item.cardSubtitle}
            </span>
          </button>
        ))}
      </div>

      {/* Options */}
      <div className={styles.optionsList}>
        {exp.hasApero && (
          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>
              <span>Apéro inbegrepen</span>
              <span className={styles.optionPrice}>{exp.aperoDisplay}</span>
            </div>
            <Switch
              checked={state.includeApero}
              onCheckedChange={(checked) =>
                onChange({ ...state, includeApero: checked })
              }
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
              onCheckedChange={(checked) =>
                onChange({ ...state, includeMain: checked })
              }
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
            value={state.guestCount}
            onChange={(e) =>
              onChange({
                ...state,
                guestCount: Math.max(MIN_GUESTS, Number(e.target.value)),
              })
            }
            className={styles.guestInput}
          />
        </div>
      </div>

      {/* Price summary */}
      <div className={styles.priceBox}>
        <div className={styles.priceBoxContent}>
          <span className={styles.priceBoxLabel}>Geschatte totaalprijs</span>
          <span className={styles.priceBoxAmount}>{formatEuro(total)}</span>
        </div>
        <span className={styles.priceBoxNote}>
          Incl. {formatEuro(STARTUP_COST)} opstartkost
        </span>
      </div>
      <p className={styles.priceDisclaimer}>
        Dit is een schatting. De definitieve prijs wordt bevestigd na overleg.
      </p>

      <Button className={styles.nextButton} onClick={onNext}>
        Verder naar uw gegevens <ArrowRight size={16} />
      </Button>
    </div>
  );
}

// ─── Step 2 – Contact ─────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Bedrijfsevenement",
  "Privéfeest",
  "Huwelijk",
  "Festival",
  "Andere",
];

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
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      onChange({ ...state, [key]: e.target.value });

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Uw gegevens</h3>
        <p className={styles.stepDescription}>
          Vul het formulier in, wij nemen contact met u op voor beschikbaarheid
          en prijs
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Volledige naam *</label>
          <Input
            placeholder="John Doe"
            value={state.naam}
            onChange={set("naam")}
            required
          />
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
            placeholder="(555) 123-4567"
            value={state.telefoon}
            onChange={set("telefoon")}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Type event *</label>
          <NativeSelect
            value={state.typeEvent}
            onChange={set("typeEvent")}
            required
          >
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
          <Input
            type="date"
            value={state.datum}
            onChange={set("datum")}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Locatie event *</label>
          <Input
            placeholder="Adres"
            value={state.locatie}
            onChange={set("locatie")}
            required
          />
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
          <strong>Let op:</strong> Dit is een reservatie-aanvraag, geen
          bevestiging. Wij nemen contact met u op binnen 24 uur om de
          beschikbaarheid te bevestigen en verdere details te bespreken.
        </p>
      </div>

      <div className={styles.buttonRow}>
        <Button
          variant="outline"
          onClick={onBack}
          className={styles.backButton}
        >
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
}: {
  experienceState: ExperienceState;
  contactState: ContactState;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const total = calcTotal(experienceState);
  const exp = experienceState.experience;

  const rows: { label: string; value: string }[] = [
    { label: "Experience", value: exp.title },
    { label: "Apéro", value: experienceState.includeApero ? "Ja" : "Nee" },
    ...(exp.hasMain
      ? [
          {
            label: exp.mainLabel,
            value: experienceState.includeMain ? "Ja" : "Nee",
          },
        ]
      : []),
    { label: "Aantal gasten", value: String(experienceState.guestCount) },
    { label: "Geschatte prijs", value: formatEuro(total) },
    { label: "Naam", value: contactState.naam || "—" },
    { label: "E-mail", value: contactState.email || "—" },
    { label: "Telefoon", value: contactState.telefoon || "—" },
    { label: "Type event", value: contactState.typeEvent || "—" },
    { label: "Datum", value: contactState.datum || "—" },
    { label: "Locatie", value: contactState.locatie || "—" },
  ];

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Controleer uw aanvraag</h3>
        <p className={styles.stepDescription}>
          Alles correct? Dien dan uw reservatie-aanvraag in.
        </p>
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
          <strong>Let op:</strong> Dit is een reservatie-aanvraag, geen
          bevestiging. Wij nemen contact met u op binnen 24 uur.
        </p>
      </div>

      <div className={styles.buttonColumn}>
        <Button
          variant="outline"
          onClick={onBack}
          className={styles.backButtonFull}
        >
          <ArrowLeft size={16} /> Terug
        </Button>
        <Button
          variant="secondary"
          onClick={onSubmit}
          className={styles.submitButton}
        >
          Dien reservatie-aanvraag in
        </Button>
      </div>
    </div>
  );
}

// ─── Submitted state ─────────────────────────────────────────────────────────

function SubmittedState() {
  return (
    <div className={styles.submittedState}>
      <div className={styles.submittedIcon}>✓</div>
      <h3 className={styles.stepTitle}>Aanvraag verzonden!</h3>
      <p className={styles.stepDescription}>
        Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op om de
        beschikbaarheid te bevestigen en verdere details te bespreken.
      </p>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function BookingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [experienceState, setExperienceState] = useState<ExperienceState>({
    experience: BOOKING_EXPERIENCES[0],
    includeApero: false,
    includeMain: false,
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

  if (step === 4) {
    return (
      <div className={styles.formCard}>
        <SubmittedState />
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
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
          onSubmit={() => setStep(4)}
        />
      )}
    </div>
  );
}
