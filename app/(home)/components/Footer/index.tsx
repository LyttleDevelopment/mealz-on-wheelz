import Link from "next/link";
import { Container } from "@lyttle-development/ui";
import { footerNavigation } from "@data/constants";
import styles from "./index.module.scss";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          {/* Brand column */}
          <div>
            <Link href="/" className={styles.brand}>
              <img
                src="/logo.svg"
                alt="Mealz on Wheelz logo"
                className={styles.brandLogo}
                width={48}
                height={40}
              />
              <span className={styles.brandText}>Mealz on Wheelz</span>
            </Link>
            <p className={styles.tagline}>
              De foodtruckactiviteiten stoppen. Binnenkort starten we als
              restaurant in Moerbeke.
            </p>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("/") ? (
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {year} Mealz on Wheelz.
          </p>
          <a
            className={styles.poweredBy}
            href="https://www.lyttledevelopment.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Lyttle Development
          </a>
        </div>
      </Container>
    </footer>
  );
}
