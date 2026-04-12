import { MapPinned, MessageSquareText, Phone } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Field,
  Grid,
  Heading,
  Input,
  Stack,
  Surface,
  Text,
  Textarea,
} from '@lyttle-development/ui';
import { SectionHeading } from './SectionHeading';
import styles from '../page.module.scss';

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <Container>
        <Grid columns={1} lgColumns={2} gap="xl">
          <Card className={styles.formCard}>
            <CardHeader>
              <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
                Aanvraagformulier
              </Text>
              <CardTitle className={styles.formTitle}>Plan jouw moment met Mealz on Wheelz</CardTitle>
            </CardHeader>
            <CardContent>
              <form className={styles.contactForm}>
                <Field label="Naam" htmlFor="name" required>
                  <Input id="name" name="name" placeholder="Jouw naam" />
                </Field>
                <Field label="E-mail" htmlFor="email" required>
                  <Input id="email" name="email" type="email" placeholder="jij@example.com" />
                </Field>
                <Field label="Telefoon" htmlFor="phone">
                  <Input id="phone" name="phone" type="tel" placeholder="+32 ..." />
                </Field>
                <Field label="Bericht" htmlFor="message" required>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Vertel ons iets over je event, locatie, timing en gewenste formule."
                  />
                </Field>
                <Button type="submit" variant="secondary" size="lg">
                  Verstuur aanvraag
                </Button>
              </form>
            </CardContent>
          </Card>

          <Stack gap="lg" className={styles.contactContent}>
            <SectionHeading
              eyebrow="Contacteer ons"
              title="Snel schakelen, helder afspreken"
              description="Liever rechtstreeks contact? Bel, mail of stuur je datum door en we koppelen snel terug met een eerste voorstel."
            />

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Phone size={18} />
                <div>
                  <strong>Bel ons</strong>
                  <span>+32 (0) 470 00 00 00</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <MessageSquareText size={18} />
                <div>
                  <strong>Mail ons</strong>
                  <span>hallo@mealzonwheelz.be</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <MapPinned size={18} />
                <div>
                  <strong>Werkgebied</strong>
                  <span>Gent, Oost-Vlaanderen en events op aanvraag</span>
                </div>
              </div>
            </div>

            <Surface tone="muted" padding="lg" radius="xl" className={styles.noteCard}>
              <Heading as="h3" size="2xl">Waarom klanten voor ons kiezen</Heading>
              <ul className={styles.featureList}>
                <li>Heldere offerte en snelle opvolging</li>
                <li>Stijlvolle presentatie die bij het event past</li>
                <li>Een compacte crew met veel ervaring op locatie</li>
              </ul>
            </Surface>
          </Stack>
        </Grid>
      </Container>
    </section>
  );
}

