import { ArrowRight } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  Text,
} from "@lyttle-development/ui";
import { experiences } from "../../data/constants";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function FormulasSection() {
  return (
    <section id="formules" className={styles.section}>
      <Container>
        <SectionHeading
          title="Onze formules"
          description="Ontdek onze selectie vers bereide gerechten, gemaakt met ingrediënten van topkwaliteit."
        />

        <Grid columns={1} smColumns={2} lgColumns={4} gap="lg">
          {experiences.map(
            ({
              icon: Icon,
              title,
              subtitle,
              price,
              description,
              highlights,
            }) => (
              <Card key={title} className={styles.menuCard} size="sm">
                <CardHeader className={styles.menuCardHeader}>
                  <div className={styles.menuIcon}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <Text
                      as="p"
                      size="sm"
                      tone="muted"
                      className={styles.menuSubtitle}
                    >
                      {subtitle}
                    </Text>
                  </div>
                  <div className={styles.priceTag}>{price}</div>
                </CardHeader>
                <CardContent className={styles.menuContent}>
                  <Text as="p" size="sm" tone="muted">
                    {description}
                  </Text>
                  <ul className={styles.featureList}>
                    {highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={"outline"}
                    className={styles.menuButton}
                  >
                    <a href="#reserveren">
                      Bekijk menu <ArrowRight size={16} />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ),
          )}
        </Grid>
      </Container>
    </section>
  );
}
