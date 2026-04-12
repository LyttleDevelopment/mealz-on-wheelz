import { Container } from "@lyttle-development/ui";
import { SectionHeading } from "../SectionHeading";
import { Carousel } from "./Carousel";
import styles from "./index.module.scss";

export function GallerySection() {
  return (
    <section id="galerij" className={styles.section}>
      <Container>
        <SectionHeading title="Galerij" description="Smakelijke sfeerbeelden" />
        <Carousel />
      </Container>
    </section>
  );
}
