"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button, Container } from "@lyttle-development/ui";
import { navigation } from "@data/constants";
import styles from "./index.module.scss";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
            <Link href="/" className={styles.brand} onClick={handleBrandClick}>
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
                  <a
                    key={item.href}
                    href={item.href}
                    className={styles.navLink}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <Button asChild variant="secondary" size="lg">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                >
                  Contacteer ons
                </a>
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
              onClick={(e) => {
                setMenuOpen(false);
                if (item.href.startsWith("#")) {
                  e.preventDefault();
                  setTimeout(() => {
                    const target = document.querySelector(item.href);
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }, 320);
                } else if (item.href === "/" && pathname === "/") {
                  e.preventDefault();
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 320);
                }
              }}
            >
              {item.label}
            </a>
          ))}

          <div
            className={styles.mobileNavCta}
            style={{ "--i": navigation.length } as React.CSSProperties}
          >
            <Button asChild variant="secondary" size="lg">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  setTimeout(() => {
                    const target = document.querySelector("#contact");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }, 320);
                }}
              >
                Contacteer ons
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
