import { Container, Heading, Text } from "@lyttle-development/ui";
import styles from "./index.module.scss";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="over-ons" className={styles.section}>
      <Container className={styles.container}>
        <article className={styles.article}>
          <Heading as="h2" size="4xl">
            Over ons
          </Heading>

          <Text as="p" size="sm">
            Mealz on Wheelz was een foodtruck uit Moerbeke-Waas, met culinaire
            concepten zoals pasta&apos;s, streetfood en BBQ-gerechten. Op deze
            website vind je een terugblik op onze foodtruckperiode.
            <br />
            <br />
            De foodtruckactiviteiten stoppen. Binnenkort starten we als
            restaurant in Moerbeke onder een nieuwe naam.
          </Text>
        </article>
        <article className={styles.imageContainer}>
          <Image
            src={"/media/truck-kitchen.webp"}
            alt={"Truck Kitchen"}
            width={800}
            height={600}
            className={styles.image}
          />
        </article>
      </Container>
    </section>
  );
}
