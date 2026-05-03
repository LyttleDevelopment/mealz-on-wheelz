"use client";

import { Button, Heading, Text } from "@lyttle-development/ui";
import styles from "./index.module.scss";

function scrollTo(href: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };
}

export function HeroSection() {
  return (
    <section className={styles.heroShell}>
      <article className={styles.heroContent}>
        <Heading as="h1" size="6xl" className={styles.heroTitle}>
          Mealz on Wheelz
        </Heading>
        <Text as="p" size="lg" className={styles.heroText}>
          Mealz on Wheelz is jouw go-to foodtruck in het Oost-Vlaamse
          Moerbeke-Waas. Wij bieden concepten aan zoals pasta&apos;s, BBQ en nog
          meer. Kom langs of vraag een offerte en ontdek het zelf!
        </Text>
        <div className={styles.heroActions}>
          <Button asChild variant="default" size="lg">
            <a href="#reserveren" onClick={scrollTo("#reserveren")}>Boek ons</a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href="#menu" onClick={scrollTo("#menu")}>Ontdek menu</a>
          </Button>
        </div>
      </article>
    </section>
  );
}
