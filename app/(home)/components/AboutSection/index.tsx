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
            Mealz on wheelz is een foodtruck gevestigd in Moerbeke-Waas. Wij
            zijn gespecialiseerd in culinaire ervaringen: van heerlijke pasta's
            en authentieke streetfood tot smaakvolle BBQ-gerechten.
            <br />
            <br />
            Onze missie is om onze klanten te voorzien van hoogwaardige
            maaltijden, bereid met de beste ingrediënten en veel liefde. Wij
            zijn er trots op dat wij een breed gamma aan opties kunnen bieden,
            inclusief vegetarische en veganistische gerechten.
            <br />
            <br />
            Of je nu op zoek bent naar een snelle lunch, een uitgebreid diner of
            catering voor een evenement, bij Mealz on Wheelz ben je aan het
            juiste adres. Ons toegewijd en ervaren team zorgt ervoor dat elke
            maaltijd een onvergetelijke ervaring wordt.
          </Text>
        </article>
        <article className={styles.imageContainer}>
          <Image
            src={"/media/truck-kitchen.webp"}
            alt={"Truck Kitchen"}
            width={500}
            height={500}
            className={styles.image}
          />
        </article>
      </Container>
    </section>
  );
}
