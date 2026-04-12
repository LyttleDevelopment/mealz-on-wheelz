"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, Container } from "@lyttle-development/ui";
import { navigation } from "../../data/constants";
import styles from "./index.module.scss";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll while menu is open (both html + body for full browser coverage)
  useEffect(() => {
    const el = document.documentElement;
    if (menuOpen) {
      el.style.overflow = "hidden";
    } else {
      el.style.overflow = "";
    }
    return () => { el.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerShell}>
            <a href="#home" className={styles.brand} onClick={() => setMenuOpen(false)}>
              <img
                src="/logo.svg"
                alt="Mealz on Wheelz logo"
                className={styles.brandLogo}
                width={48}
                height={40}
              />
            </a>

            {/* Desktop right side */}
            <div className={styles.desktopRight}>
              <nav className={styles.desktopNav} aria-label="Primaire navigatie">
                {navigation.map((item) => (
                  <a key={item.href} href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                ))}
              </nav>

              <Button asChild variant="secondary" size="lg">
                <a href="#contact">Contacteer ons</a>
              </Button>
            </div>

            {/* Mobile hamburger button */}
            <button
              className={styles.menuToggle}
              aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Full-screen mobile overlay — outside <header> so position:fixed works correctly
          (backdrop-filter on the header creates a containing block that breaks fixed children) */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobiele navigatie">
          {navigation.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div
            className={styles.mobileNavCta}
            style={{ "--i": navigation.length } as React.CSSProperties}
          >
            <Button asChild variant="secondary" size="lg">
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contacteer ons
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
