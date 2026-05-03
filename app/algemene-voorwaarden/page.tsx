import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@lyttle-development/ui";
import styles from "./page.module.scss";

const sections = [
  {
    title: "Artikel 1 – Definities",
    items: [
      "Mealz on Wheelz: de eenmanszaak/onderneming actief in foodtruck- en cateringdiensten, handelend onder de naam Mealz on Wheelz.",
      "Klant: iedere natuurlijke persoon of rechtspersoon die een overeenkomst aangaat met Mealz on Wheelz.",
      "Overeenkomst: iedere afspraak tussen Mealz on Wheelz en de klant met betrekking tot foodtruck- en/of cateringdiensten.",
      "Diensten: alle door Mealz on Wheelz aangeboden foodtruck-, catering-, leverings- en aanverwante diensten.",
    ],
  },
  {
    title: "Artikel 2 – Toepasselijkheid",
    items: [
      "Deze algemene voorwaarden zijn van toepassing op alle offertes, overeenkomsten en diensten van Mealz on Wheelz.",
      "Afwijkingen van deze voorwaarden zijn enkel geldig indien zij schriftelijk zijn overeengekomen.",
      "De algemene voorwaarden van de klant worden uitdrukkelijk uitgesloten.",
    ],
  },
  {
    title: "Artikel 3 – Offertes en totstandkoming van de overeenkomst",
    items: [
      "Alle offertes zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld.",
      "Een overeenkomst komt tot stand na schriftelijke bevestiging door Mealz on Wheelz of na aanvaarding van de offerte door de klant.",
      "Wijzigingen aan de overeenkomst zijn enkel geldig indien schriftelijk bevestigd.",
    ],
  },
  {
    title: "Artikel 4 – Prijzen en betaling",
    items: [
      "Alle prijzen zijn uitgedrukt in euro en inclusief btw, tenzij uitdrukkelijk anders vermeld.",
      "Mealz on Wheelz behoudt zich het recht voor om prijzen aan te passen bij wijzigingen in grondstofprijzen, belastingen of andere kosten.",
      "Voor elke opdracht kan een vaste opstartkost van €150 worden aangerekend, tenzij uitdrukkelijk anders overeengekomen.",
      "Ter bevestiging en reservatie van de overeengekomen datum zal steeds een voorschot worden gevraagd. De overeenkomst is pas definitief na ontvangst van dit voorschot.",
      "Het saldo van de factuur dient betaald te worden binnen 14 dagen na factuurdatum, tenzij anders overeengekomen.",
      "Bij niet-betaling op de vervaldag is van rechtswege en zonder ingebrekestelling een nalatigheidsinterest verschuldigd overeenkomstig de Wet van 2 augustus 2002 betreffende de bestrijding van de betalingsachterstand bij handelstransacties, evenals een forfaitaire schadevergoeding.",
    ],
  },
  {
    title: "Artikel 5 – Annulering en wijziging",
    items: [
      "Annulering door de klant dient schriftelijk te gebeuren.",
      "Tot 14 dagen vóór de geplande datum: geen kosten.",
      "Tussen 14 en 7 dagen vóór de geplande datum: 50% van het overeengekomen voorschotbedrag.",
      "Minder dan 7 dagen vóór de geplande datum: 100% van het overeengekomen voorschotbedrag.",
      "Wijzigingen in het aantal personen, het menu of de praktische organisatie dienen tijdig en schriftelijk te worden doorgegeven.",
    ],
  },
  {
    title: "Artikel 6 – Uitvoering van de diensten",
    items: [
      "Mealz on Wheelz zal de diensten naar beste vermogen en volgens de regels van goed vakmanschap uitvoeren.",
      "De klant staat in voor een geschikte standplaats, toegang tot elektriciteit en/of water indien vereist, en de nodige vergunningen, tenzij anders overeengekomen.",
      "Eventuele vertragingen door overmacht geven geen recht op schadevergoeding.",
    ],
  },
  {
    title: "Artikel 7 – Allergenen en voedselveiligheid",
    items: [
      "Mealz on Wheelz werkt volgens de geldende voedselveiligheidsnormen.",
      "Informatie over allergenen wordt op verzoek verstrekt.",
      "De klant is verantwoordelijk voor het correct informeren van zijn gasten over mogelijke allergenen.",
    ],
  },
  {
    title: "Artikel 8 – Aansprakelijkheid",
    items: [
      "Mealz on Wheelz is niet aansprakelijk voor indirecte schade, gevolgschade of winstderving.",
      "De aansprakelijkheid is in alle gevallen beperkt tot het bedrag van de betreffende overeenkomst.",
      "Mealz on Wheelz is niet aansprakelijk voor schade veroorzaakt door onjuiste informatie verstrekt door de klant.",
    ],
  },
  {
    title: "Artikel 9 – Overmacht",
    items: [
      "Onder overmacht wordt verstaan: elke omstandigheid buiten de wil van Mealz on Wheelz die de nakoming van de overeenkomst tijdelijk of blijvend verhindert.",
      "In geval van overmacht heeft Mealz on Wheelz het recht de overeenkomst op te schorten of te ontbinden zonder schadevergoeding.",
    ],
  },
  {
    title: "Artikel 10 – Intellectuele eigendom",
    items: [
      "Alle door Mealz on Wheelz gebruikte recepten, concepten en materialen blijven eigendom van Mealz on Wheelz.",
      "Gebruik hiervan door derden is enkel toegestaan na schriftelijke toestemming.",
    ],
  },
  {
    title: "Artikel 11 – Privacy",
    items: [
      "Mealz on Wheelz verwerkt persoonsgegevens conform de geldende privacywetgeving (AVG/GDPR).",
      "Persoonsgegevens worden enkel gebruikt voor de uitvoering van de overeenkomst.",
    ],
  },
  {
    title: "Artikel 12 – Toepasselijk recht en bevoegde rechtbank",
    items: [
      "Op alle overeenkomsten is uitsluitend het Belgisch recht van toepassing.",
      "In geval van betwisting zijn uitsluitend de rechtbanken van het gerechtelijk arrondissement waar de maatschappelijke zetel van Mealz on Wheelz gevestigd is bevoegd.",
    ],
  },
] as const;

