"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Button,
  Calendar,
  Input,
  NativeSelect,
  Switch,
  Textarea,
} from "@lyttle-development/ui";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { nlBE } from "react-day-picker/locale";
import styles from "./index.module.scss";
import {
  BOOKING_EXPERIENCES,
  EVENT_TYPES,
  ExperienceDefinition,
  ExperienceId,
  getExperienceMainOption,
  getExperienceMaxGuests,
  getExperienceTabSections,
  MIN_GUESTS,
  STARTUP_COST,
} from "@/_lib/booking/constants";
import { calcPricing, formatEuro } from "@/_lib/booking/pricing";
import type {
  BookingApiResponse,
  BookingAvailabilityResponse,
} from "@/_lib/booking/schema";

// ─── State types ──────────────────────────────────────────────────────────────

interface ExperienceState {
  experience: ExperienceDefinition | null;
  includeApero: boolean;
  includeMain: boolean;
  selectedMainOptionId: string | null;
  guestCount: number;
}

interface ContactState {
  naam: string;
  email: string;
  telefoon: string;
  typeEvent: string;
  datum: string;
  tijdstip: string;
  straat: string;
  postcode: string;
  gemeente: string;
  provincie: string;
  bijkomend: string;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTCODE_RE = /^\d{4}$/;

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateFromApi(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const next = new Date(year, month - 1, day);
  next.setHours(0, 0, 0, 0);
  return Number.isNaN(next.getTime()) ? undefined : next;
}

function formatDateLabel(value: string) {
  const date = parseDateFromApi(value);
  if (!date) return "Selecteer een beschikbare datum";

  return new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getAvailabilityRange() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setFullYear(to.getFullYear() + 2);

  return {
    from: formatDateForApi(from),
    to: formatDateForApi(to),
  };
}

function getCompactWeekdayName(date: Date) {
  return new Intl.DateTimeFormat("nl-BE", { weekday: "short" })
    .format(date)
    .replace(".", "")
    .slice(0, 2);
}

function getBookingDayAriaLabel(
  date: Date,
  modifiers: Partial<Record<"today" | "selected" | "disabled" | "booked", boolean>>,
) {
  let label = new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  if (modifiers.today) {
    label = `Vandaag, ${label}`;
  }

  if (modifiers.selected) {
    label = `${label}, geselecteerd`;
  }

  if (modifiers.booked) {
    return `${label}, bezet en niet beschikbaar`;
  }

  if (modifiers.disabled) {
    return `${label}, niet beschikbaar`;
  }

  return `${label}, beschikbaar`;
}

/** Strip non-digit characters and check length is plausible for BE/EU numbers */
function isValidPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function isValidFutureDate(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v);
  if (isNaN(d.getTime())) return false;
  // Compare date-only (ignore time) to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

function isValidTime(v: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

type ContactErrors = Partial<Record<keyof ContactState, string>>;

function validateContact(
  s: ContactState,
  unavailableDates: ReadonlySet<string>,
): ContactErrors {
  const e: ContactErrors = {};
  if (!s.naam.trim()) e.naam = "Naam is verplicht.";
  if (!s.email.trim()) {
    e.email = "E-mailadres is verplicht.";
  } else if (!EMAIL_RE.test(s.email.trim())) {
    e.email = "Vul een geldig e-mailadres in.";
  }
  if (!s.telefoon.trim()) {
    e.telefoon = "Telefoonnummer is verplicht.";
  } else if (!isValidPhone(s.telefoon)) {
    e.telefoon = "Vul een geldig telefoonnummer in.";
  }
  if (!s.typeEvent) e.typeEvent = "Selecteer een type event.";
  if (!s.datum) {
    e.datum = "Datum is verplicht.";
  } else if (unavailableDates.has(s.datum)) {
    e.datum = "Deze datum is niet meer beschikbaar.";
  } else if (!isValidFutureDate(s.datum)) {
    e.datum = "Kies een geldige toekomstige datum.";
  }
  if (!s.tijdstip) {
    e.tijdstip = "Tijdstip is verplicht.";
  } else if (!isValidTime(s.tijdstip)) {
    e.tijdstip = "Voer een geldig tijdstip in.";
  }
  if (!s.straat.trim()) e.straat = "Straatnaam is verplicht.";
  if (!s.postcode.trim()) {
    e.postcode = "Postcode is verplicht.";
  } else if (!POSTCODE_RE.test(s.postcode.trim())) {
    e.postcode = "Voer een geldige Belgische postcode in (4 cijfers).";
  }
  if (!s.gemeente.trim()) e.gemeente = "Gemeente is verplicht.";
  return e;
}

const BELGIAN_PROVINCES = [
  "Antwerpen",
  "Oost-Vlaanderen",
  "West-Vlaanderen",
  "Vlaams-Brabant",
  "Limburg",
  "Brussels Hoofdstedelijk Gewest",
  "Waals-Brabant",
  "Henegouwen",
  "Namen",
  "Luik",
  "Luxemburg",
] as const;

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
  const optionsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const exp = state.experience;
  const maxGuests = exp ? getExperienceMaxGuests(exp.id) : undefined;
  const hasSelectableMainOptions = Boolean(exp?.mainOptions?.length);
  const selectedMainOption = exp
    ? getExperienceMainOption(exp.id, state.selectedMainOptionId)
    : null;

  const pricing = exp
    ? calcPricing(
        exp.id as ExperienceId,
        state.includeApero,
        state.includeMain,
        state.guestCount,
        state.selectedMainOptionId,
      )
    : null;
  const total = pricing?.total ?? STARTUP_COST;

  const hasOptions = exp ? exp.hasApero || exp.hasMain : false;
  const atLeastOneSelected =
    !hasOptions || state.includeApero || state.includeMain;

  // Scroll to options when an experience is first selected
  const prevExpId = useRef<string | null>(null);
  useEffect(() => {
    if (exp && exp.id !== prevExpId.current) {
      prevExpId.current = exp.id;
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  }, [exp]);

  function handleNext() {
    if (!exp) return;
    if (!atLeastOneSelected) {
      setShowOptionError(true);
      return;
    }

    if (state.includeMain && hasSelectableMainOptions && !selectedMainOption) {
      setShowOptionError(true);
      return;
    }

    onNext();
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Kies uw experience</h3>
        <p className={styles.stepDescription}>
          Selecteer een formule en stel uw opties in
        </p>
      </div>

      <div className={styles.experienceGrid}>
        {BOOKING_EXPERIENCES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.experienceCard}
            data-selected={item.id === state.experience?.id || undefined}
            onClick={() => {
              const nextGuestCount = Math.min(
                Math.max(MIN_GUESTS, state.guestCount),
                item.maxGuests,
              );

              setGuestInput(String(nextGuestCount));
              setShowOptionError(false);
              onChange({
                experience: item,
                includeApero: item.hasApero ? state.includeApero : false,
                includeMain: item.hasMain,
                selectedMainOptionId: item.mainOptions?.[0]?.id ?? null,
                guestCount: nextGuestCount,
              });
            }}
          >
            <span className={styles.experienceTitle}>{item.title}</span>
            <span className={styles.experienceSubtitle}>
              {item.cardSubtitle}
            </span>
          </button>
        ))}
      </div>

