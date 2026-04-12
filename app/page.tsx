import type {LucideIcon} from 'lucide-react';
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Clock3,
  MapPinned,
  MessageSquareText,
  PartyPopper,
  Phone,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
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
import styles from './page.module.scss';

type NavigationItem = {
  label: string;
  href: string;
};

type Experience = {
  title: string;
  subtitle: string;
  price: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type GalleryTile = {
  title: string;
  note: string;
};

const navigation: NavigationItem[] = [
  {label: 'Home', href: '#home'},
  {label: 'Over ons', href: '#over-ons'},
  {label: 'Formules', href: '#formules'},
  {label: 'Diensten', href: '#diensten'},
  {label: 'Galerij', href: '#galerij'},
  {label: 'Contact', href: '#contact'},
];

const experiences: Experience[] = [
  {
    title: 'Italian Experience',
    subtitle: 'Romig comfortfood met een streetfood twist.',
    price: 'Vanaf €14 p.p.',
    description:
      'Verse pasta, zachte focaccia en toppings die ter plekke worden afgewerkt voor een warme, elegante service.',
    highlights: ['Pasta live afgewerkt', 'Vegetarische opties', 'Perfect voor walking dinners'],
    icon: ChefHat,
  },
  {
    title: 'Tex Mex Experience',
    subtitle: 'Vurig, kleurrijk en gemaakt om te delen.',
    price: 'Vanaf €13 p.p.',
    description:
      'Loaded taco’s, bowls en frisse toppings voor events die iets losser, socialer en energieker mogen aanvoelen.',
    highlights: ['Taco bar setup', 'Milde & spicy keuzes', 'Top voor teams en festivals'],
    icon: Sparkles,
  },
  {
    title: 'Barbecue Experience',
    subtitle: 'Robuuste smaken met een premium uitstraling.',
    price: 'Vanaf €18 p.p.',
    description:
      'Low & slow barbecue, seizoenssalades en stevige sharing plates voor events met impact en karakter.',
    highlights: ['Live grill moment', 'Vlees & veggie', 'Sterk voor buitenlocaties'],
    icon: UtensilsCrossed,
  },
  {
    title: 'Sweet Experience',
    subtitle: 'Desserts en verwenmomenten voor elk publiek.',
    price: 'Vanaf €9 p.p.',
    description:
      'Mini desserts, loaded waffles en feestelijke sweets die perfect werken als afsluiter of stand-alone concept.',
    highlights: ['Dessert corner', 'Kinderproof', 'Ideaal voor recepties'],
    icon: PartyPopper,
  },
];

const services: Service[] = [
  {
    title: 'Food truck service',
    description:
      'Een complete mobiele beleving voor festivals, communies, openingen en buurtmomenten — vlot, visueel sterk en snel inzetbaar.',
    icon: Truck,
  },
  {
    title: 'Event catering',
    description:
      'We bouwen een formule op maat voor bedrijven, huwelijken en privéfeesten, inclusief planning, timing en serviceflow.',
    icon: CalendarDays,
  },
  {
    title: 'Food bar concept',
    description:
      'Liever een indoor setup of stijlvolle buffetopstelling? We vertalen dezelfde sfeer naar bars, counters en tasting stations.',
    icon: Store,
  },
];

const gallery: GalleryTile[] = [
  {title: 'City festivals', note: 'Snelle service met een premium look & feel.'},
  {title: 'Private celebrations', note: 'Warm, persoonlijk en afgestemd op jouw gasten.'},
  {title: 'Corporate events', note: 'Van lunch activatie tot avondbeleving.'},
  {title: 'Dessert moments', note: 'Sweet stations die meteen opvallen.'},
];

const quickFacts = [
  'Gent & heel Oost-Vlaanderen',
  'Vanaf kleine groepen tot grotere events',
  'Food, styling en service in één flow',
];

const planningSteps = [
  'Kies je formule of vertel ons jouw idee.',
  'Wij stemmen timing, opstelling en menu af.',
  'Op de dag zelf rollen wij zorgeloos binnen en serveren we met flair.',
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
        {eyebrow}
      </Text>
      <Heading as="h2" size="4xl" className={styles.sectionTitle}>
        {title}
      </Heading>
      <Text as="p" size="lg" tone="muted" className={styles.sectionDescription}>
        {description}
      </Text>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerShell}>
            <a href="#home" className={styles.brand}>
              <span className={styles.brandMark}>MW</span>
              <span className={styles.brandText}>
                <strong>Mealz on Wheelz</strong>
                <span>foodtruck & event catering</span>
              </span>
            </a>

            <nav className={styles.desktopNav} aria-label="Primaire navigatie">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              ))}
            </nav>

            <Button asChild variant="secondary" size="lg">
              <a href="#reserveren">Contacteer ons</a>
            </Button>
          </div>

          <nav className={styles.mobileNav} aria-label="Snelle navigatie">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className={styles.mobileNavLink}>
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </header>

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
                  streetfood vibe tot een verzorgde cateringformule: wij brengen smaak, sfeer en een strakke service naar
                  elke locatie.
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
                      <span>compacte opstelling voor binnen & buiten</span>
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
                Of je nu een productlancering, trouwfeest, communie of buurtfeest plant: wij zorgen voor een formule die klopt van de eerste hap tot de laatste serveerbeurt.
              </Text>

              <div className={styles.statGrid}>
                <Surface tone="muted" padding="lg" radius="xl" className={styles.statCard}>
                  <strong>Op maat van jouw publiek</strong>
                  <span>Kies een compacte formule of combineer meerdere concepten.</span>
                </Surface>
                <Surface tone="muted" padding="lg" radius="xl" className={styles.statCard}>
                  <strong>Mobiel & schaalbaar</strong>
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

      <section id="formules" className={styles.section}>
        <Container>
          <SectionHeading
            eyebrow="Onze formules"
            title="Kies de smaak die past bij jouw event"
            description="Elke formule is opgebouwd voor snelle service, een mooie presentatie en genoeg flexibiliteit om mee te bewegen met jouw moment."
          />

          <Grid columns={1} smColumns={2} lgColumns={4} gap="lg">
            {experiences.map(({icon: Icon, title, subtitle, price, description, highlights}) => (
              <Card key={title} className={styles.menuCard} size="sm">
                <CardHeader className={styles.menuCardHeader}>
                  <div className={styles.menuIcon}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <Text as="p" size="sm" tone="muted" className={styles.menuSubtitle}>
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
                </CardContent>
                <CardFooter className={styles.menuFooter}>
                  <Button asChild variant="ghost">
                    <a href="#reserveren">
                      Bekijk formule <ArrowRight size={16} />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      <section id="diensten" className={styles.section}>
        <Container>
          <SectionHeading
            eyebrow="Onze diensten"
            title="Van foodtruck tot volledig uitgewerkte eventcatering"
            description="We denken niet alleen in gerechten, maar in een totaalervaring die praktisch werkt en visueel klopt op locatie."
          />

          <Grid columns={1} mdColumns={3} gap="lg">
            {services.map(({icon: Icon, title, description}) => (
              <Surface key={title} tone="accent" padding="lg" radius="xl" shadow="md" className={styles.serviceCard}>
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

      <section id="galerij" className={styles.section}>
        <Container>
          <SectionHeading
            eyebrow="Galerij"
            title="Een sfeer die meteen herkenbaar is"
            description="Zachte contrasten, warme accenten en een duidelijke hiërarchie — vertaald naar een webervaring die ook mobiel sterk blijft."
          />

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <article key={item.title} className={styles.galleryTile} data-tone={index % 2 === 0 ? 'light' : 'dark'}>
                <div className={styles.galleryTileInner}>
                  <Text as="p" size="xs" weight="semibold" className={styles.galleryLabel}>
                    0{index + 1}
                  </Text>
                  <Heading as="h3" size="3xl" className={styles.galleryTitle}>
                    {item.title}
                  </Heading>
                  <Text as="p" size="md" tone={index % 2 === 0 ? 'secondary' : 'inverse'}>
                    {item.note}
                  </Text>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="reserveren" className={styles.section}>
        <Container>
          <div className={styles.bookingBanner}>
            <div className={styles.bookingContent}>
              <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
                Reserveer je event
              </Text>
              <Heading as="h2" size="4xl" className={styles.bookingTitle}>
                Vertel ons je datum, locatie en vibe — wij vertalen het naar een voorstel
              </Heading>
              <Text as="p" size="lg" className={styles.bookingText}>
                Voor events, markten of privéfeesten denken we mee over menu, serviceflow en opstelling zodat de ervaring even sterk aanvoelt als de branding.
              </Text>
              <Button asChild variant="brand" size="lg">
                <a href="#contact">Start je aanvraag</a>
              </Button>
            </div>

            <div className={styles.bookingPanel}>
              {planningSteps.map((step, index) => (
                <div key={step} className={styles.bookingStep}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

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
                    <Textarea id="message" name="message" rows={5} placeholder="Vertel ons iets over je event, locatie, timing en gewenste formule." />
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

      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerShell}>
            <a href="#home" className={styles.brand}>
              <span className={styles.brandMark}>MW</span>
              <span className={styles.brandText}>
                <strong>Mealz on Wheelz</strong>
                <span>foodtruck & event catering</span>
              </span>
            </a>
            <Text as="p" size="sm" tone="muted">
              © 2026 Mealz on Wheelz. Ontworpen mobile-first, geïnspireerd op de aangeleverde Figma.
            </Text>
          </div>
        </Container>
      </footer>
    </main>
  );
}