const companyDetails = [
  ["Handelsnaam", "Mealz on Wheelz"],
  ["Rechtsvorm", "Eenmanszaak"],
  ["Maatschappelijke zetel", "Damstraat 66, 9180 Lokeren (België)"],
  ["Ondernemingsnummer / btw-nummer", "BE1009.316.771"],
  ["E-mail", "mealzonwheelz-foodtruck@outlook.com"],
  ["Telefoon", "0499/41.03.75"],
] as const;

export const metadata: Metadata = {
  title: "Algemene voorwaarden | Mealz on Wheelz",
  description:
    "Lees de algemene voorwaarden van Mealz on Wheelz voor foodtruck- en cateringdiensten.",
};

export default function TermsPage() {
  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <div className={styles.shell}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Terug naar home
          </Link>

          <section className={styles.hero}>
            <span className={styles.eyebrow}>Juridisch</span>
            <div>
              <h1 className={styles.title}>Algemene voorwaarden</h1>
              <p className={styles.description}>
                Hieronder vindt u de algemene voorwaarden van Mealz on Wheelz,
                van toepassing op offertes, reservaties en cateringdiensten.
              </p>
            </div>

            <div className={styles.metaGrid}>
              <div className={styles.metaCard}>
                <strong>Reservatie wordt definitief na voorschot</strong>
                <span>
                  Een overeengekomen datum wordt pas definitief vastgelegd na
                  ontvangst van het voorschot.
                </span>
              </div>
              <div className={styles.metaCard}>
                <strong>Saldo binnen 14 dagen</strong>
                <span>
                  Tenzij anders overeengekomen, dient het resterende saldo
                  binnen 14 dagen na factuurdatum te worden betaald.
                </span>
              </div>
              <div className={styles.metaCard}>
                <strong>Belgisch recht van toepassing</strong>
                <span>
                  Eventuele betwistingen vallen onder de bevoegde rechtbanken
                  volgens het Belgisch recht.
                </span>
              </div>
            </div>
          </section>

          <div className={styles.contentGrid}>
            <article className={styles.article}>
              <div className={styles.sectionList}>
                {sections.map((section) => (
                  <section key={section.title} className={styles.section}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <ol className={styles.sectionListItems}>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </article>

            <aside className={styles.sidebar}>
              <section className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>Ondernemingsgegevens</h2>
                <div className={styles.companyCard}>
                  {companyDetails.map(([label, value]) => (
                    <div key={label} className={styles.companyRow}>
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>Belangrijke opmerking</h2>
                <p className={styles.footerNote}>
                  Deze algemene voorwaarden zijn opgesteld overeenkomstig het
                  Belgisch recht en zijn bedoeld als algemeen model voor een
                  foodtruck- en cateringonderneming.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}
