"use client";

import { useRef, useState } from "react";
import { Button, Input, Textarea } from "@lyttle-development/ui";
import { AlertCircle, Send } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { ContactApiResponse } from "@/_lib/contact/schema";
import styles from "./ContactForm.module.scss";

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidPhone(v: string) {
  const d = v.replace(/\D/g, "");
  return d.length >= 7 && d.length <= 15;
}

interface FormState {
  naam: string;
  email: string;
  telefoon: string;
  bericht: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(s: FormState): FormErrors {
  const e: FormErrors = {};
  if (!s.naam.trim()) e.naam = "Naam is verplicht.";
  if (!s.email.trim()) {
    e.email = "E-mailadres is verplicht.";
  } else if (!EMAIL_RE.test(s.email.trim())) {
    e.email = "Vul een geldig e-mailadres in.";
  }
  if (s.telefoon.trim() && !isValidPhone(s.telefoon)) {
    e.telefoon = "Vul een geldig telefoonnummer in.";
  }
  if (!s.bericht.trim() || s.bericht.trim().length < 5) {
    e.bericht = "Bericht is verplicht (min. 5 tekens).";
  }
  return e;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span className={styles.fieldError}>{msg}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactForm() {
  const startedAtRef = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormState>({
    naam: "",
    email: "",
    telefoon: "",
    bericht: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const canSubmit = !isSubmitting && (!!turnstileToken || !siteKey);

  const errorCount = Object.values(errors).filter(Boolean).length;

  function set<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...form, [key]: e.target.value };
      setForm(next);
      if (touched && errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      ...form,
      turnstileToken: turnstileToken ?? "",
      website: honeypot,
      startedAt: startedAtRef.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as ContactApiResponse;
      if (json.ok) {
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Bericht ontvangen!</h3>
        <p className={styles.successText}>
          Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Honeypot */}
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

      {/* Error summary */}
      {touched && errorCount > 0 && (
        <div className={styles.errorSummary} role="alert">
          <AlertCircle size={16} />
          <span>
            Gelieve {errorCount === 1 ? "1 fout" : `${errorCount} fouten`} te
            corrigeren voor u verdergaat.
          </span>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-naam">
          Naam *
        </label>
        <Input
          id="contact-naam"
          placeholder="Jan Janssen"
          value={form.naam}
          onChange={set("naam")}
          data-invalid={errors.naam ? true : undefined}
          required
          autoComplete="name"
        />
        <FieldError msg={errors.naam} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-email">
          E-mail *
        </label>
        <Input
          id="contact-email"
          type="email"
          placeholder="jan@voorbeeld.be"
          value={form.email}
          onChange={set("email")}
          data-invalid={errors.email ? true : undefined}
          required
          autoComplete="email"
        />
        <FieldError msg={errors.email} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-telefoon">
          Telefoonnummer <span className={styles.optional}>(optioneel)</span>
        </label>
        <Input
          id="contact-telefoon"
          type="tel"
          placeholder="+32 470 12 34 56"
          value={form.telefoon}
          onChange={set("telefoon")}
          data-invalid={errors.telefoon ? true : undefined}
          autoComplete="tel"
        />
        <FieldError msg={errors.telefoon} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-bericht">
          Bericht *
        </label>
        <Textarea
          id="contact-bericht"
          rows={5}
          placeholder="Vertel ons meer over uw vraag of hoe we u kunnen helpen…"
          value={form.bericht}
          onChange={set("bericht")}
          data-invalid={errors.bericht ? true : undefined}
          required
        />
        <FieldError msg={errors.bericht} />
      </div>

      {siteKey && (
        <div className={styles.turnstileWrapper}>
          <Turnstile siteKey={siteKey} onSuccess={setTurnstileToken} />
        </div>
      )}

      {submitError && (
        <div className={styles.submitError} role="alert">
          <AlertCircle size={16} />
          <span>{submitError}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className={styles.submitButton}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          "Verzenden…"
        ) : (
          <>
            Verstuur bericht <Send size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
