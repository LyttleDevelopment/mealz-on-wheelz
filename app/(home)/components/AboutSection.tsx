import { Container, Grid, Stack, Surface, Text } from '@lyttle-development/ui';
import { SectionHeading } from './SectionHeading';
import styles from '../page.module.scss';

export function AboutSection() {
  return (
    <section id="over-ons" className={styles.section}>
      <Container>
        <Grid columns={1} lgColumns={2} gap="xl" className={styles.aboutGrid}>
          <Stack gap="lg" className={styles.aboutContent}>
            <SectionHeading
              eyebrow="Over ons"
              title="Warm eten, slimme flow en een uitstraling die blijft hangen"
              description="We bouwen events rond comfort, kwaliteit en visuele rust — precies zoals in de Figma: donker, warm, stijlvol en no-nonsense."
            />
            <Text as="p" size="lg" tone="muted" className={styles.bodyCopy}>
              Of je nu een productlancering, trouwfeest, communie of buurtfeest plant: wij zorgen voor een
              formule die klopt van de eerste hap tot de laatste serveerbeurt.
            </Text>
            <div className={styles.statGrid}>
              <Surface tone="muted" padding="lg" radius="xl" className={styles.statCard}>
                <strong>Op maat van jouw publiek</strong>
                <span>Kies een compacte formule of combineer meerdere concepten.</span>
              </Surface>
              <Surface tone="muted" padding="lg" radius="xl" className={styles.statCard}>
                <strong>Mobiel &amp; schaalbaar</strong>
                <span>Van intieme settings tot grotere eventlocaties.</span>
              </Surface>
            </div>
          </Stack>

          <div className={styles.aboutVisual}>
            <div className={styles.aboutPhoto}>
              <div className={styles.aboutBadge}>signature service</div>
              <div className={styles.aboutInset}>
                <span>Streetfood met een premium randje</span>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}

