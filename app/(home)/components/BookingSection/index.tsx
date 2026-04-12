import { Container } from "@lyttle-development/ui";
import { BookingForm } from "./BookingForm";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function BookingSection() {
  return (
    <section id="reserveren" className={styles.section}>
      <Container>
        <SectionHeading
          eyebrow="Reservatie"
          title="Reserveer je event"
          description="Plant u een speciaal evenement? Laat ons het eten verzorgen! Vul ons reserveringsformulier in en wij nemen binnen 24 uur contact met u op om de details van uw evenement en de beschikbaarheid te bespreken."
        />
        <BookingForm />
      </Container>
    </section>
  );
}
