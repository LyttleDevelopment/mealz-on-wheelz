import { ChefHat, Clock3, MapPinned, Sparkles } from 'lucide-react';
import { Button, Container, Heading, Stack, Surface, Text } from '@lyttle-development/ui';
import { quickFacts } from '../data/constants';
import styles from '../page.module.scss';

export function HeroSection() {
  return (
    <section id="home" className={styles.section}>
      <Container>
        <div className={styles.heroShell}>
          <div className={styles.heroLayout}>
            <Stack gap="lg" className={styles.heroContent}>
              <Text as="p" size="xs" weight="semibold" className={styles.heroEyebrow}>
                Mobiele smaakbeleving voor events die mogen opvallen
              </Text>
              <Heading as="h1" size="6xl" className={styles.heroTitle}>
                Mealz on Wheelz
              </Heading>
              <Text as="p" size="lg" className={styles.heroText}>
                Mealz on Wheelz is jouw foodtruck partner voor events in en rond Gent. Van een casual
                streetfood vibe tot een verzorgde cateringformule: wij brengen smaak, sfeer en een strakke
                service naar elke locatie.
              </Text>
              <div className={styles.heroActions}>
                <Button asChild variant="brand" size="lg">
                  <a href="#reserveren">Boek ons</a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#formules">Ontdek menu</a>
                </Button>
              </div>

              <div className={styles.heroFacts}>
                {quickFacts.map((fact) => (
                  <div key={fact} className={styles.heroFact}>
                    <Sparkles size={16} />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </Stack>

            <Surface tone="accent" padding="lg" radius="xl" shadow="lg" className={styles.heroPanel}>
              <Text as="p" size="xs" weight="semibold" className={styles.panelEyebrow}>
                Event-ready setup
              </Text>
              <Heading as="h2" size="3xl" className={styles.panelTitle}>
                Een stijlvolle service zonder stress
              </Heading>
              <Text as="p" size="md" className={styles.panelText}>
                We combineren menu, styling en timing in één duidelijke flow zodat jij kan focussen op je gasten.
              </Text>

              <div className={styles.panelList}>
                <div className={styles.panelItem}>
                  <ChefHat size={18} />
                  <div>
                    <strong>Live cooking</strong>
                    <span>vers afgewerkt en vlot geserveerd</span>
                  </div>
                </div>
                <div className={styles.panelItem}>
                  <MapPinned size={18} />
                  <div>
                    <strong>Op locatie</strong>
                    <span>compacte opstelling voor binnen &amp; buiten</span>
                  </div>
                </div>
                <div className={styles.panelItem}>
                  <Clock3 size={18} />
                  <div>
                    <strong>Flexibele planning</strong>
                    <span>van lunchmoment tot avondservice</span>
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </Container>
    </section>
  );
}

