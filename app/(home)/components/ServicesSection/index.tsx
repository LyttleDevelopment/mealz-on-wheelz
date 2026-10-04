import {
  Container,
  Grid,
  Heading,
  Surface,
  Text,
} from "@lyttle-development/ui";
import { services } from "@data/constants";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function ServicesSection() {
  return (
    <section id="diensten" className={styles.section}>
      <Container>
        <SectionHeading
          title="Foodtruckconcepten van toen"
          description="Een overzicht van de concepten uit onze foodtruckperiode."
        />

        <Grid columns={1} mdColumns={3} gap="lg">
          {services.map(({ icon: Icon, title, description }) => (
            <Surface
              key={title}
              tone="muted"
              padding="lg"
              radius="xl"
              shadow="md"
              className={styles.serviceCard}
            >
              <div className={styles.serviceIcon}>
                <Icon size={20} />
              </div>
              <Heading as="h3" size="2xl" className={styles.serviceTitle}>
                {title}
              </Heading>
              <Text as="p" size="md" tone="muted">
                {description}
              </Text>
            </Surface>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
