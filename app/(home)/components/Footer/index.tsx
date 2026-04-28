import { Container } from "@lyttle-development/ui";
import { footerNavigation } from "../../data/constants";
import styles from "./index.module.scss";

const socialLinks = [
  { label: "f", href: "https://www.facebook.com/people/Mealzonwheelz/61559672413790/", ariaLabel: "Facebook" },
  { label: "ig", href: "https://www.instagram.com/mealzonwheelzfoodtruck", ariaLabel: "Instagram" },
  { label: "TT", href: "https://www.tiktok.com/@mealzonwheelzfoodtruck", ariaLabel: "TikTok" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          {/* Brand column */}
          <div>
            <a href="#home" className={styles.brand}>
              <img
                src="/logo.svg"
                alt="Mealz on Wheelz logo"
                className={styles.brandLogo}
                width={48}
                height={40}
              />
              <span className={styles.brandText}>Mealz on Wheelz</span>
            </a>
            <p className={styles.tagline}>
              Bringing gourmet street food to your neighborhood and events since 2024.
            </p>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow us column */}
          <div>
            <h3 className={styles.colTitle}>Volg ons</h3>
            <p className={styles.socialDesc}>
              Blijf op de hoogte van onze nieuwste formules en speciale aanbiedingen
            </p>
            <div className={styles.socialButtons}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialBtn}
                  aria-label={s.ariaLabel}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {year} Mealz on Wheelz. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
