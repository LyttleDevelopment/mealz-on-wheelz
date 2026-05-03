import {
  Card,
  CardContent,
  Container,
  Heading,
  Stack,
  Text,
} from "@lyttle-development/ui";
import { contactInfo } from "../../../../data/constants";
import { ContactForm } from "./ContactForm";
import styles from "./index.module.scss";

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <Container>
        <div className={styles.layout}>
          {/* ── Form ── */}
          <Card className={styles.formCard}>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* ── Info ── */}
          <div className={styles.info}>
            <Stack gap="lg">
              <Heading as="h2" size="4xl">
                Contacteer ons
              </Heading>

              <Text tone="muted" size="md">
                Klaar om ons te boeken voor uw volgende evenement of wilt u
                weten waar we binnenkort te vinden zijn? Vul het formulier in en
                we nemen zo snel mogelijk contact met u op!
              </Text>

              <ul className={styles.contactList}>
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <li key={label} className={styles.contactItem}>
                    <Icon size={18} />
                    <div>
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Stack>
          </div>
        </div>
      </Container>
    </section>
  );
}
