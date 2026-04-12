import { Container } from "@lyttle-development/ui";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function GallerySection() {
  return (
    <section id="galerij" className={styles.section}>
      <Container>
        <SectionHeading title="Galerij" description="Smakelijke sfeerbeelden" />

        {/* Slideshow with images */}
      </Container>
    </section>
  );
}
