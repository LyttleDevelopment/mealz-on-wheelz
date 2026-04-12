import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Container,
  Grid,
  Heading,
  Text,
} from "@lyttle-development/ui";
import { experiences } from "../../data/constants";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function FormulasSection() {
  return (
    <section id="menu" className={styles.section}>
      <Container>
        <SectionHeading
          title="Onze formules"
          description="Ontdek onze selectie vers bereide gerechten, gemaakt met ingrediënten van topkwaliteit."
        />

        <Grid columns={1} smColumns={2} lgColumns={4} gap="lg">
          {experiences.map(({ icon: Icon, title, category, priceBadges }) => (
            <Card key={title} className={styles.menuCard}>
              <CardHeader className={styles.menuCardHeader}>
                <div className={styles.menuIcon}>
                  <Icon size={18} />
                </div>
                <Heading as="h3" size="2xl" className={styles.menuTitle}>
                  {title}
                </Heading>
                <Text as="p" size="sm" tone="muted" className={styles.menuCategory}>
                  {category}
                </Text>
              </CardHeader>

              <CardContent className={styles.menuContent}>
                <div className={styles.priceBadges}>
                  {priceBadges.map((badge) => (
                    <span key={badge} className={styles.priceTag}>
                      {badge}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className={styles.menuFooter}>
                <Button variant="outline" className={styles.menuButton}>
                  Bekijk menu →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
