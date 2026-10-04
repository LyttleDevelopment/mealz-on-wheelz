"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@lyttle-development/ui";
import { navigation } from "@data/constants";
import styles from "./index.module.scss";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const transitionDialogRef = useRef<HTMLDialogElement>(null);
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

  useEffect(() => {
    const dialog = transitionDialogRef.current;
    if (
      window.sessionStorage.getItem("mow-transition-note-dismissed") !== "true" &&
      dialog &&
      !dialog.open
    ) {
      dialog.showModal();
    }
  }, []);

  const dismissTransitionNote = () => {
    transitionDialogRef.current?.close();
  };

  return (
    <>
      <div className={styles.stickyHeader}>
        <div className={styles.announcementBar}>
          <Container>
            <div className={styles.announcementContent}>
              <p>
                <strong>Belangrijke mededeling:</strong> Mealz on Wheelz stopt
                als foodtruck. Binnenkort starten we als restaurant in Moerbeke.
              </p>
              <a
                href="https://www.trattorialanonna.be/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trattoria La Nonna <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <span className={styles.websiteNote}>Website in ontwikkeling</span>
            </div>
          </Container>
        </div>

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
              </div>

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

        <dialog
          ref={transitionDialogRef}
          className={styles.transitionDialog}
          onClose={() =>
            window.sessionStorage.setItem("mow-transition-note-dismissed", "true")
          }
          aria-labelledby="transition-title"
        >
          <button
            type="button"
            className={styles.dialogClose}
            onClick={dismissTransitionNote}
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
          <p className={styles.dialogEyebrow}>Belangrijke mededeling</p>
          <h2 id="transition-title">We slaan een nieuwe weg in</h2>
          <p>
            De foodtruckactiviteiten van Mealz on Wheelz stoppen. Binnenkort
            starten we als restaurant in Moerbeke.
          </p>
          <p className={styles.dialogWebsiteNote}>Website in ontwikkeling</p>
          <a
            className={styles.dialogLink}
            href="https://www.trattorialanonna.be/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bekijk Trattoria La Nonna <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </dialog>
      </div>

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

        </nav>
      </div>
    </>
  );
}
