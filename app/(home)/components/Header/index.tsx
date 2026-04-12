import { Button, Container } from "@lyttle-development/ui";
import { navigation } from "../../data/constants";
import styles from "./index.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerShell}>
          <a href="#home" className={styles.brand}>
            <img
              src="/logo.svg"
              alt="Mealz on Wheelz logo"
              className={styles.brandLogo}
              width={48}
              height={40}
            />
          </a>

          <div>
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
        </div>

        <nav className={styles.mobileNav} aria-label="Snelle navigatie">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
