import { Button, Heading, Text } from "@lyttle-development/ui";
import styles from "./index.module.scss";

export function HeroSection() {
  return (
    <section className={styles.heroShell}>
      <article className={styles.heroContent}>
        <Heading as="h1" size="6xl" className={styles.heroTitle}>
          Mealz on Wheelz
        </Heading>
        <Text as="p" size="lg" className={styles.heroText}>
          Mealz on Wheelz was een foodtruck uit Moerbeke-Waas met pasta&apos;s,
          streetfood en BBQ. De foodtruckactiviteiten stoppen; binnenkort starten
          we als restaurant in Moerbeke.
        </Text>
        <div className={styles.heroActions}>
          <Button asChild variant="secondary" size="lg">
            <a href="#menu">Bekijk het oude menu</a>
          </Button>
        </div>
      </article>
    </section>
  );
}
