import { Container, Text } from "@lyttle-development/ui";
import styles from "../page.module.scss";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerShell}>
          <a href="#home" className={styles.brand}>
            <img
              src="/logo.svg"
              alt="Mealz on Wheelz logo"
              className={styles.brandLogo}
              width={48}
              height={40}
            />
            <span className={styles.brandText}>
              <strong>Mealz on Wheelz</strong>
              <span>foodtruck &amp; event catering</span>
            </span>
          </a>
        </div>

        <div className={styles.footerShell}>
          <Text as="p" size="sm" tone="muted">
            © {year} Mealz on Wheelz. Alle rechten voorbehouden.
          </Text>
        </div>
      </Container>
    </footer>
  );
}