      {exp && (
        <>
          <div className={styles.optionsList} ref={optionsRef}>
            {exp.hasApero && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>
                  <span>Apéro inbegrepen</span>
                  <span className={styles.optionPrice}>{exp.aperoDisplay}</span>
                </div>
                <Switch
                  checked={state.includeApero}
                  onCheckedChange={(checked) => {
                    setShowOptionError(false);
                    onChange({ ...state, includeApero: checked });
                  }}
                />
              </div>
            )}
            {exp.hasMain && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>
                  <span>{exp.mainLabel}</span>
                  <span className={styles.optionPrice}>
                    {exp.mainPriceLabel}
                  </span>
                </div>
                <Switch
                  checked={state.includeMain}
                  onCheckedChange={(checked) => {
                    setShowOptionError(false);
                    onChange({
                      ...state,
                      includeMain: checked,
                      selectedMainOptionId: checked
                        ? state.selectedMainOptionId ?? exp.mainOptions?.[0]?.id ?? null
                        : state.selectedMainOptionId,
                    });
                  }}
                />
              </div>
            )}
            {state.includeMain && exp.mainOptions && exp.mainOptions.length > 0 && (
              <div className={styles.formulaSelector}>
                {exp.mainOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={styles.formulaCard}
                    data-selected={state.selectedMainOptionId === option.id || undefined}
                    onClick={() => {
                      setShowOptionError(false);
                      onChange({ ...state, selectedMainOptionId: option.id });
                    }}
                  >
                    <span className={styles.formulaCardHeader}>
                      <span className={styles.formulaCardTitle}>{option.label}</span>
                      <span className={styles.formulaCardPrice}>{option.priceLabel}</span>
                    </span>
                    {option.description && (
                      <span className={styles.formulaCardDescription}>
                        {option.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>
                <span>Aantal gasten</span>
                <span className={styles.optionPrice}>
                  (min. {MIN_GUESTS}
                  {maxGuests ? ` · max. ${maxGuests}` : ""})
                </span>
              </div>
              <Input
                type="number"
                min={MIN_GUESTS}
                max={maxGuests}
                value={guestInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setGuestInput(raw);
                  setShowOptionError(false);
                  const num = Number(raw);
                  if (!isNaN(num) && num >= MIN_GUESTS) {
                    onChange({
                      ...state,
                      guestCount: maxGuests ? Math.min(num, maxGuests) : num,
                    });
                  }
                }}
                onBlur={() => {
                  const clamped = Math.min(
                    maxGuests ?? Number.MAX_SAFE_INTEGER,
                    Math.max(MIN_GUESTS, Number(guestInput) || MIN_GUESTS),
                  );
                  setGuestInput(String(clamped));
                  onChange({ ...state, guestCount: clamped });
                }}
                className={styles.guestInput}
              />
            </div>
          </div>

          {showOptionError && (
            <p className={styles.optionError}>
              {state.includeMain && hasSelectableMainOptions && !selectedMainOption
                ? "Kies een formule om verder te gaan."
                : "Selecteer minstens één optie (apéro of hoofdgerecht) om verder te gaan."}
            </p>
          )}

          <div className={styles.experienceDetailPanel}>
            <div className={styles.experienceDetailHeader}>
              <div>
                <p className={styles.experienceDetailEyebrow}>Wat mag u verwachten?</p>
                <h4 className={styles.experienceDetailTitle}>{exp.title}</h4>
              </div>
              <p className={styles.experienceDetailNotice}>{exp.notice}</p>
            </div>

            <div className={styles.experienceDetailGroups}>
              {exp.tabs.map((tab) => (
                <section key={tab.label} className={styles.experienceDetailGroup}>
                  <h5 className={styles.experienceDetailGroupTitle}>{tab.label}</h5>
                  {getExperienceTabSections(tab).map((section, sectionIndex) => (
                    <div
                      key={`${tab.label}-section-${section.title ?? sectionIndex}`}
                      className={styles.experienceDetailSection}
                    >
                      {section.title && (
                        <h6 className={styles.experienceDetailSectionTitle}>
                          {section.title}
                        </h6>
                      )}

                      <div className={styles.experienceDetailItems}>
                        {section.entries.map((entry, index) =>
                          entry.note ? (
                            <p
                              key={`${tab.label}-${section.title ?? sectionIndex}-note-${index}`}
                              className={styles.experienceDetailNote}
                            >
                              {entry.note}
                            </p>
                          ) : (
                            <div
                              key={`${tab.label}-${section.title ?? sectionIndex}-${entry.name}-${index}`}
                              className={styles.experienceDetailItem}
                            >
                              <span>{entry.name}</span>
                              {entry.price && <span>{entry.price}</span>}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>

          <div className={styles.priceBox} ref={summaryRef}>
            <div className={styles.priceBoxContent}>
              <div>
                <span className={styles.priceBoxLabel}>
                  Geschatte totaalprijs
                </span>
                <span className={styles.priceBoxNote}>
                  Incl. {formatEuro(STARTUP_COST)} opstartkost
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={styles.priceBoxAmount}>
                  {formatEuro(total)}
                </span>
                {total > STARTUP_COST && (
                  <span className={styles.priceBoxNote}>
                    ± {formatEuro((total - STARTUP_COST) / Math.max(state.guestCount, 1))}{" "}
                    p.p. (excl. opstart)
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className={styles.priceDisclaimer}>
            Dit is een schatting. De definitieve prijs wordt bevestigd na
            overleg.
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

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span className={styles.fieldError}>{msg}</span>;
}

function ContactStep({
  state,
  onChange,
  onNext,
  onBack,
  unavailableDates,
  availabilityLoading,
  availabilityError,
  onRetryAvailability,
}: {
  state: ContactState;
  onChange: (s: ContactState) => void;
  onNext: () => void;
  onBack: () => void;
  unavailableDates: ReadonlySet<string>;
  availabilityLoading: boolean;
  availabilityError: string | null;
  onRetryAvailability: () => void;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const dateLabelId = useId();
  const dateLegendId = useId();
  const dateStatusId = useId();
  const dateErrorId = useId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = state.datum ? parseDateFromApi(state.datum) : undefined;
  const isSelectedDateUnavailable = state.datum
    ? unavailableDates.has(state.datum)
    : false;
  const isBookedDate = (date: Date) => unavailableDates.has(formatDateForApi(date));
  const calendarStatusText = availabilityLoading
    ? "Beschikbaarheid wordt geladen…"
    : availabilityError
      ? availabilityError
      : isSelectedDateUnavailable
        ? "De gekozen datum is intussen bezet. Kies een andere datum."
        : state.datum
          ? `${formatDateLabel(state.datum)} geselecteerd.`
          : "Nog geen datum geselecteerd.";
  const calendarDescribedBy = [
    dateLegendId,
    dateStatusId,
    errors.datum ? dateErrorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const set =
    <K extends keyof ContactState>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const next = { ...state, [key]: e.target.value };
      onChange(next);
      // Clear this field's error once the user edits it (after first attempt)
      if (touched && errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  function handleNext() {
    setTouched(true);
    const errs = validateContact(state, unavailableDates);

    if (availabilityLoading) {
      errs.datum ??= "Beschikbaarheid wordt nog geladen.";
    }

    if (availabilityError) {
      errs.datum ??= availabilityError;
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
      return;
    }
    onNext();
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className={styles.stepContent} ref={formRef}>
      <div className={styles.stepIntro}>
        <h3 className={styles.stepTitle}>Uw gegevens</h3>
        <p className={styles.stepDescription}>
          Vul het formulier in, wij nemen contact met u op voor beschikbaarheid
          en prijs
        </p>
      </div>

      {touched && errorCount > 0 && (
        <div className={styles.errorSummary} role="alert">
          <AlertCircle size={18} />
          <span>
            Gelieve {errorCount === 1 ? "1 fout" : `${errorCount} fouten`} te
            corrigeren voor u verdergaat.
          </span>
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Name */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Volledige naam *</label>
          <Input
            placeholder="Jan Janssen"
            value={state.naam}
            onChange={set("naam")}
            data-invalid={errors.naam ? true : undefined}
            required
          />
          <FieldError msg={errors.naam} />
        </div>

        {/* Email */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>E-mail *</label>
          <Input
            type="email"
            placeholder="jan@voorbeeld.be"
            value={state.email}
            onChange={set("email")}
            data-invalid={errors.email ? true : undefined}
            required
          />
          <FieldError msg={errors.email} />
        </div>

        {/* Phone */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Telefoonnummer *</label>
          <Input
            type="tel"
            placeholder="+32 470 12 34 56"
            value={state.telefoon}
            onChange={set("telefoon")}
            data-invalid={errors.telefoon ? true : undefined}
            required
          />
          <FieldError msg={errors.telefoon} />
        </div>

        {/* Event type */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Type event *</label>
          <NativeSelect
            value={state.typeEvent}
            onChange={set("typeEvent")}
            data-invalid={errors.typeEvent ? true : undefined}
            required
          >
            <option value="">Kies type event</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
          <FieldError msg={errors.typeEvent} />
        </div>
      </div>

      {/* ── Location (Belgium) ── */}
      <div className={styles.addressSection}>
        <p className={styles.formLabel}>Locatie event *</p>

        <div className={styles.addressGrid}>
          {/* Street name */}
          <div className={`${styles.formField} ${styles.streetField}`}>
            <label className={styles.formLabel}>Straat</label>
            <Input
              placeholder="Kerkstraat 12A"
              value={state.straat}
              onChange={set("straat")}
              data-invalid={errors.straat ? true : undefined}
              autoComplete="address-line1"
            />
            <FieldError msg={errors.straat} />
          </div>

          {/* Postal code */}
          <div className={`${styles.formField} ${styles.postcodeField}`}>
            <label className={styles.formLabel}>Postcode</label>
            <Input
              placeholder="1000"
              value={state.postcode}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                onChange({ ...state, postcode: val });
                if (touched && errors.postcode) {
                  setErrors((prev) => ({ ...prev, postcode: undefined }));
                }
              }}
              inputMode="numeric"
              maxLength={4}
              data-invalid={errors.postcode ? true : undefined}
              autoComplete="postal-code"
            />
            <FieldError msg={errors.postcode} />
          </div>

          {/* City */}
          <div className={`${styles.formField} ${styles.cityField}`}>
            <label className={styles.formLabel}>Gemeente</label>
            <Input
              placeholder="Brussel"
              value={state.gemeente}
              onChange={set("gemeente")}
              data-invalid={errors.gemeente ? true : undefined}
              autoComplete="address-level2"
            />
            <FieldError msg={errors.gemeente} />
          </div>

          {/* Province – helper select, optional */}
          <div className={`${styles.formField} ${styles.provinceField}`}>
            <label className={styles.formLabel}>
              Provincie <span className={styles.optionalHint}>(optioneel)</span>
            </label>
            <NativeSelect
              value={state.provincie}
              onChange={set("provincie")}
              autoComplete="address-level1"
            >
              <option value="">— Kies provincie —</option>
              {BELGIAN_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Notes */}
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

      <div className={styles.scheduleSection}>
        <div className={styles.scheduleHeader}>
          <h4 className={styles.scheduleTitle}>Kies datum en tijdstip</h4>
          <p className={styles.scheduleDescription}>
            We tonen enkel data die al definitief gereserveerd zijn.
          </p>
        </div>

        <div className={styles.scheduleMeta}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Gewenst tijdstip *</label>
            <Input
              type="time"
              value={state.tijdstip}
              onChange={set("tijdstip")}
              data-invalid={errors.tijdstip ? true : undefined}
              required
            />
            <FieldError msg={errors.tijdstip} />
          </div>

          <div className={styles.selectedDateCard}>
            <span className={styles.selectedDateCaption}>Geselecteerde datum</span>
            <strong
              className={styles.selectedDateValue}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatDateLabel(state.datum)}
            </strong>
          </div>
        </div>

        <div className={styles.datePickerCard}>
          <label id={dateLabelId} className={styles.formLabel}>
            Datum event *
          </label>

          <Calendar
            mode="single"
            locale={nlBE}
            labels={{ labelDayButton: getBookingDayAriaLabel }}
            weekStartsOn={1}
            showOutsideDays={false}
            selected={selectedDate}
            onSelect={(date) =>
              onChange({ ...state, datum: date ? formatDateForApi(date) : "" })
            }
            formatters={{ formatWeekdayName: getCompactWeekdayName }}
            modifiers={{ booked: isBookedDate }}
            modifiersClassNames={{ booked: styles.bookingCalendarBookedDay }}
            disabled={[{ before: today }, (date) => availabilityLoading || isBookedDate(date)]}
            className={styles.bookingCalendar}
            aria-labelledby={dateLabelId}
            aria-describedby={calendarDescribedBy}
            aria-invalid={errors.datum ? true : undefined}
          />

          <div
            className={styles.calendarLegend}
            id={dateLegendId}
            aria-label="Legenda voor beschikbare en bezette dagen"
          >
            <span className={styles.calendarLegendItem}>
              <span className={styles.calendarLegendSwatch} />
              Beschikbaar
            </span>
            <span className={styles.calendarLegendItem}>
              <span
                className={`${styles.calendarLegendSwatch} ${styles.calendarLegendSwatchSelected}`}
              />
              Geselecteerd
            </span>
            <span className={styles.calendarLegendItem}>
              <span
                className={`${styles.calendarLegendSwatch} ${styles.calendarLegendSwatchBooked}`}
              />
              Definitief gereserveerd
            </span>
          </div>

          {availabilityLoading && (
            <p className={styles.calendarStatus} id={dateStatusId} role="status">
              Beschikbaarheid wordt geladen…
            </p>
          )}

          {availabilityError && (
            <div className={styles.calendarStatusError} id={dateStatusId} role="alert">
              <span>{availabilityError}</span>
              <Button
                type="button"
                variant="outline"
                className={styles.retryAvailabilityButton}
                onClick={onRetryAvailability}
              >
                Opnieuw laden
              </Button>
            </div>
          )}

          {!availabilityLoading && !availabilityError && isSelectedDateUnavailable && (
            <p className={styles.calendarStatusErrorText} id={dateStatusId} role="status">
              Deze datum is intussen niet meer beschikbaar.
            </p>
          )}

          {!availabilityLoading && !availabilityError && !isSelectedDateUnavailable && (
            <p className={styles.calendarStatus} id={dateStatusId} role="status">
              {calendarStatusText}
            </p>
          )}

          <span id={dateErrorId}>
            <FieldError msg={errors.datum} />
          </span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <Button
          variant="outline"
          onClick={onBack}
          className={styles.backButton}
        >
          <ArrowLeft size={16} /> Terug
        </Button>
        <Button
          onClick={handleNext}
          className={styles.nextButton}
          disabled={availabilityLoading || Boolean(availabilityError)}
        >
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
  availabilityLoading,
  availabilityError,
  isDateUnavailable,
}: {
  experienceState: ExperienceState;
  contactState: ContactState;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  turnstileToken: string | null;
  onTurnstileSuccess: (token: string) => void;
  availabilityLoading: boolean;
  availabilityError: string | null;
  isDateUnavailable: boolean;
}) {
  const exp = experienceState.experience;
  if (!exp) return null;

  const pricing = calcPricing(
    exp.id as ExperienceId,
    experienceState.includeApero,
    experienceState.includeMain,
    experienceState.guestCount,
    experienceState.selectedMainOptionId,
  );
  const mainOption = getExperienceMainOption(
    exp.id as ExperienceId,
    experienceState.selectedMainOptionId,
  );

  const rows: { label: string; value: string }[] = [
    { label: "Experience", value: exp.title },
    { label: "Apéro", value: experienceState.includeApero ? "Ja" : "Nee" },
    ...(experienceState.includeMain && mainOption
      ? [{ label: "Gekozen formule", value: mainOption.label }]
      : []),
    ...(exp.hasMain
      ? [
          {
            label: exp.mainLabel,
            value: experienceState.includeMain ? "Ja" : "Nee",
          },
        ]
      : []),
    { label: "Aantal gasten", value: String(experienceState.guestCount) },
    { label: "Geschatte prijs", value: formatEuro(pricing.total) },
    { label: "Naam", value: contactState.naam || "—" },
    { label: "E-mail", value: contactState.email || "—" },
    { label: "Telefoon", value: contactState.telefoon || "—" },
    { label: "Type event", value: contactState.typeEvent || "—" },
    { label: "Datum", value: contactState.datum ? formatDateLabel(contactState.datum) : "—" },
    { label: "Tijdstip", value: contactState.tijdstip || "—" },
    {
      label: "Locatie",
      value: contactState.straat
        ? `${contactState.straat}, ${contactState.postcode} ${contactState.gemeente}${contactState.provincie ? `, ${contactState.provincie}` : ""}`
        : "—",
    },
  ];

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const canSubmit =
    !isSubmitting &&
    (!!turnstileToken || !siteKey) &&
    !availabilityLoading &&
    !availabilityError &&
    !isDateUnavailable;

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

      {siteKey && (
        <div className={styles.turnstileWrapper}>
          <Turnstile siteKey={siteKey} onSuccess={onTurnstileSuccess} />
        </div>
      )}

      {availabilityLoading && (
        <p className={styles.calendarStatus}>Beschikbaarheid wordt opnieuw gecontroleerd…</p>
      )}

      {availabilityError && <p className={styles.submitError}>{availabilityError}</p>}

      {isDateUnavailable && (
        <p className={styles.submitError}>
          Deze datum is niet meer beschikbaar. Ga terug en kies een andere datum.
        </p>
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
        Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op om de
        beschikbaarheid te bevestigen en verdere details te bespreken.
      </p>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function BookingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const startedAtRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  function goToStep(next: 1 | 2 | 3 | 4) {
    setStep(next);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const [experienceState, setExperienceState] = useState<ExperienceState>({
    experience: null,
    includeApero: false,
    includeMain: true,
    selectedMainOptionId: null,
    guestCount: MIN_GUESTS,
  });

  const [contactState, setContactState] = useState<ContactState>({
    naam: "",
    email: "",
    telefoon: "",
    typeEvent: "",
    datum: "",
    tijdstip: "",
    straat: "",
    postcode: "",
    gemeente: "",
    provincie: "",
    bijkomend: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const unavailableDateSet = useMemo(
    () => new Set(unavailableDates),
    [unavailableDates],
  );

  async function loadAvailability(): Promise<Set<string> | null> {
    setAvailabilityLoading(true);
    setAvailabilityError(null);

    try {
      const range = getAvailabilityRange();
      const params = new URLSearchParams(range);
      const res = await fetch(`/api/booking?${params.toString()}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as BookingAvailabilityResponse;

      if (!res.ok || !json.ok) {
        const message =
          !json.ok
            ? json.message
            : "Beschikbaarheid kon niet geladen worden. Probeer het opnieuw.";
        setAvailabilityError(message);
        return null;
      }

      setUnavailableDates(json.unavailableDates);
      return new Set(json.unavailableDates);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Beschikbaarheid kon niet geladen worden. Probeer het opnieuw.";
      setAvailabilityError(message);
      return null;
    } finally {
      setAvailabilityLoading(false);
    }
  }

  useEffect(() => {
    startedAtRef.current = Date.now();

    const timer = window.setTimeout(() => {
      void loadAvailability();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function handleContactChange(next: ContactState) {
    setContactState(next);
    setSubmitError(null);
  }

  async function handleSubmit() {
    if (!experienceState.experience) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const latestUnavailableDates = await loadAvailability();
    if (!latestUnavailableDates) {
      setSubmitError(
        "Beschikbaarheid kon niet opnieuw worden gecontroleerd. Probeer het opnieuw.",
      );
      setIsSubmitting(false);
      return;
    }

    if (contactState.datum && latestUnavailableDates.has(contactState.datum)) {
      setSubmitError(
        "Deze datum is net niet meer beschikbaar. Kies een andere datum.",
      );
      setIsSubmitting(false);
      return;
    }

    // If no site key is configured, no widget is shown → send empty token.
    // The server will bypass verification when TURNSTILE_BYPASS_IN_DEV=true
    // or when TURNSTILE_SECRET_KEY is not set.
    const token = turnstileToken ?? "";

    const payload = {
      experienceId: experienceState.experience.id,
      includeApero: experienceState.includeApero,
      includeMain: experienceState.includeMain,
      mainOptionId: experienceState.selectedMainOptionId,
      guestCount: experienceState.guestCount,
      fullName: contactState.naam,
      email: contactState.email,
      phone: contactState.telefoon,
      eventType: contactState.typeEvent,
      eventDate: contactState.datum,
      eventTime: contactState.tijdstip,
      streetName: contactState.straat,
      postalCode: contactState.postcode,
      city: contactState.gemeente,
      province: contactState.provincie || undefined,
      notes: contactState.bijkomend || undefined,
      turnstileToken: token,
      website: honeypot,
      startedAt: startedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as BookingApiResponse;
      if (json.ok) {
        goToStep(4);
      } else {
        setSubmitError(
          json.message ??
            "Er is een fout opgetreden. Probeer het opnieuw of neem rechtstreeks contact met ons op.",
        );
      }
    } catch {
      setSubmitError(
        "Verbindingsfout. Controleer uw internetverbinding en probeer het opnieuw.",
      );
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
    <div className={styles.formCard} ref={cardRef}>
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
          onNext={() => goToStep(2)}
        />
      )}
      {step === 2 && (
        <ContactStep
          state={contactState}
          onChange={handleContactChange}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
          unavailableDates={unavailableDateSet}
          availabilityLoading={availabilityLoading}
          availabilityError={availabilityError}
          onRetryAvailability={() => {
            void loadAvailability();
          }}
        />
      )}
      {step === 3 && (
        <ConfirmationStep
          experienceState={experienceState}
          contactState={contactState}
          onBack={() => goToStep(2)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          turnstileToken={turnstileToken}
          onTurnstileSuccess={setTurnstileToken}
          availabilityLoading={availabilityLoading}
          availabilityError={availabilityError}
          isDateUnavailable={
            !!contactState.datum && unavailableDateSet.has(contactState.datum)
          }
        />
      )}
    </div>
  );
}
