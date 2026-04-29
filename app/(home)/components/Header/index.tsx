"use client";

import Link from "next/link";
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
    return () => {
      el.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerShell}>
            <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
              <img
                src="/logo.svg"
                alt="Mealz on Wheelz logo"
                className={styles.brandLogo}
                width={100}
                height={100}
              />
            </Link>

            {/* Desktop right side */}
            <div className={styles.desktopRight}>
              <nav
                className={styles.desktopNav}
                aria-label="Primaire navigatie"
              >
                {navigation.map((item) => (
                  item.href.startsWith("/") ? (
                    <Link key={item.href} href={item.href} className={styles.navLink}>
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      className={styles.navLink}
                    >
                      {item.label}
                    </a>
                  )
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
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => {
                    const target = document.querySelector(item.href);
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }, 320);
                }}
              >
                {item.label}
              </a>
            )
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
