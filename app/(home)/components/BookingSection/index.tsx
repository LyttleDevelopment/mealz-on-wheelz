import { Button, Container, Heading, Text } from "@lyttle-development/ui";
import { planningSteps } from "../../data/constants";
import styles from "./index.module.scss";

export function BookingSection() {
  return (
    <section id="reserveren" className={styles.section}>
      <Container>
        <div className={styles.bookingBanner}>
          <div className={styles.bookingContent}>
            <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
              Reserveer je event
            </Text>
            <Heading as="h2" size="4xl" className={styles.bookingTitle}>
              Vertel ons je datum, locatie en vibe — wij vertalen het naar een
              voorstel
            </Heading>
            <Text as="p" size="lg" className={styles.bookingText}>
              Voor events, markten of privéfeesten denken we mee over menu,
              serviceflow en opstelling zodat de ervaring even sterk aanvoelt
              als de branding.
            </Text>
            <Button asChild variant="brand" size="lg">
              <a href="#contact">Start je aanvraag</a>
            </Button>
          </div>

          <div className={styles.bookingPanel}>
            {planningSteps.map((step, index) => (
              <div key={step} className={styles.bookingStep}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
